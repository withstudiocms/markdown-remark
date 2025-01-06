import { z } from 'astro/zod';

/**
 * Options for the Markdown Callouts.
 */
const CalloutsSchema = z
	.object({
		/**
		 * The theme to use for callouts.
		 */
		theme: z
			.union([z.literal('github'), z.literal('obsidian'), z.literal('vitepress')])
			.optional()
			.default('obsidian'),
	})
	.optional()
	.default({});

/**
 * Extended options for the Astro Integration for Markdown Remark. Used to control how Markdown is processed.
 */
const MarkdownSchema = z
	.object({
		/**
		 * Configures the callouts theme.
		 */
		callouts: CalloutsSchema,

		/**
		 * Configures the user defined components for the Markdown processor.
		 */
		components: z.record(z.string(), z.string()).optional().default({}),
	})
	.optional()
	.default({});

/**
 * Options for the Markdown Remark processor.
 */
export const MarkdownRemarkOptionsSchema = z
	.object({
		/**
		 * Inject CSS for the Markdown processor.
		 */
		injectCSS: z.boolean().optional().default(true),

		/**
		 * Extended options for the Astro Integration for Markdown Remark. Used to control how Markdown is processed.
		 */
		markdown: MarkdownSchema,
	})
	.optional()
	.default({});

/**
 * Options for the Markdown Remark processor.
 */
export type MarkdownRemarkOptions = typeof MarkdownRemarkOptionsSchema._input;
