import esbuild from 'esbuild';
import glob from 'fast-glob';
import { describe, expect, test } from 'vitest';

const patterns = ['packages/markdown-remark/dist/**/*.js'];

async function getEntryPoints(patterns: string[]): Promise<string[]> {
	try {
		const entryPoints = ([] as string[]).concat(
			...(await Promise.all(
				patterns.map((pattern) => glob(pattern, { absolute: true, onlyFiles: true }))
			))
		);
		const defaultPlugin = entryPoints.findIndex((entry) =>
			entry.includes('import-plugin-default.js')
		);
		const defaultPluginDTS = entryPoints.findIndex((entry) =>
			entry.includes('import-plugin-default.d.ts')
		);

		if (defaultPlugin >= 0) {
			entryPoints.splice(defaultPlugin, 1);
		}

		if (defaultPluginDTS >= 0) {
			entryPoints.splice(defaultPluginDTS, 1);
		}
		return entryPoints;
	} catch (error) {
		console.error('Error fetching entry points:', error);
		return [];
	}
}

describe('Bundle for browsers', () => {
	test('esbuild browser build should work', async () => {
		try {
			const entryPoints = await getEntryPoints(patterns);
			const result = await esbuild.build({
				platform: 'browser',
				entryPoints: entryPoints,
				bundle: true,
				write: false,
				outdir: 'browser-dist',
			});

			expect(result.outputFiles?.length).toBeGreaterThan(0);
		} catch (error) {
			// Capture any esbuild errors and fail the test
			throw new Error(error.message);
		}
	});
});
