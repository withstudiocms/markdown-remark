import type * as hast from 'hast';
import { toString as toStr } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape as esc } from 'html-escaper';
import rehypeAutoLink from 'rehype-autolink-headings';
import type { Options as rehypeAutolinkHeadingsOptions } from 'rehype-autolink-headings';
import type * as unified from 'unified';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type RehypePlugin<PluginParameters extends any[] = any[]> = unified.Plugin<
	PluginParameters,
	hast.Root
>;

const createSROnlyLabel = (text: string) => {
	return h('span', { 'is:raw': true, class: 'sr-only' }, `'Read the “', ${esc(text)}, '” section'`);
};

export const rehypeAutolinkHeadings: [RehypePlugin, rehypeAutolinkHeadingsOptions] = [
	rehypeAutoLink,
	{
		properties: {
			class: 'anchor-link',
		},
		behavior: 'after',
		group: ({ tagName }) =>
			h('div', {
				tabIndex: -1,
				class: `heading-wrapper level-${tagName}`,
			}),
		content: (heading) => [
			h(
				'span',
				{ ariaHidden: 'true', class: 'anchor-icon' },
				h(
					'svg',
					{
						width: 16,
						height: 16,
						viewBox: '0 0 24 24',
						fill: 'none',
						stroke: 'currentColor',
						strokeWidth: 1.5,
					},
					h('path', {
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						d: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
					})
				)
			),
			createSROnlyLabel(toStr(heading)),
		],
	},
];

/**
 * Pre-made style tag for the anchor links used in the astroHTML result.
 */
export const styleTag = `
<style is:global>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

.heading-wrapper {
	--icon-size: 1.5rem;
	--icon-spacing: 0.25em;
	--anchor-color: #808080;
	--anchor-hover-color: #6e6e6e;
	align-items: center;
}

.heading-wrapper svg {
	display: inline;
	width: var(--icon-size);
	height: var(--icon-size);
}

.heading-wrapper > :first-child {
	margin-inline-end: calc(var(--icon-size) + var(--icon-spacing));
	display: inline;
}

.anchor-link {
	margin-inline-start: calc(-1 * (var(--icon-size)));
	color: var(--anchor-color);
}

.anchor-link .sr-only {
	-webkit-user-select: none;
	user-select: none;
}

.anchor-link:hover,
.anchor-link:focus {
	color: var(--anchor-hover-color);
}

@media (hover: hover) {
	.anchor-link {
		opacity: 0;
	}
}

.heading-wrapper:hover > .anchor-link,
.anchor-link:focus {
	opacity: 1;
}

@media (min-width: 95em) {
	.heading-wrapper {
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-end;
		gap: var(--icon-spacing);
		margin-inline-start: calc(-1 * var(--icon-size) + var(--icon-spacing));
	}

	.heading-wrapper > :first-child,
	.anchor-link {
		margin: 0;
	}
}
</style>
`;
