import { HTMLString } from './HTMLString.js';
import type {
	AstroMarkdownOptions,
	MarkdownProcessor,
	MarkdownProcessorRenderResult,
} from './types.js';

import { loadPlugins } from './load-plugins.js';
import { rehypeHeadingIds } from './rehype-collect-headings.js';
import { rehypePrism } from './rehype-prism.js';
import { rehypeShiki } from './rehype-shiki.js';
import { remarkCollectImages } from './remark-collect-images.js';

import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { rehypeImages } from './rehype-images.js';

import { rehypeAutolinkHeadings, styleTag } from './rehype-autolink-headings.js';
export { rehypeHeadingIds } from './rehype-collect-headings.js';
export { remarkCollectImages } from './remark-collect-images.js';
export { rehypePrism } from './rehype-prism.js';
export { rehypeShiki } from './rehype-shiki.js';
export {
	isFrontmatterValid,
	extractFrontmatter,
	parseFrontmatter,
	type ParseFrontmatterOptions,
	type ParseFrontmatterResult,
} from './frontmatter.js';
export {
	createShikiHighlighter,
	type ShikiHighlighter,
	type CreateShikiHighlighterOptions,
	type ShikiHighlighterHighlightOptions,
} from './shiki.js';
export * from './types.js';

export const markdownConfigDefaults: Required<AstroMarkdownOptions> = {
	syntaxHighlight: 'shiki',
	shikiConfig: {
		langs: [],
		theme: 'github-dark',
		themes: {},
		wrap: false,
		transformers: [],
		langAlias: {},
	},
	remarkPlugins: [],
	rehypePlugins: [],
	remarkRehype: {},
	gfm: true,
	smartypants: true,
};

/**
 * Creates a Markdown processor with the specified options.
 *
 * @param opts - Optional configuration options for the Markdown processor.
 * @returns A promise that resolves to a MarkdownProcessor instance.
 *
 * @remarks
 * The processor uses unified to parse and transform Markdown content. It supports various plugins for syntax highlighting,
 * remark and rehype transformations, and image handling.
 *
 * @example
 * ```typescript
 * const processor = await createMarkdownProcessor({
 *   syntaxHighlight: 'shiki',
 *   gfm: true,
 *   smartypants: true,
 * });
 * const result = await processor.render('# Hello World');
 * console.log(result.code);
 * ```
 *
 * @public
 */
export async function createMarkdownProcessor(
	opts?: AstroMarkdownOptions
): Promise<MarkdownProcessor> {
	const {
		syntaxHighlight = markdownConfigDefaults.syntaxHighlight,
		shikiConfig = markdownConfigDefaults.shikiConfig,
		remarkPlugins = markdownConfigDefaults.remarkPlugins,
		rehypePlugins = markdownConfigDefaults.rehypePlugins,
		remarkRehype: remarkRehypeOptions = markdownConfigDefaults.remarkRehype,
		gfm = markdownConfigDefaults.gfm,
		smartypants = markdownConfigDefaults.smartypants,
	} = opts ?? {};

	const loadedRemarkPlugins = await Promise.all(loadPlugins(remarkPlugins));
	const loadedRehypePlugins = await Promise.all(loadPlugins(rehypePlugins));

	const parser = unified().use(remarkParse);

	// gfm and smartypants
	if (gfm) {
		parser.use(remarkGfm);
	}
	if (smartypants) {
		parser.use(remarkSmartypants);
	}

	// User remark plugins
	for (const [plugin, pluginOpts] of loadedRemarkPlugins) {
		parser.use(plugin, pluginOpts);
	}

	// Apply later in case user plugins resolve relative image paths
	parser.use(remarkCollectImages);

	// Remark -> Rehype
	parser.use(remarkRehype, {
		allowDangerousHtml: true,
		passThrough: [],
		...remarkRehypeOptions,
	});

	// Syntax highlighting
	if (syntaxHighlight === 'shiki') {
		parser.use(rehypeShiki, shikiConfig);
	} else if (syntaxHighlight === 'prism') {
		parser.use(rehypePrism);
	}

	// User rehype plugins
	for (const [plugin, pluginOpts] of loadedRehypePlugins) {
		parser.use(plugin, pluginOpts);
	}

	// Images / Assets support
	parser.use(rehypeImages());

	// Headings
	parser.use(rehypeHeadingIds);

	parser.use(rehypeAutolinkHeadings[0], rehypeAutolinkHeadings[1]);

	// Stringify to HTML
	parser.use(rehypeRaw).use(rehypeStringify, { allowDangerousHtml: true });

	return {
		/**
		 * Renders the given markdown content using the specified rendering options.
		 *
		 * @param content - The markdown content to be rendered.
		 * @param renderOpts - The options to be used for rendering, including file URL and frontmatter.
		 * @returns A promise that resolves to a MarkdownProcessorRenderResult object containing the rendered code, HTML string, and metadata.
		 * @throws Will throw an error if the markdown parsing fails, with the error message prefixed by the input filename.
		 */
		async render(content, renderOpts): Promise<MarkdownProcessorRenderResult> {
			const vfile = new VFile({
				value: content,
				path: renderOpts?.fileURL,
				data: {
					astro: {
						frontmatter: renderOpts?.frontmatter ?? {},
					},
				},
			});

			const result = await parser.process(vfile).catch((err) => {
				// Ensure that the error message contains the input filename
				// to make it easier for the user to fix the issue
				err = prefixError(err, `Failed to parse Markdown file "${vfile.path}"`);
				console.error(err);
				throw err;
			});

			return {
				code: String(result.value),
				astroHTML: new HTMLString(styleTag + result.value),
				metadata: {
					headings: result.data.astro?.headings ?? [],
					imagePaths: result.data.astro?.imagePaths ?? [],
					frontmatter: result.data.astro?.frontmatter ?? {},
				},
			};
		},
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function prefixError(err: any, prefix: string): any {
	// If the error is an object with a `message` property, attempt to prefix the message
	if (err?.message) {
		try {
			err.message = `${prefix}:\n${err.message}`;
			return err;
		} catch {
			// Any errors here are ok, there's fallback code below
		}
	}

	// If that failed, create a new error with the desired message and attempt to keep the stack
	const wrappedError = new Error(`${prefix}${err ? `: ${err}` : ''}`);
	try {
		wrappedError.stack = err.stack;
		wrappedError.cause = err;
	} catch {
		// It's ok if we could not set the stack or cause - the message is the most important part
	}

	return wrappedError;
}
