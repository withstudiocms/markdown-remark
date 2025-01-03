import type { AstroIntegration } from 'astro';
import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { shared } from './shared.js';

export function markdownRemark(): AstroIntegration {
	const { resolve } = createResolver(import.meta.url);
	return {
		name: '@studiocms/markdown-remark',
		hooks: {
			'astro:config:setup'(params) {
				addVirtualImports(params, {
					name: '@studiocms/markdown-remark',
					imports: {
						'studiocms:markdown-remark': `export * from '${resolve('./markdown.js')}';`,
					},
				});
			},
			'astro:config:done'({ injectTypes, config }) {
				shared.markdownConfig = config.markdown;
				injectTypes({
					filename: 'render.d.ts',
					content: `
                    declare module 'studiocms:markdown-remark' {
                        type MarkdownProcessorRenderOptions = import('@studiocms/markdown-remark').MarkdownProcessorRenderOptions;
                        
                        export const renderMarkdown: (markdown: string, options: MarkdownProcessorRenderOptions) => Promise<{
                            html: string;
                            meta: any;
                        }>;
                    }
                    `,
				});
			},
		},
	};
}
