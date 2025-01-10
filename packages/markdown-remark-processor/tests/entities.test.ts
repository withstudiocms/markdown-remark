import { beforeAll, describe, expect, it } from 'vitest';
import { type MarkdownProcessor, createMarkdownProcessor } from '../dist/index.js';

describe('entities', () => {
	let processor: MarkdownProcessor;

	beforeAll(async () => {
		processor = await createMarkdownProcessor();
	});

	it('should not unescape entities in regular Markdown', async () => {
		const markdown = '&lt;i&gt;This should NOT be italic&lt;/i&gt;';
		const { code } = await processor.render(markdown);

		expect(code).toBe('<p>&#x3C;i>This should NOT be italic&#x3C;/i></p>');
	});
});
