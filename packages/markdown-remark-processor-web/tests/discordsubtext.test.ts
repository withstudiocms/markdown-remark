import { beforeAll, describe, expect, it } from 'vitest';
import { type MarkdownProcessor, createMarkdownProcessor } from '../dist/index.js';

describe('Discord Subtext', () => {
	let processor: MarkdownProcessor;

	beforeAll(async () => {
		processor = await createMarkdownProcessor();
	});

	it('-# should be converted to small text like discord', async () => {
		const markdown = '-# This should be small text';
		const { code } = await processor.render(markdown);

		expect(code).toBe('<p><small>This should be small text</small></p>');
	});
});
