declare module 'studiocms:markdown-remark' {
	export const Markdown: typeof import('../../../src/virtual-components.js').Markdown;
	export const render: typeof import('../../../src/virtual-components.js').render;
}

declare module 'studiocms:markdown-remark/user-components' {
	export const componentMap: Record<string, string>;
}
