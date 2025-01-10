import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor, createShikiHighlighter } from '../dist/index.js';

describe('shiki syntax highlighting', () => {
	it('does not add is:raw to the output', async () => {
		const processor = await createMarkdownProcessor();
		const { code } = await processor.render('```\ntest\n```');
		expect(code).not.toContain('is:raw');
	});

	it('supports light/dark themes', async () => {
		const processor = await createMarkdownProcessor({
			shikiConfig: {
				themes: {
					light: 'github-light',
					dark: 'github-dark',
				},
			},
		});
		const { code } = await processor.render('```\ntest\n```');

		// light theme is there:
		expect(code).toMatch(/background-color:/);
		expect(code).toMatch(/github-light/);

		// dark theme is there:
		expect(code).toMatch(/--shiki-dark-bg:/);
		expect(code).toMatch(/github-dark/);
	});

	it('createShikiHighlighter works', async () => {
		const highlighter = await createShikiHighlighter();
		const html = await highlighter.codeToHtml('const foo = "bar";', 'js');

		expect(html).toMatch(/astro-code github-dark/);
		expect(html).toMatch(/background-color:#24292e;color:#e1e4e8;/);
	});

	it('createShikiHighlighter works with codeToHast', async () => {
		const highlighter = await createShikiHighlighter();
		const hast = await highlighter.codeToHast('const foo = "bar";', 'js');

		// @ts-expect-error - we're testing the properties here
		expect(hast.children[0].properties.class).toMatch(/astro-code github-dark/);
		// @ts-expect-error - we're testing the properties here
		expect(hast.children[0].properties.style).toMatch(/background-color:#24292e;color:#e1e4e8;/);
	});

	it('diff +/- text has user-select: none', async () => {
		const highlighter = await createShikiHighlighter();
		const html = await highlighter.codeToHtml(
			`\
- const foo = "bar";
+ const foo = "world";`,
			'diff'
		);

		expect(html).toMatch(/user-select: none/);
		expect(html).toMatch(/>-<\/span>/);
		expect(html).toMatch(/>\+<\/span>/);
	});

	it('renders attributes', async () => {
		const highlighter = await createShikiHighlighter();
		const html = await highlighter.codeToHtml('foo', 'js', {
			// @ts-expect-error - we're testing the properties here
			attributes: { 'data-foo': 'bar', autofocus: true },
		});

		expect(html).toMatch(/data-foo="bar"/);
		expect(html).toMatch(/autofocus(?!=)/);
	});

	it('supports transformers that read meta', async () => {
		const highlighter = await createShikiHighlighter();
		const html = await highlighter.codeToHtml('foo', 'js', {
			meta: '{1,3-4}',
			transformers: [
				{
					pre(node) {
						const meta = this.options.meta?.__raw;
						if (meta) {
							node.properties['data-test'] = meta;
						}
					},
				},
			],
		});

		expect(html).toMatch(/data-test="\{1,3-4\}"/);
	});

	it('supports the defaultColor setting', async () => {
		const processor = await createMarkdownProcessor({
			shikiConfig: {
				themes: {
					light: 'github-light',
					dark: 'github-dark',
				},
				defaultColor: false,
			},
		});
		const { code } = await processor.render('```\ntest\n```');

		expect(code).not.toMatch(/color:/);
	});

	it('the highlighter supports lang alias', async () => {
		const highlighter = await createShikiHighlighter({
			langAlias: {
				cjs: 'javascript',
			},
		});

		const html = await highlighter.codeToHtml(`let test = "some string"`, 'cjs', {
			attributes: { 'data-foo': 'bar', autofocus: 'true' },
		});

		expect(html).toMatch(/data-language="cjs"/);
	});

	it('the markdown processor supports lang alias', async () => {
		const processor = await createMarkdownProcessor({
			shikiConfig: {
				langAlias: {
					cjs: 'javascript',
				},
			},
		});

		const { code } = await processor.render('```cjs\nlet foo = "bar"\n```');

		expect(code).toMatch(/data-language="cjs"/);
	});
});
