import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

/**
 * A rehype plugin to process image elements in the AST.
 *
 * This plugin decodes the `src` attribute of `img` elements and checks if the image path is included
 * in the `astro.imagePaths` array of the VFile's data. If the image path is found, it adds a
 * `__ASTRO_IMAGE_` property to the `img` element's properties, which contains a JSON string with
 * the original properties and an occurrence index. The original properties are then removed.
 *
 * @returns A function that processes the AST and VFile.
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function rehypeImages(): () => (tree: any, file: VFile) => void {
	return () =>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(tree: any, file: VFile) => {
			const imageOccurrenceMap = new Map();

			visit(tree, (node) => {
				if (node.type !== 'element') return;
				if (node.tagName !== 'img') return;

				if (node.properties?.src) {
					node.properties.src = decodeURI(node.properties.src);

					if (file.data.astro?.imagePaths?.includes(node.properties.src)) {
						// Initialize or increment occurrence count for this image
						const index = imageOccurrenceMap.get(node.properties.src) || 0;
						imageOccurrenceMap.set(node.properties.src, index + 1);

						node.properties.__ASTRO_IMAGE_ = JSON.stringify({ ...node.properties, index });

						for (const prop in Object.keys(node.properties)) {
							delete node.properties[prop];
						}
					}
				}
			});
		};
}
