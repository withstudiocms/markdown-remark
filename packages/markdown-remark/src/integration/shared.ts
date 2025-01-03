import type { AstroConfig } from 'astro';

export const symbol: symbol = Symbol.for('@studiocms/markdown-remark');

export interface Shared {
	markdownConfig: AstroConfig['markdown'];
}

export const shared: Shared =
	// @ts-ignore
	globalThis[symbol] ||
	// @ts-ignore
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	(globalThis[symbol] = {
		markdownConfig: {},
	});
