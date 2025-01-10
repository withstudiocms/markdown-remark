import yaml from 'js-yaml';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isFrontmatterValid(frontmatter: Record<string, any>): boolean {
	try {
		// ensure frontmatter is JSON-serializable
		JSON.stringify(frontmatter);
	} catch {
		return false;
	}
	return typeof frontmatter === 'object' && frontmatter !== null;
}

// Capture frontmatter wrapped with `---`, including any characters and new lines within it.
// Only capture if `---` exists near the top of the file, including:
// 1. Start of file (including if has BOM encoding)
// 2. Start of file with any whitespace (but `---` must still start on a new line)
const frontmatterRE = /(?:^\uFEFF?|^\s*\n)---([\s\S]*?\n)---/;
export function extractFrontmatter(code: string): string | undefined {
	return frontmatterRE.exec(code)?.[1];
}

export interface ParseFrontmatterOptions {
	/**
	 * How the frontmatter should be handled in the returned `content` string.
	 * - `preserve`: Keep the frontmatter.
	 * - `remove`: Remove the frontmatter.
	 * - `empty-with-spaces`: Replace the frontmatter with empty spaces. (preserves sourcemap line/col/offset)
	 * - `empty-with-lines`: Replace the frontmatter with empty line breaks. (preserves sourcemap line/col)
	 *
	 * @default 'remove'
	 */
	frontmatter: 'preserve' | 'remove' | 'empty-with-spaces' | 'empty-with-lines';
}

export interface ParseFrontmatterResult {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	frontmatter: Record<string, any>;
	rawFrontmatter: string;
	content: string;
}

/**
 * Parses the frontmatter from a given code string.
 *
 * @param code - The code string containing the frontmatter.
 * @param options - Optional settings for parsing the frontmatter.
 * @returns An object containing the parsed frontmatter, raw frontmatter string, and the content without frontmatter.
 *
 * The `options` parameter can have the following properties:
 * - `frontmatter`: Determines how the frontmatter should be handled in the content.
 *   - 'preserve': Keeps the frontmatter in the content.
 *   - 'remove': Removes the frontmatter from the content.
 *   - 'empty-with-spaces': Replaces the frontmatter with spaces in the content.
 *   - 'empty-with-lines': Replaces the frontmatter with empty lines in the content.
 *
 * The returned object has the following properties:
 * - `frontmatter`: The parsed frontmatter as an object.
 * - `rawFrontmatter`: The raw frontmatter string.
 * - `content`: The content string without the frontmatter.
 */
export function parseFrontmatter(
	code: string,
	options?: ParseFrontmatterOptions
): ParseFrontmatterResult {
	const rawFrontmatter = extractFrontmatter(code);

	if (rawFrontmatter == null) {
		return { frontmatter: {}, rawFrontmatter: '', content: code };
	}

	const parsed = yaml.load(rawFrontmatter);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const frontmatter = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, any>;

	let content: string;
	switch (options?.frontmatter ?? 'remove') {
		case 'preserve':
			content = code;
			break;
		case 'remove':
			content = code.replace(`---${rawFrontmatter}---`, '');
			break;
		case 'empty-with-spaces':
			content = code.replace(
				`---${rawFrontmatter}---`,
				`   ${rawFrontmatter.replace(/[^\r\n]/g, ' ')}   `
			);
			break;
		case 'empty-with-lines':
			content = code.replace(`---${rawFrontmatter}---`, rawFrontmatter.replace(/[^\r\n]/g, ''));
			break;
	}

	return {
		frontmatter,
		rawFrontmatter,
		content,
	};
}
