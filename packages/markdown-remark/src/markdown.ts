import {
	HTMLString,
	type MarkdownProcessorRenderOptions,
	createMarkdownProcessor,
} from '@studiocms/markdown-remark-processor';
import type { SSRResult } from 'astro';
import { renderSlot } from 'astro/runtime/server/index.js';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import { importComponentsKeys } from './runtime.js';
import { TransformToProcessor } from './schema.js';
import { shared } from './shared.js';
import type {
	ComponentSlots,
	MarkdownComponentAttributes,
	Props,
	RenderComponents,
	RenderResponse,
} from './types.js';
import { createComponentProxy, mergeRecords, transformHTML } from './utils.js';

export type { Props, RenderResponse } from './types.js';

const predefinedComponents = await importComponentsKeys();
const studiocmsMarkdownExtended = TransformToProcessor.parse(shared.studiocms);

const processor = await createMarkdownProcessor({
	...shared.markdownConfig,
	...studiocmsMarkdownExtended,
});

/**
 * Renders the given markdown content using the specified options.
 *
 * @param content - The markdown content to be rendered.
 * @param options - The options to configure the markdown processor.
 * @returns A promise that resolves to a RenderResponse object containing the rendered HTML and metadata.
 */
export async function render(
	content: string,
	options?: MarkdownProcessorRenderOptions,
	componentProxy?: RenderComponents,
	sanitizeOpts?: SanitizeOptions
): Promise<RenderResponse> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let componentsRendered: Record<string, any> = {};

	if (componentProxy) {
		componentsRendered = createComponentProxy(
			componentProxy.$$result,
			mergeRecords(predefinedComponents, componentProxy.components ?? {})
		);
	}

	const { code, metadata } = await processor.render(content, options);

	const html = await transformHTML(
		code,
		componentsRendered,
		sanitizeOpts ?? shared.studiocms.sanitize
	);

	return {
		html: new HTMLString(html),
		code: html,
		meta: metadata,
	};
}

/**
 * A factory function for creating an Astro component that renders Markdown content.
 *
 * @param props - The properties for the component.
 * @returns An object representing the Astro component.
 *
 * The returned object has the following properties:
 * - `get [Symbol.toStringTag]`: A getter that returns the string 'AstroComponent'.
 * - `async *[Symbol.asyncIterator]`: An async iterator that yields the rendered HTML content.
 *
 * The `Markdown` function takes the following parameters:
 *
 * @param result - The SSR result object.
 * @param attributes - An object containing the content to be rendered.
 * @param slots - An object containing the default slot content.
 *
 * The `attributes` object must have a `content` property which is a string containing the Markdown content to be rendered.
 *
 * The `slots` object must have a `default` property which is either a `ComponentSlotValue` or a `RenderTemplateResult`.
 *
 * If the `content` property is a string, the async iterator yields the rendered HTML content.
 * Otherwise, it yields the rendered slot content.
 *
 * The `Markdown` function is also assigned an `isAstroComponentFactory` property with the value `true`.
 */
// @ts-ignore
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Markdown: (props: Props) => any = Object.assign(
	function Markdown(
		$$result: SSRResult,
		{ content, components, sanitizeOpts }: MarkdownComponentAttributes,
		{ default: slotted }: ComponentSlots
	) {
		return {
			get [Symbol.toStringTag]() {
				return 'AstroComponent';
			},
			async *[Symbol.asyncIterator]() {
				if (typeof content === 'string') {
					const { html } = await render(
						content,
						{
							// @ts-ignore - fileURL is not exposed in the public API
							fileURL: new URL(import.meta.url),
						},
						{ $$result, components },
						sanitizeOpts
					);
					yield html;
				} else {
					yield renderSlot($$result, slotted);
				}
			},
		};
	},
	{
		isAstroComponentFactory: true,
	}
);
