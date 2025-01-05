import type { SSRResult } from 'astro';
import { renderSlot } from 'astro/runtime/server/index.js';
import type { RenderTemplateResult } from 'astro/runtime/server/render/astro/render-template.js';
import type { ComponentSlotValue } from 'astro/runtime/server/render/slot.js';
import type { HTMLString } from '../processor/HTMLString.js';
import {
	type MarkdownHeading,
	type MarkdownProcessorRenderOptions,
	createMarkdownProcessor,
} from '../processor/index.js';
import { shared } from './shared.js';

const processor = await createMarkdownProcessor({
	...shared.markdownConfig,
	callouts: {
		theme: 'obsidian',
	},
});

/**
 * Represents the response from rendering a markdown document.
 */
export interface RenderResponse {
	/**
	 * The rendered HTML content as a string.
	 */
	html: HTMLString;

	/**
	 * Metadata extracted from the markdown document.
	 */
	meta: {
		/**
		 * An array of headings found in the markdown document.
		 */
		headings: MarkdownHeading[];

		/**
		 * An array of image paths found in the markdown document.
		 */
		imagePaths: string[];

		/**
		 * The frontmatter data extracted from the markdown document.
		 *
		 * @remarks
		 * The frontmatter is represented as a record with string keys and values of any type.
		 */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		frontmatter: Record<string, any>;
	};
}

/**
 * Interface representing the properties for a markdown component.
 *
 * @property content - The markdown content as a string.
 * @property [name: string] - An index signature allowing additional properties with string keys and values of any type.
 */
export interface Props {
	content: string;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[name: string]: any;
}

/**
 * Renders the given markdown content using the specified options.
 *
 * @param content - The markdown content to be rendered.
 * @param options - The options to configure the markdown processor.
 * @returns A promise that resolves to a RenderResponse object containing the rendered HTML and metadata.
 */
export async function render(
	content: string,
	options?: MarkdownProcessorRenderOptions
): Promise<RenderResponse> {
	const result = await processor.render(content, options);

	return {
		html: result.astroHTML,
		meta: result.metadata,
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
