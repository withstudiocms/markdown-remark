import { beforeAll, describe, expect, test } from 'vitest';
import { type MarkdownProcessor, createMarkdownProcessor } from '../dist/index.js';

describe('autolinking', () => {
	describe('plain md', () => {
		let processor: MarkdownProcessor;

		beforeAll(async () => {
			processor = await createMarkdownProcessor();
		});

		test('autolinks URLs starting with a protocol in plain text', async () => {
			const markdown = 'See https://example.com for more.';
			const { raw } = await processor.render(markdown);

			expect(raw.replace(/\n/g, '')).toBe(
				`<p>See <a href="https://example.com">https://example.com</a> for more.</p>`
			);
		});

		test('autolinks URLs starting with "www." in plain text', async () => {
			const markdown = 'See www.example.com for more.';
			const { raw } = await processor.render(markdown);

			expect(raw.trim()).toBe(
				`<p>See <a href="http://www.example.com">www.example.com</a> for more.</p>`
			);
		});

		test('does not autolink URLs in code blocks', async () => {
			const markdown = 'See `https://example.com` or `www.example.com` for more.';
			const { raw } = await processor.render(markdown);

			expect(raw.trim()).toBe(
				'<p>See <code>https://example.com</code> or <code>www.example.com</code> for more.</p>'
			);
		});
	});
});
