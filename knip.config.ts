import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	exclude: ['duplicates', 'optionalPeerDependencies'],
	workspaces: {
		'.': {
			ignoreDependencies: ['@changesets/config'],
			entry: [
				'.github/workflows/*.yml',
				'.changeset/config.json',
				'vitest.config.mts',
				'vitest.workspace.js',
				'biome.json',
			],
			project: [
				'.github/workflows/*.yml',
				'.changeset/config.json',
				'vitest.config.mts',
				'vitest.workspace.js',
				'biome.json',
			],
		},
		scripts: {
			entry: 'index.js',
			project: '**/*.js',
		},
		'packages/markdown-remark': {
			ignoreDependencies: ['studiocms'],
			entry: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro'],
				project: ['src/**/*.astro'],
			},
		},
		'packages/markdown-remark/tests/fixture/astro': {
			ignoreDependencies: ['studiocms'],
			entry: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro', 'astro.config.ts'],
				project: ['src/**/*.astro'],
			},
		},
		'packages/markdown-remark-processor': {
			entry: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro'],
				project: ['src/**/*.astro'],
			},
		},
		'packages/markdown-remark-processor-web': {
			entry: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro'],
				project: ['src/**/*.astro'],
			},
		},
	},
};

export default config;
