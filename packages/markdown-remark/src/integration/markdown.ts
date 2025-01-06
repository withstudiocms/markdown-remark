import { componentKeys } from 'studiocms:markdown-remark/user-components';
import type { SSRResult } from 'astro';
import { renderSlot } from 'astro/runtime/server/index.js';
import type { RenderTemplateResult } from 'astro/runtime/server/render/astro/render-template.js';
import type { ComponentSlotValue } from 'astro/runtime/server/render/slot.js';
import { transform } from 'ultrahtml';
import swap from 'ultrahtml/transformers/swap';
import { HTMLString } from '../processor/HTMLString.js';
import {
	type MarkdownHeading,
	type MarkdownProcessorRenderOptions,
	createMarkdownProcessor,
} from '../processor/index.js';
import { shared } from './shared.js';
import { createComponentProxy, dedent, importComponentsKeys, mergeRecords } from './utils.js';

const processor = await createMarkdownProcessor({
	...shared.markdownConfig,
	callouts: {
		theme: 'obsidian',
	},
});

const predefinedComponents = await importComponentsKeys(componentKeys);

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
 * Renders the given markdown content using the specified options.
 *
 * @param content - The markdown content to be rendered.
 * @param options - The options to configure the markdown processor.
 * @returns A promise that resolves to a RenderResponse object containing the rendered HTML and metadata.
 */
export async function render(
	content: string,
	options?: MarkdownProcessorRenderOptions,
	_components?: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		$$result: any;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		components?: Record<string, any>;
	}
): Promise<RenderResponse> {
	const allComponents = mergeRecords(predefinedComponents, _components?.components ?? {});

	const componentsRendered = createComponentProxy(_components?.$$result, allComponents);

	const result = await processor.render(content, options);

	const html = await transform(dedent(result.astroHTML.toString()), [swap(componentsRendered)]);
	return {
		html: new HTMLString(html),
		meta: result.metadata,
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
	components?: Record<string, any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[name: string]: any;
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
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		attributes: { content: string; components?: Record<string, any> },
		slots: { default: ComponentSlotValue | RenderTemplateResult }
	) {
		return {
			get [Symbol.toStringTag]() {
				return 'AstroComponent';
			},
			async *[Symbol.asyncIterator]() {
				const mdl = attributes.content;

				if (typeof mdl === 'string') {
					const content = await render(
						mdl,
						{
							fileURL: new URL(import.meta.url),
						},
						{ $$result, components: attributes.components }
					);

					yield content.html;
				} else {
					yield renderSlot($$result, slots.default);
				}
			},
		};
	},
	{
		isAstroComponentFactory: true,
	}
);
