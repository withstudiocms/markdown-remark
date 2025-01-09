import { describe, expect, it } from 'vitest';
import { extractFrontmatter, parseFrontmatter } from '../dist/processor/index.js';

const bom = '\uFEFF';

describe('extractFrontmatter', () => {
	it('works', () => {
		const yaml = '\nfoo: bar\n';

		expect(extractFrontmatter(`---${yaml}---`)).toBe(yaml);
		expect(extractFrontmatter(`${bom}---${yaml}---`)).toBe(yaml);
		expect(extractFrontmatter(`\n---${yaml}---`)).toBe(yaml);
		expect(extractFrontmatter(`\n  \n---${yaml}---`)).toBe(yaml);
		expect(extractFrontmatter(`---${yaml}---\ncontent`)).toBe(yaml);
		expect(extractFrontmatter(`${bom}---${yaml}---\ncontent`)).toBe(yaml);
		expect(extractFrontmatter(`\n\n---${yaml}---\n\ncontent`)).toBe(yaml);
		expect(extractFrontmatter(`\n  \n---${yaml}---\n\ncontent`)).toBe(yaml);
		expect(extractFrontmatter(` ---${yaml}---`)).toBeUndefined();
		expect(extractFrontmatter(`---${yaml} ---`)).toBeUndefined();
		expect(extractFrontmatter(`text\n---${yaml}---\n\ncontent`)).toBeUndefined();
	});
});

describe('parseFrontmatter', () => {
	it('works', () => {
		const yaml = '\nfoo: bar\n';

		expect(parseFrontmatter(`---${yaml}---`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '',
		});
		expect(parseFrontmatter(`${bom}---${yaml}---`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: bom,
		});
		expect(parseFrontmatter(`\n---${yaml}---`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '\n',
		});
		expect(parseFrontmatter(`\n  \n---${yaml}---`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '\n  \n',
		});
		expect(parseFrontmatter(`---${yaml}---\ncontent`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '\ncontent',
		});
		expect(parseFrontmatter(`${bom}---${yaml}---\ncontent`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: `${bom}\ncontent`,
		});
		expect(parseFrontmatter(`\n\n---${yaml}---\n\ncontent`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '\n\n\n\ncontent',
		});
		expect(parseFrontmatter(`\n  \n---${yaml}---\n\ncontent`)).toEqual({
			frontmatter: { foo: 'bar' },
			rawFrontmatter: yaml,
			content: '\n  \n\n\ncontent',
		});
		expect(parseFrontmatter(` ---${yaml}---`)).toEqual({
			frontmatter: {},
			rawFrontmatter: '',
			content: ` ---${yaml}---`,
		});
		expect(parseFrontmatter(`---${yaml} ---`)).toEqual({
			frontmatter: {},
			rawFrontmatter: '',
			content: `---${yaml} ---`,
		});
		expect(parseFrontmatter(`text\n---${yaml}---\n\ncontent`)).toEqual({
			frontmatter: {},
			rawFrontmatter: '',
			content: `text\n---${yaml}---\n\ncontent`,
		});
	});

	it('frontmatter style', () => {
		const yaml = '\nfoo: bar\n';
		const parse1 = (style) => parseFrontmatter(`---${yaml}---`, { frontmatter: style }).content;

		expect(parse1('preserve')).toBe(`---${yaml}---`);
		expect(parse1('remove')).toBe('');
		expect(parse1('empty-with-spaces')).toBe('   \n        \n   ');
		expect(parse1('empty-with-lines')).toBe('\n\n');

		const parse2 = (style) =>
			parseFrontmatter(`\n  \n---${yaml}---\n\ncontent`, { frontmatter: style }).content;

		expect(parse2('preserve')).toBe(`\n  \n---${yaml}---\n\ncontent`);
		expect(parse2('remove')).toBe('\n  \n\n\ncontent');
		expect(parse2('empty-with-spaces')).toBe('\n  \n   \n        \n   \n\ncontent');
		expect(parse2('empty-with-lines')).toBe('\n  \n\n\n\n\ncontent');
	});
});
