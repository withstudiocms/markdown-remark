import type * as unified from 'unified';
import { importPlugin as _importPlugin } from '#import-plugin';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function importPlugin(p: string | unified.Plugin<any[], any>) {
	if (typeof p === 'string') {
		return await _importPlugin(p);
	}
	return p;
}

export function loadPlugins(
	items: (
		| string
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| [string, any]
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| unified.Plugin<any[], any>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		| [unified.Plugin<any[], any>, any]
	)[]
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<[unified.Plugin, any?]>[] {
	return items.map((p) => {
		return new Promise((resolve, reject) => {
			if (Array.isArray(p)) {
				const [plugin, opts] = p;
				return importPlugin(plugin)
					.then((m) => resolve([m, opts]))
					.catch((e) => reject(e));
			}

			return importPlugin(p)
				.then((m) => resolve([m]))
				.catch((e) => reject(e));
		});
	});
}
