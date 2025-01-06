declare module 'studiocms:markdown-remark' {
	export const Markdown: typeof import('../../../src/integration/markdown').Markdown;
	export const render: typeof import('../../../src/integration/markdown').render;
}

declare module 'studiocms:markdown-remark/user-components' {
	export const componentMap: Record<string, string>;

	export const componentKeys: string[];
}
