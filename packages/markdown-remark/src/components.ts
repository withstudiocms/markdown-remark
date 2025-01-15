import { createMarkdownProcessor } from '@studiocms/markdown-remark-processor';
import type { SSRResult } from 'astro';
import { HTMLString, renderSlot } from 'astro/runtime/server/index.js';
import type { ComponentSlots, MarkdownComponentAttributes, Props } from './types.js';
import { createComponentProxy, transformHTML } from './utils.js';

const processor = await createMarkdownProcessor();

// This file is the Generic version of the <Markdown /> Astro component.
// This version does not include anything requiring the markdown-remark Astro
// integration. You can use this version of the component in any Astro project
// without needing to add the integration to your project.

// @ts-ignore
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Markdown: (props: Props) => any = Object.assign(
	function Markdown(
		result: SSRResult,
		attr: MarkdownComponentAttributes,
		{ default: slotted }: ComponentSlots
	) {
		return {
			get [Symbol.toStringTag]() {
				return 'AstroComponent';
			},
			async *[Symbol.asyncIterator]() {
				if (typeof attr.content === 'string') {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					let components: Record<string, any> = {};

					if (attr.components) {
						components = createComponentProxy(result, attr.components);
					}

					const { code } = await processor.render(attr.content);

					const html = await transformHTML(code, components, attr.sanitizeOpts);

					yield new HTMLString(html);
				} else {
					yield renderSlot(result, slotted);
				}
			},
		};
	},
	{
		isAstroComponentFactory: true,
	}
);
