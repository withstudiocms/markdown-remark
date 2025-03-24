import { runHighlighterWithAstro } from '@astrojs/prism/dist/highlighter';
import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { highlightCodeBlocks } from './highlight.js';

/**
 * A rehype plugin to highlight code blocks using Prism.
 *
 * This plugin processes the Markdown AST and highlights code blocks
 * using the specified language. It uses the `runHighlighterWithAstro`
 * function to perform the syntax highlighting and returns the highlighted
 * HTML wrapped in a `<pre>` and `<code>` tag.
 *
 * @returns A function that processes the Markdown AST and highlights code blocks.
 */
export const rehypePrism: Plugin<[string[]?], Root> = (excludeLangs) => {
	return async (tree) => {
		await highlightCodeBlocks(
			tree,
			(code, language) => {
				const { html, classLanguage } = runHighlighterWithAstro(language, code);

				return Promise.resolve(
					`<pre class="${classLanguage}" data-language="${language}"><code is:raw class="${classLanguage}">${html}</code></pre>`
				);
			},
			excludeLangs
		);
	};
};
