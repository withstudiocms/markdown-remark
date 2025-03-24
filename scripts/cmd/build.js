import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import esbuild from 'esbuild';
import glob from 'fast-glob';
import { dim, gray, green, red, yellow } from 'kleur/colors';

/** @type {import('esbuild').BuildOptions} */
const defaultConfig = {
	minify: false, // DO NOT ENABLE THIS, it creates an error during runtime due to removing the /* @vite-ignore */ comments from a few import() calls
	format: 'esm',
	platform: 'node',
	target: 'node18',
	sourcemap: false,
	sourcesContent: false,
};

const dt = new Intl.DateTimeFormat('en-us', {
	hour: '2-digit',
	minute: '2-digit',
});

const dtsGen = {
	name: 'TypeScriptDeclarationsPlugin',
	setup(build) {
		build.onEnd((result) => {
			if (result.errors.length > 0) return;
			const date = dt.format(new Date());
			console.log(`${dim(`[${date}]`)} Generating TypeScript declarations...`);
			try {
				execSync('tsc --emitDeclarationOnly -p tsconfig.json --outDir ./dist');
				console.log(dim(`[${date}] `) + green('√ Generated TypeScript declarations'));
			} catch (error) {
				console.error(dim(`[${date}] `) + red(`${error}\n\n${error.stdout.toString()}`));
			}
		});
	},
};

export default async function build(...args) {
	const config = Object.assign({}, defaultConfig);
	const isDev = args.slice(-1)[0] === 'IS_DEV';
	const patterns = args
		.filter((f) => !!f) // remove empty args
		.map((f) => f.replace(/^'/, '').replace(/'$/, '')); // Needed for Windows: glob strings contain surrounding string chars??? remove these
	const entryPoints = [].concat(
		...(await Promise.all(
			patterns.map((pattern) => glob(pattern, { filesOnly: true, absolute: true }))
		))
	);

	const date = dt.format(new Date());

	const noClean = args.includes('--no-clean-dist');
	const noBundle = args.includes('--no-bundle');
	const forceCJS = args.includes('--cjs');
	const browser = args.includes('--browser');

	const {
		type = 'module',
		dependencies = {},
		peerDependencies = {},
		imports = {},
	} = await readPackageJSON('./package.json');

	config.define = {};
	for (const [key, value] of await getDefinedEntries()) {
		config.define[`process.env.${key}`] = JSON.stringify(value);
	}
	const format = type === 'module' && !forceCJS ? 'esm' : 'cjs';

	const outdir = 'dist';

	if (!noClean) {
		console.log(
			`${dim(`[${date}]`)} Cleaning dist directory... ${dim(`(${entryPoints.length} files found)`)}`
		);
		await clean(outdir);
	}

	if (!isDev) {
		console.log(`${dim(`[${date}]`)} Building... ${dim(`(${entryPoints.length} files found)`)}`);
		await esbuild.build({
			...config,
			bundle: !noBundle,
			external: !noBundle
				? Object.keys({ ...peerDependencies, ...dependencies, ...imports })
				: undefined,
			platform: browser ? 'browser' : 'node',
			target: browser ? undefined : 'node18',
			entryPoints,
			outdir: browser ? undefined : outdir,
			outfile: browser ? 'dist/index.js' : undefined,
			outExtension: forceCJS ? { '.js': '.cjs' } : {},
			format,
			plugins: [dtsGen],
		});
		console.log(dim(`[${date}] `) + green('√ Build Complete'));
		return;
	}

	const rebuildPlugin = {
		name: 'dev:rebuild',
		setup(build) {
			build.onEnd(async (result) => {
				const date = dt.format(new Date());
				if (result?.errors.length) {
					console.error(dim(`[${date}] `) + red(error || result.errors.join('\n')));
				} else {
					if (result.warnings.length) {
						console.log(
							dim(`[${date}] `) + yellow(`! Updated with warnings:\n${result.warnings.join('\n')}`)
						);
					}
					console.log(dim(`[${date}] `) + green('√ Updated'));
				}
			});
		},
	};

	const builder = await esbuild.context({
		...config,
		entryPoints,
		outdir,
		format,
		sourcemap: 'linked',
		plugins: [rebuildPlugin, dtsGen],
	});

	console.log(
		`${dim(`[${date}] `) + gray('Watching for changes...')} ${dim(`(${entryPoints.length} files found)`)}`
	);
	await builder.watch();

	process.on('beforeExit', () => {
		builder.stop?.();
	});
}

async function clean(outdir) {
	const files = await glob([`${outdir}/**`], { filesOnly: true });
	await Promise.all(files.map((file) => fs.rm(file, { force: true })));
}

/**
 * Contextual `define` values to statically replace in the built JS output.
 * Available to all packages, but mostly useful for CLIs like `create-astro`.
 */
async function getDefinedEntries() {
	const define = {
		/** The current version (at the time of building) for the current package, such as `astro` or `@astrojs/sitemap` */
		PACKAGE_VERSION: await getInternalPackageVersion('./package.json'),
		/** The current version (at the time of building) for `typescript` */
		TYPESCRIPT_VERSION: await getWorkspacePackageVersion('typescript'),
	};
	for (const [key, value] of Object.entries(define)) {
		if (value === undefined) {
			delete define[key];
		}
	}
	return Object.entries(define);
}

async function readPackageJSON(path) {
	return await fs.readFile(path, { encoding: 'utf8' }).then((res) => JSON.parse(res));
}

async function getInternalPackageVersion(path) {
	return readPackageJSON(path).then((res) => res.version);
}

async function getWorkspacePackageVersion(packageName) {
	const { dependencies, devDependencies } = await readPackageJSON(
		new URL('../../package.json', import.meta.url)
	);
	const deps = { ...dependencies, ...devDependencies };
	const version = deps[packageName];
	if (!version) {
		throw new Error(
			`Unable to resolve "${packageName}". Is it a dependency of the workspace root?`
		);
	}
	return version.replace(/^\D+/, '');
}
