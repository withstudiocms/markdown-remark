import { AstroError } from 'astro/errors';
import { jsx as h } from 'astro/jsx-runtime';
import { renderJSX } from 'astro/runtime/server/jsx.js';
import * as entities from 'entities';
import { __unsafeHTML } from 'ultrahtml';

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
			components[key] = value;
		} else {
			components[key] = async (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				props: Record<string, any>,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				children: { value: any }
			) => {
				if (key === 'CodeBlock' || key === 'CodeSpan') {
					props.code = entities.decode(JSON.parse(`"${props.code}"`));
				}
				const output = await renderJSX(result, h(value, { ...props, 'set:html': children.value }));
				return __unsafeHTML(output);
			};
		}
	}
	return components;
}

function getIndent(ln: string): string {
	if (ln.trimStart() === ln) return '';
	return ln.slice(0, ln.length - ln.trimStart().length);
}

export function dedent(str: string): string {
	const lns = str.replace(/^[\r\n]+/, '').split('\n');
	let indent = getIndent(lns[0]);
	if (indent.length === 0 && lns.length > 1) {
		indent = getIndent(lns[1]);
	}
	if (indent.length === 0) return lns.join('\n');
	return lns.map((ln) => (ln.startsWith(indent) ? ln.slice(indent.length) : ln)).join('\n');
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mergeRecords(...records: Record<string, any>[]): Record<string, any> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const result: Record<string, any> = {};
	for (const record of records) {
		for (const [key, value] of Object.entries(record)) {
			result[key] = value;
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

export async function importComponentsKeys(keys: string[]) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const predefinedComponents: Record<string, any> = {};

	for (const key of keys) {
		try {
			predefinedComponents[key] = (await import('studiocms:markdown-remark/user-components'))[key];
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
