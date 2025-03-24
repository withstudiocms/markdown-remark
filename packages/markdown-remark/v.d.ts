declare module 'studiocms:markdown-remark' {
	export const Markdown: typeof import('./src/virtual-components.js').Markdown;
	export const render: typeof import('./src/virtual-components.js').render;
	export type Props = import('./src/virtual-components.js').Props;
	export type RenderResponse = import('./src/virtual-components.js').RenderResponse;
}

declare module 'studiocms:markdown-remark/user-components' {
	export const componentKeys: string[];
}
