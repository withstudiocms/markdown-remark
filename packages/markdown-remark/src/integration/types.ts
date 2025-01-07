import type { AstroConfig, SSRResult } from 'astro';
import type { RenderTemplateResult } from 'astro/runtime/server/render/astro/render-template.js';
import type { ComponentSlotValue } from 'astro/runtime/server/render/slot.js';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import type { HTMLString } from '../processor/HTMLString.js';
import type { MarkdownHeading } from '../processor/index.js';
import type { StudioCMSMarkdownExtendedConfig } from './schema.js';

/**
 * Represents the response from rendering a markdown document.
 */
export interface RenderResponse {
	/**
	 * The rendered HTML content as a string.
	 */
	html: HTMLString;

	/**
	 * The HTML content of the markdown document before rendering.
	 *
	 * use this with astro's `set:html` prop to render markdown content as HTML
	 */
	code: string;

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

export interface RenderComponents {
	$$result: SSRResult;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	components?: Record<string, any>;
}

export interface MarkdownComponentAttributes {
	content: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	components?: Record<string, any>;
	sanitizeOpts?: SanitizeOptions;
}

export interface Props extends MarkdownComponentAttributes {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[name: string]: any;
}

export interface ComponentSlots {
	default: ComponentSlotValue | RenderTemplateResult;
}
/**
 * Interface representing shared configuration for markdown.
 *
 * @interface Shared
 * @property {AstroConfig['markdown']} markdownConfig - The markdown configuration from AstroConfig.
 */
export interface Shared {
	markdownConfig: AstroConfig['markdown'];
	studiocms: StudioCMSMarkdownExtendedConfig;
}
