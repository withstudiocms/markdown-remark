import { AstroError } from 'astro/errors';
import { jsx as h } from 'astro/jsx-runtime';
import { renderJSX } from 'astro/runtime/server/jsx.js';
import { __unsafeHTML, transform } from 'ultrahtml';
import sanitize, { type SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import swap from 'ultrahtml/transformers/swap';
import { decode } from './decoder/index.js';

/**
 * Creates a proxy for components that can either be strings or functions.
 * If the component is a string, it is directly assigned to the proxy.
 * If the component is a function, it is wrapped in an async function that
 * processes the props and children before rendering.
 *
 * @param result - The result object used for rendering JSX.
 * @param _components - An optional record of components to be proxied. Defaults to an empty object.
 * @returns A record of proxied components.
 */
export function createComponentProxy(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	result: any,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	_components: Record<string, any> = {}
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const components: Record<string, any> = {};
	for (const [key, value] of Object.entries(_components)) {
		if (typeof value === 'string') {
			components[key.toLowerCase()] = value;
		} else {
			components[key.toLowerCase()] = async (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				props: Record<string, any>,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				children: { value: any }
			) => {
				if (key === 'codeblock' || key === 'codespan') {
					props.code = decode(JSON.parse(`"${props.code}"`));
				}
				const output = await renderJSX(result, h(value, { ...props, 'set:html': children.value }));
				return __unsafeHTML(output);
			};
		}
	}
	return components;
}

/**
 * Determines the indentation of a given line of text.
 *
 * @param ln - The line of text to analyze.
 * @returns The leading whitespace characters of the line, or an empty string if there is no indentation.
 */
function getIndent(ln: string): string {
	if (ln.trimStart() === ln) return '';
	return ln.slice(0, ln.length - ln.trimStart().length);
}

/**
 * Removes leading indentation from a multi-line string.
 *
 * @param str - The string from which to remove leading indentation.
 * @returns The dedented string.
 */
export function dedent(str: string): string {
	const lns = str.replace(/^[\r\n]+/, '').split('\n');
	let indent = getIndent(lns[0]);
	if (indent.length === 0 && lns.length > 1) {
		indent = getIndent(lns[1]);
	}
	if (indent.length === 0) return lns.join('\n');
	return lns.map((ln) => (ln.startsWith(indent) ? ln.slice(indent.length) : ln)).join('\n');
}

/**
 * Merges multiple records into a single record. If there are duplicate keys, the value from the last record with that key will be used.
 *
 * @param {...Record<string, any>[]} records - The records to merge.
 * @returns {Record<string, any>} - The merged record.
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mergeRecords(...records: Record<string, any>[]): Record<string, any> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const result: Record<string, any> = {};
	for (const record of records) {
		for (const [key, value] of Object.entries(record)) {
			result[key.toLowerCase()] = value;
		}
	}
	return result;
}

export class MarkdownRemarkError extends AstroError {
	name = 'StudioCMS Markdown Remark Error';
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function prefixError(err: any, prefix: string): any {
	// If the error is an object with a `message` property, attempt to prefix the message
	if (err?.message) {
		try {
			err.message = `${prefix}:\n${err.message}`;
			return err;
		} catch {
			// Any errors here are ok, there's fallback code below
		}
	}

	// If that failed, create a new error with the desired message and attempt to keep the stack
	const wrappedError = new Error(`${prefix}${err ? `: ${err}` : ''}`);
	try {
		wrappedError.stack = err.stack;
		wrappedError.cause = err;
	} catch {
		// It's ok if we could not set the stack or cause - the message is the most important part
	}

	return wrappedError;
}

/**
 * Imports components by their keys from the 'studiocms:markdown-remark/user-components' module.
 *
 * @param keys - An array of strings representing the keys of the components to import.
 * @returns A promise that resolves to an object containing the imported components.
 * @throws {MarkdownRemarkError} If any component fails to import, an error is thrown with a prefixed message.
 */
export async function importComponentsKeys(keys: string[]) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const predefinedComponents: Record<string, any> = {};

	for (const key of keys) {
		try {
			predefinedComponents[key.toLowerCase()] = (
				await import('studiocms:markdown-remark/user-components')
			)[key.toLowerCase()];
		} catch (e) {
			if (e instanceof Error) {
				const newErr = prefixError(e, `Failed to import component "${key}"`);
				console.error(newErr);
				throw new MarkdownRemarkError(newErr.message, newErr.stack);
			}
			const newErr = prefixError(new Error('Unknown error'), `Failed to import component "${key}"`);
			console.error(newErr);
			throw new MarkdownRemarkError(newErr.message, newErr.stack);
		}
	}

	return predefinedComponents;
}

export async function transformHTML(
	html: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	components: Record<string, any>,
	sanitizeOpts?: SanitizeOptions
): Promise<string> {
	return await transform(dedent(html), [sanitize(sanitizeOpts), swap(components)]);
}
