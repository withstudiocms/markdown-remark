import type { SSRResult } from 'astro';
import { renderSlot } from 'astro/runtime/server/index.js';
import type { RenderTemplateResult } from 'astro/runtime/server/render/astro/render-template.js';
import type { ComponentSlotValue } from 'astro/runtime/server/render/slot.js';
import {
	type MarkdownProcessorRenderOptions,
	createMarkdownProcessor,
} from '../processor/index.js';
import { shared } from './shared.js';

const processor = await createMarkdownProcessor({
	...shared.markdownConfig,
});

export async function render(content: string, options: MarkdownProcessorRenderOptions) {
	const result = await processor.render(content, options);

	return {
		html: result.astroHTML,
		meta: result.metadata,
	};
}

export interface Props {
	content: string;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[name: string]: any;
}

// @ts-ignore
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Markdown: (props: Props) => any = Object.assign(
	function Markdown(
		result: SSRResult,
		attributes: { content: string },
		slots: { default: ComponentSlotValue | RenderTemplateResult }
	) {
		return {
			get [Symbol.toStringTag]() {
				return 'AstroComponent';
			},
			async *[Symbol.asyncIterator]() {
				const mdl = attributes.content;

				if (typeof mdl === 'string') {
					yield (
						await render(mdl, {
							fileURL: new URL(import.meta.url),
						})
					).html;
				} else {
					yield renderSlot(result, slots.default);
				}
			},
		};
	},
	{
		isAstroComponentFactory: true,
	}
);
