declare module 'studiocms:markdown-remark' {
	export const Markdown: typeof import('./src/integration/markdown.js').Markdown;
	export const render: typeof import('./src/integration/markdown.js').render;
}

declare module 'studiocms:markdown-remark/user-components' {
	export const componentKeys: string[];
}
