import rehypeAutoLink from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { HTMLString } from './HTMLString.js';
import rehypeCallouts from './callouts/index.js';
import { loadPlugins } from './load-plugins.js';
import { rehypeAutolinkOptions } from './rehype-autolink-headings.js';
import { rehypeHeadingIds } from './rehype-collect-headings.js';
import { rehypeImages } from './rehype-images.js';
import { rehypePrism } from './rehype-prism.js';
import { rehypeShiki } from './rehype-shiki.js';
import { remarkCollectImages } from './remark-collect-images.js';
import remarkDiscordSubtext from './remark-discord-subtext.js';
import type {
	MarkdownProcessor,
	MarkdownProcessorRenderResult,
	StudioCMSCalloutOptions,
	StudioCMSMarkdownOptions,
} from './types.js';

export { rehypeAutoLink };
export { rehypeAutolinkOptions } from './rehype-autolink-headings.js';
export {
	default as rehypeCallouts,
	type CalloutConfig,
	type HtmlTagNamesConfig,
	type RehypeCalloutsOptions,
	type UserOptions,
} from './callouts/index.js';
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
export { HTMLString } from './HTMLString.js';
export * from './types.js';

export const markdownConfigDefaults: Required<StudioCMSMarkdownOptions> = {
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
	studiocms: {
		callouts: {
			theme: 'obsidian',
		},
		autolink: true,
		discordSubtext: true,
	},
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
	opts?: StudioCMSMarkdownOptions
): Promise<MarkdownProcessor> {
	// const {
	// 	syntaxHighlight = markdownConfigDefaults.syntaxHighlight,
	// 	shikiConfig = markdownConfigDefaults.shikiConfig,
	// 	remarkPlugins = markdownConfigDefaults.remarkPlugins,
	// 	rehypePlugins = markdownConfigDefaults.rehypePlugins,
	// 	remarkRehype: remarkRehypeOptions = markdownConfigDefaults.remarkRehype,
	// 	gfm = markdownConfigDefaults.gfm,
	// 	smartypants = markdownConfigDefaults.smartypants,
	// 	studiocms = markdownConfigDefaults.studiocms,
	// } = opts ?? {};

	const options = {
		syntaxHighlight: opts?.syntaxHighlight ?? markdownConfigDefaults.syntaxHighlight,
		shikiConfig: opts?.shikiConfig ?? markdownConfigDefaults.shikiConfig,
		remarkPlugins: opts?.remarkPlugins ?? markdownConfigDefaults.remarkPlugins,
		rehypePlugins: opts?.rehypePlugins ?? markdownConfigDefaults.rehypePlugins,
		remarkRehype: opts?.remarkRehype ?? markdownConfigDefaults.remarkRehype,
		gfm: opts?.gfm ?? markdownConfigDefaults.gfm,
		smartypants: opts?.smartypants ?? markdownConfigDefaults.smartypants,
		studiocms: opts?.studiocms ?? markdownConfigDefaults.studiocms,
	};

	let autolink = true;
	let calloutsEnabled = true;
	let calloutsConfig: StudioCMSCalloutOptions = { theme: 'obsidian' };
	let discordSubtext = true;

	if (typeof options.studiocms === 'boolean') {
		autolink = options.studiocms;
		calloutsEnabled = options.studiocms;
		discordSubtext = options.studiocms;
	} else if (typeof options.studiocms === 'object') {
		autolink = options.studiocms.autolink ?? autolink;
		calloutsEnabled = options.studiocms.callouts !== false;
		if (typeof options.studiocms.callouts === 'object') {
			calloutsConfig = options.studiocms.callouts;
		}
		discordSubtext = options.studiocms.discordSubtext ?? discordSubtext;
	}

	const loadedRemarkPlugins = await Promise.all(loadPlugins(options.remarkPlugins));
	const loadedRehypePlugins = await Promise.all(loadPlugins(options.rehypePlugins));

	// Initialize the parser
	const parser = unified().use(remarkParse);

	// gfm
	if (options.gfm) {
		parser.use(remarkGfm);
	}

	// smartypants
	if (options.smartypants) {
		parser.use(remarkSmartypants);
	}

	// Discord subtext
	if (discordSubtext) {
		parser.use(remarkDiscordSubtext);
	}

	// User remark plugins
	for (const loadedRemark of loadedRemarkPlugins) {
		parser.use(loadedRemark[0], loadedRemark[1]);
	}

	// Apply later in case user plugins resolve relative image paths
	parser.use(remarkCollectImages);

	// Remark -> Rehype
	parser.use(remarkRehype, {
		allowDangerousHtml: true,
		passThrough: [],
		...options.remarkRehype,
	});

	// Syntax highlighting
	if (options.syntaxHighlight === 'shiki') {
		parser.use(rehypeShiki, options.shikiConfig);
	} else if (options.syntaxHighlight === 'prism') {
		parser.use(rehypePrism);
	}

	// User rehype plugins
	for (const loadedRehype of loadedRehypePlugins) {
		parser.use(loadedRehype[0], loadedRehype[1]);
	}

	// Images / Assets support
	parser.use(rehypeImages());

	// Headings
	parser.use(rehypeHeadingIds);

	// Autolink headings
	if (autolink) {
		parser.use(rehypeAutoLink, rehypeAutolinkOptions);
	}

	// Callouts
	if (calloutsEnabled) {
		parser.use(rehypeCallouts, calloutsConfig);
	}

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
				const newErr = prefixError(err, `Failed to parse Markdown file "${vfile.path}"`);
				console.error(newErr);
				throw newErr;
			});

			return {
				code: String(result.value),
				astroHTML: new HTMLString(result.value),
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
