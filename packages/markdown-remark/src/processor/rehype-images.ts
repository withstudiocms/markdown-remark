import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

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
						const { ...props } = node.properties;

						// Initialize or increment occurrence count for this image
						const index = imageOccurrenceMap.get(node.properties.src) || 0;
						imageOccurrenceMap.set(node.properties.src, index + 1);

						node.properties.__ASTRO_IMAGE_ = JSON.stringify({ ...props, index });

						for (const prop in Object.keys(props)) {
							delete node.properties[prop];
						}
					}
				}
			});
		};
}
