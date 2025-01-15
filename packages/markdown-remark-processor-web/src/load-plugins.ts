import type * as unified from 'unified';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function importPlugin(p: string | unified.Plugin<any[], any>) {
	if (typeof p === 'string') {
		const importResult = await import(/* @vite-ignore */ p);
		return importResult.default;
	}
	return p;
}

/**
 * Loads an array of plugins, which can be specified in various formats, and returns a promise for each plugin.
 *
 * @param items - An array of plugins or plugin configurations. Each item can be:
 * - A string representing the plugin name.
 * - A tuple where the first element is a string representing the plugin name and the second element is the plugin options.
 * - A unified plugin.
 * - A tuple where the first element is a unified plugin and the second element is the plugin options.
 *
 * @returns An array of promises, each resolving to a tuple where the first element is the loaded plugin and the optional second element is the plugin options.
 */
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
				return importPlugin(p[0])
					.then((m) => resolve([m, p[1]]))
					.catch((e) => reject(e));
			}

			return importPlugin(p)
				.then((m) => resolve([m]))
				.catch((e) => reject(e));
		});
	});
}
