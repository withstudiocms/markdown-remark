import { beforeEach, describe, expect, it } from 'vitest';
import { type MarkdownProcessor, createMarkdownProcessor } from '../dist/processor/index.js';

describe('collect images', () => {
	let processor: MarkdownProcessor;

	beforeEach(async () => {
		processor = await createMarkdownProcessor();
	});

	it('should collect inline image paths', async () => {
		const markdown = 'Hello ![inline image url](./img.png)';
		const fileURL = 'file.md';

		const {
			code,
			metadata: { imagePaths },
			// @ts-expect-error - fileURL is for internal testing and usage
		} = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			'<p>Hello <img src="./img.png" alt="inline image url" __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;./img.png&#x22;,&#x22;alt&#x22;:&#x22;inline image url&#x22;,&#x22;index&#x22;:0}"></p>'
		);

		expect(imagePaths).toEqual(['./img.png']);
	});

	it('should add image paths from definition', async () => {
		const markdown = 'Hello ![image ref][img-ref]\n\n[img-ref]: ./img.webp';
		const fileURL = 'file.md';

		// @ts-expect-error - fileURL is for internal testing and usage
		const { code, metadata } = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			'<p>Hello <img src="./img.webp" alt="image ref" __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;./img.webp&#x22;,&#x22;alt&#x22;:&#x22;image ref&#x22;,&#x22;index&#x22;:0}"></p>'
		);

		expect(metadata.imagePaths).toEqual(['./img.webp']);
	});
});
