import type { Root } from 'hast';
import { isElement } from 'hast-util-is-element';
import { h } from 'hastscript';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { UserOptions } from './types.js';
import {
	calloutRegex,
	expandCallouts,
	findFirstNewline,
	generateStyle,
	getConfig,
	getFoldIcon,
	getIndicator,
	handleBrAfterTitle,
	splitByNewlineRegex,
} from './utils.js';

/**
 * A rehype plugin for rendering themed callouts (admonitions/alerts).
 *
 * @param options
 *   Optional options to configure the output.
 * @returns
 *   A unified transformer.
 */
const rehypeCallouts: Plugin<[UserOptions?], Root> = (options) => {
	const config = getConfig(options);

	return (tree) => {
		visit(tree, 'element', (node) => {
			// parse only blockquote
			if (!isElement(node, 'blockquote')) {
				return;
			}

			// strip useless nodes, leftovers from markdown
			node.children = node.children.filter((c) => !(c.type === 'text' && c.value === '\n'));

			// empty blockquote don't concern us
			if (node.children.length === 0) return;

			// the first element must be a paragraph
			if (!isElement(node.children[0], 'p')) return;

			// empty paragraphs
			const firstParagraph = node.children[0];
			if (firstParagraph.children.length === 0) return;

			// ignore paragraphs that don't start with plaintext
			if (firstParagraph.children[0].type !== 'text') return;

			// handle aliases
			const expandedCallouts = expandCallouts(config.callouts, config.aliases);

			// check for matches
			const match = calloutRegex.exec(firstParagraph.children[0].value);
			calloutRegex.lastIndex = 0;
			if (
				!match?.groups ||
				!Object.keys(expandedCallouts).includes(match.groups.type.toLowerCase())
			)
				return;

			// remove double spaces ('br') after title
			firstParagraph.children = handleBrAfterTitle(firstParagraph.children);

			// handle no customized title
			// check the first paragraph which may include a newline character (\n)
			const borderingIndex = findFirstNewline(firstParagraph.children);

			// split it to two new elements
			if (borderingIndex !== -1) {
				const borderingElement = firstParagraph.children[borderingIndex];

				if (borderingElement.type !== 'text') return;

				const splitMatch = splitByNewlineRegex.exec(borderingElement.value);
				splitByNewlineRegex.lastIndex = 0;

				if (splitMatch?.groups) {
					const split = splitMatch.groups;

					// handle prefix
					const firstParagraphNewChildren = [
						...node.children[0].children.slice(0, borderingIndex),
						...(split.prefix ? [{ type: 'text' as const, value: split.prefix }] : []),
					];

					// handle suffix & update node.children
					if (split.suffix) {
						const newParagraph = h(
							'p',
							split.suffix,
							node.children[0].children.slice(borderingIndex + 1)
						);

						node.children = [
							{ ...firstParagraph, children: firstParagraphNewChildren },
							newParagraph,
							...node.children.slice(1),
						];
					} else {
						const newParagraph = h('p', node.children[0].children.slice(borderingIndex + 1));

						node.children = [
							{ ...firstParagraph, children: firstParagraphNewChildren },
							newParagraph,
							...node.children.slice(1),
						];
					}
				}
			}

			// match callout format
			const newFirstParagraph = node.children[0];
			if (!isElement(newFirstParagraph)) return;

			const firstTextNode = newFirstParagraph.children[0];
			if (firstTextNode.type !== 'text') return;

			const calloutMatch = calloutRegex.exec(firstTextNode.value);
			calloutRegex.lastIndex = 0;
			if (!calloutMatch?.groups) return;

			// format callout title
			firstTextNode.value = calloutMatch.groups.title;
			newFirstParagraph.tagName = config.htmlTagNames.titleInnerTagName;
			newFirstParagraph.properties.className = ['callout-title-inner'];

			// modify the blockquote element
			// @ts-expect-error (Type '"div" | "details"' is not assignable to type '"blockquote"')
			node.tagName = collapsable ? 'details' : nonCollapsibleContainerTagName;
			node.properties.dir = 'auto';
			node.properties.className = [
				'callout',
				calloutMatch.groups.collapsable && 'callout-collapsible',
			];
			const revisedType = calloutMatch.groups.type.toLowerCase();
			node.properties.style = generateStyle(expandedCallouts[revisedType].color);
			node.properties.open = calloutMatch.groups.collapsable === '+' ? 'open' : undefined;

			// update hast
			node.children = [
				h(
					calloutMatch.groups.collapsable
						? 'summary'
						: config.htmlTagNames.nonCollapsibleTitleTagName,
					{
						className: ['callout-title'],
					},
					calloutMatch.groups.title
						? [
								config.showIndicator
									? getIndicator(expandedCallouts, revisedType, config.htmlTagNames.iconTagName)
									: null,
								node.children[0],
								calloutMatch.groups.collapsable
									? getFoldIcon(config.htmlTagNames.iconTagName)
									: null,
							]
						: [
								config.showIndicator
									? getIndicator(expandedCallouts, revisedType, config.htmlTagNames.iconTagName)
									: null,
								h(
									config.htmlTagNames.titleInnerTagName,
									{ className: ['callout-title-inner'] },
									expandedCallouts[revisedType].title ??
										(config.theme === 'github' || config.theme === 'obsidian'
											? revisedType.charAt(0).toUpperCase() + revisedType.slice(1)
											: revisedType.toUpperCase())
								),
								calloutMatch.groups.collapsable
									? getFoldIcon(config.htmlTagNames.iconTagName)
									: null,
							]
				),
				h(
					calloutMatch.groups.collapsable
						? config.htmlTagNames.collapsibleContentTagName
						: config.htmlTagNames.nonCollapsibleContentTagName,
					{
						className: ['callout-content'],
					},
					node.children.slice(1)
				),
			];
		});
	};
};

export default rehypeCallouts;
export type {
	UserOptions,
	RehypeCalloutsOptions,
	CalloutConfig,
	HtmlTagNamesConfig,
} from './types.js';
