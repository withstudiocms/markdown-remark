import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { highlightCodeBlocks } from './highlight.js';
import { type ShikiHighlighter, createShikiHighlighter } from './shiki.js';
import type { ShikiConfig } from './types.js';

/**
 * A rehype plugin to highlight code blocks using Shiki.
 *
 * @param {ShikiConfig} [config] - Optional configuration for the Shiki highlighter.
 * @returns {Plugin<[ShikiConfig?], Root>} A rehype plugin function.
 *
 * The plugin initializes a Shiki highlighter asynchronously and uses it to transform
 * code blocks in the Markdown AST into highlighted HTML elements.
 *
 * The configuration object can include the following properties:
 * - `langs`: An array of languages to load for the highlighter.
 * - `theme`: The theme to use for highlighting.
 * - `themes`: An array of themes to load for the highlighter.
 * - `langAlias`: An object mapping language aliases to their canonical names.
 * - `wrap`: A boolean indicating whether to wrap the highlighted code.
 * - `defaultColor`: The default color to use for the highlighted code.
 * - `transformers`: An array of transformers to apply to the highlighted code.
 *
 * @example
 * ```typescript
 * import { rehypeShiki } from './processor/rehype-shiki';
 * import { unified } from 'unified';
 * import rehypeParse from 'rehype-parse';
 * import rehypeStringify from 'rehype-stringify';
 *
 * const processor = unified()
 *   .use(rehypeParse)
 *   .use(rehypeShiki, { theme: 'nord' })
 *   .use(rehypeStringify);
 *
 * const result = await processor.process('<pre><code class="language-js">const x = 42;</code></pre>');
 * console.log(result.toString());
 * ```
 */
export const rehypeShiki: Plugin<[ShikiConfig, string[]?], Root> = (config, excludeLangs) => {
	let highlighterAsync: Promise<ShikiHighlighter> | undefined;

	return async (tree) => {
		highlighterAsync ??= createShikiHighlighter({
			langs: config?.langs,
			theme: config?.theme,
			themes: config?.themes,
			langAlias: config?.langAlias,
		});
		const highlighter = await highlighterAsync;

		await highlightCodeBlocks(
			tree,
			(code, language, options) => {
				return highlighter.codeToHast(code, language, {
					meta: options?.meta,
					wrap: config?.wrap,
					defaultColor: config?.defaultColor,
					transformers: config?.transformers,
				});
			},
			excludeLangs
		);
	};
};
