import type * as hast from 'hast';
import type * as mdast from 'mdast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import type { BuiltinTheme } from 'shiki';
import type * as unified from 'unified';
import type { HTMLString } from './HTMLString.js';
import type { CreateShikiHighlighterOptions, ShikiHighlighterHighlightOptions } from './shiki.js';
import type { RemotePattern } from '@astrojs/internal-helpers/remote';

export type { Node } from 'unist';

export type { HTMLString };

declare module 'vfile' {
	interface DataMap {
		astro: {
			headings?: MarkdownHeading[];
			imagePaths?: string[];
			localImagePaths?: string[];
			remoteImagePaths?: string[];
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			frontmatter?: Record<string, any>;
		};
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RemarkPlugin<PluginParameters extends any[] = any[]> = unified.Plugin<
	PluginParameters,
	mdast.Root
>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RemarkPlugins = (string | [string, any] | RemarkPlugin | [RemarkPlugin, any])[];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RehypePlugin<PluginParameters extends any[] = any[]> = unified.Plugin<
	PluginParameters,
	hast.Root
>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RehypePlugins = (string | [string, any] | RehypePlugin | [RehypePlugin, any])[];

export type RemarkRehype = RemarkRehypeOptions;

export type ThemePresets = BuiltinTheme | 'css-variables';

export type SyntaxHighlightConfigType = 'shiki' | 'prism';

export interface SyntaxHighlightConfig {
	type: SyntaxHighlightConfigType;
	excludeLangs?: string[];
}

export interface ShikiConfig
	extends Pick<CreateShikiHighlighterOptions, 'langs' | 'theme' | 'themes' | 'langAlias'>,
		Pick<ShikiHighlighterHighlightOptions, 'defaultColor' | 'wrap' | 'transformers'> {}

/**
 * Configuration options that end up in the markdown section of AstroConfig
 */
export interface AstroMarkdownOptions {
	syntaxHighlight?: SyntaxHighlightConfig | SyntaxHighlightConfigType | false;
	shikiConfig?: ShikiConfig;
	remarkPlugins?: RemarkPlugins;
	rehypePlugins?: RehypePlugins;
	remarkRehype?: RemarkRehype;
	gfm?: boolean;
	smartypants?: boolean;
}

export interface StudioCMSCalloutOptions {
	theme?: 'github' | 'obsidian' | 'vitepress';
}

export interface StudioCMSConfigOptions {
	callouts?: StudioCMSCalloutOptions | false;
	autolink?: boolean;
	discordSubtext?: boolean;
}

export interface StudioCMSMarkdownOptions extends AstroMarkdownOptions {
	studiocms?: StudioCMSConfigOptions | false;
}

export interface StudioCMSMarkdownProcessorOptions extends StudioCMSMarkdownOptions {
	image?: {
		domains?: string[];
		remotePatterns?: RemotePattern[];
	};
	experimentalHeadingIdCompat?: boolean;
}


export interface MarkdownProcessor {
	render: (
		content: string,
		opts?: MarkdownProcessorRenderOptions
	) => Promise<MarkdownProcessorRenderResult>;
}

export interface MarkdownProcessorRenderOptions {
	/** @internal */
	fileURL?: URL;
	/** Used for frontmatter injection plugins */
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	frontmatter?: Record<string, any>;
}
export interface MarkdownProcessorRenderResult {
	code: string;
	astroHTML: HTMLString;
	metadata: {
		headings: MarkdownHeading[];
		localImagePaths: string[];
		remoteImagePaths: string[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		frontmatter: Record<string, any>;
	};
}

export interface MarkdownHeading {
	depth: number;
	slug: string;
	text: string;
}
