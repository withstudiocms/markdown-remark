import type { AstroConfig } from 'astro';
import type { RenderTemplateResult } from 'astro/runtime/server/render/astro/render-template.js';
import type { ComponentSlotValue } from 'astro/runtime/server/render/slot.js';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import type { HTMLString } from '../processor/HTMLString.js';
import type { MarkdownHeading } from '../processor/index.js';
import type { CalloutConfig } from './schema.js';

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

export interface RenderComponents {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	$$result?: any;
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
	callouts: CalloutConfig;
}
