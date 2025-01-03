import type { Image, ImageReference } from 'mdast';
import { definitions } from 'mdast-util-definitions';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

/**
 * A remark plugin to collect image URLs from a Markdown AST.
 *
 * This function returns a transformer function that traverses the Markdown AST
 * and collects URLs of images and image references that should be optimized.
 * The collected URLs are then stored in the `vfile.data.astro.imagePaths` array.
 *
 * @returns A transformer function that processes the Markdown AST and collects image URLs.
 *
 * @example
 * ```typescript
 * import { remarkCollectImages } from './remark-collect-images';
 * import { unified } from 'unified';
 * import remarkParse from 'remark-parse';
 * import { VFile } from 'vfile';
 *
 * const processor = unified()
 *   .use(remarkParse)
 *   .use(remarkCollectImages);
 *
 * const file = new VFile({ path: 'example.md', contents: '![alt text](image.png)' });
 * processor.process(file).then(() => {
 *   console.log(file.data.astro.imagePaths); // ['image.png']
 * });
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function remarkCollectImages(): (tree: any, vfile: VFile) => void {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (tree: any, vfile: VFile) => {
		if (typeof vfile?.path !== 'string') return;

		const definition = definitions(tree);
		const imagePaths = new Set<string>();
		visit(tree, ['image', 'imageReference'], (node: Image | ImageReference) => {
			if (node.type === 'image') {
				if (shouldOptimizeImage(node.url)) imagePaths.add(decodeURI(node.url));
			}
			if (node.type === 'imageReference') {
				const imageDefinition = definition(node.identifier);
				if (imageDefinition) {
					if (shouldOptimizeImage(imageDefinition.url))
						imagePaths.add(decodeURI(imageDefinition.url));
				}
			}
		});

		vfile.data.astro ??= {};
		vfile.data.astro.imagePaths = Array.from(imagePaths);
	};
}

function shouldOptimizeImage(src: string) {
	// Optimize anything that is NOT external or an absolute path to `public/`
	return !isValidUrl(src) && !src.startsWith('/');
}

function isValidUrl(str: string): boolean {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
}
