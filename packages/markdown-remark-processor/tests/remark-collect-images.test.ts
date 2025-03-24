import { beforeEach, describe, expect, it } from 'vitest';
import { type MarkdownProcessor, createMarkdownProcessor } from '../dist/index.js';

describe('collect images', () => {
	let processor: MarkdownProcessor;

	beforeEach(async () => {
		processor = await createMarkdownProcessor({ image: { domains: ['example.com'] } });
	});

	it('should collect inline image paths', async () => {
		const markdown = 'Hello ![inline image url](./img.png)';
		const fileURL = 'file.md';

		const {
			code,
			metadata: { localImagePaths, remoteImagePaths },
			// @ts-expect-error - fileURL is for internal testing and usage
		} = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			'<p>Hello <img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;./img.png&#x22;,&#x22;alt&#x22;:&#x22;inline image url&#x22;,&#x22;index&#x22;:0}"></p>'
		);

		expect(localImagePaths).toEqual(['./img.png']);
		expect(remoteImagePaths).toEqual([]);
	});

	it('should collect allowed remote image paths', async () => {
		const markdown = 'Hello ![inline remote image url](https://example.com/example.png)';
		const fileURL = 'file.md';

		const {
			code,
			metadata: { localImagePaths, remoteImagePaths },
			// @ts-expect-error - fileURL is for internal testing and usage
		} = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			`<p>Hello <img __ASTRO_IMAGE_="{&#x22;inferSize&#x22;:true,&#x22;src&#x22;:&#x22;https://example.com/example.png&#x22;,&#x22;alt&#x22;:&#x22;inline remote image url&#x22;,&#x22;index&#x22;:0}"></p>`
		);

		expect(localImagePaths).toEqual([]);
		expect(remoteImagePaths).toEqual(['https://example.com/example.png']);
	});

	it('should not collect other remote image paths', async () => {
		const markdown = 'Hello ![inline remote image url](https://google.com/google.png)';
		const fileURL = 'file.md';

		const {
			code,
			metadata: { localImagePaths, remoteImagePaths },
			// @ts-expect-error - fileURL is for internal testing and usage
		} = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			`<p>Hello <img src="https://google.com/google.png" alt="inline remote image url"></p>`
		);

		expect(localImagePaths).toEqual([]);
		expect(remoteImagePaths).toEqual([]);
	});

	it('should add image paths from definition', async () => {
		const markdown =
			'Hello ![image ref][img-ref] ![remote image ref][remote-img-ref]\n\n[img-ref]: ./img.webp\n[remote-img-ref]: https://example.com/example.jpg';
		const fileURL = 'file.md';

		// @ts-expect-error - fileURL is for internal testing and usage
		const { code, metadata } = await processor.render(markdown, { fileURL });

		expect(code).toBe(
			'<p>Hello <img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;./img.webp&#x22;,&#x22;alt&#x22;:&#x22;image ref&#x22;,&#x22;index&#x22;:0}"> <img __ASTRO_IMAGE_="{&#x22;inferSize&#x22;:true,&#x22;src&#x22;:&#x22;https://example.com/example.jpg&#x22;,&#x22;alt&#x22;:&#x22;remote image ref&#x22;,&#x22;index&#x22;:0}"></p>'
		);

		expect(metadata.localImagePaths).toEqual(['./img.webp']);
		expect(metadata.remoteImagePaths).toEqual(['https://example.com/example.jpg']);
	});
});
