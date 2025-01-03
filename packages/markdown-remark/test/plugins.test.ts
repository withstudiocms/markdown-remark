import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from '../dist/index.js';

describe('plugins', () => {
	it('should be able to get file path when passing fileURL', async () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let context: { path: any };

		const processor = await createMarkdownProcessor({
			remarkPlugins: [
				() => {
					const transformer = (_tree, file) => {
						context = file;
					};
					return transformer;
				},
			],
		});

		await processor.render('test', {
			// @ts-expect-error - this is for internal testing and usage
			fileURL: new URL('virtual.md', import.meta.url),
		});

		// @ts-expect-error - this is okay.
		expect(typeof context).toBe('object');
		// @ts-expect-error - this is okay.
		expect(context.path).toBe(fileURLToPath(new URL('virtual.md', import.meta.url)));
	});
});
