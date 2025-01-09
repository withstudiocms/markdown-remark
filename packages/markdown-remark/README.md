# @studiocms/markdown-remark

[![NPM Version](https://img.shields.io/npm/v/@studiocms/markdown-remark?style=for-the-badge&logo=npm)](https://npm.im/@studiocms/markdown-remark)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=for-the-badge&logo=biome)](https://biomejs.dev/)
[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

## Overview

`@studiocms/markdown-remark` is a powerful Markdown parser and transformer built on top of [remark](https://github.com/remarkjs/remark). It provides seamless integration with [Astro](https://astro.build/), allowing you to easily parse and transform Markdown content within your Astro projects.

This project is heavily based on and compatible with Astro's built-in `@astrojs/markdown-remark`

## Features

- **Markdown Parsing**: Parse Markdown content into an abstract syntax tree (AST) using remark.
- **Astro Integration**: Easily integrate with Astro to transform Markdown content into HTML.
- **Custom Plugins**: Extend the functionality with custom remark plugins.
- **Configurable**: Highly configurable to suit your specific needs.

## Installation

To install `@studiocms/markdown-remark`, use your preferred package manager:

```bash
npm install @studiocms/markdown-remark
# or
yarn add @studiocms/markdown-remark
# or
pnpm add @studiocms/markdown-remark
```

## Usage

### As an Astro Integration

With the Astro integration enabled, you can either pass in custom components into your astro config, or manually for the specific render your trying to do shown in the following methods.

#### Setup the integration

**`astro.config.mjs`**

```ts
import markdownRemark from '@studiocms/markdown-remark';
import { defineConfig } from 'astro/config';

export default defineConfig({
    markdown: { 
        /* 
        * Your Customizations here based on: 
        * https://docs.astro.build/en/reference/configuration-reference/#markdown-options 
        */ 
    },
    integrations: [markdownRemark({
        // Used for injecting CSS for Headings and Callouts
        injectCSS: true,
        // User defined components that will be used when processing markdown
        components: {
            // Example of a custom defined component
            custom: "./src/components/Custom.astro",
        },
        // Custom Markdown config
        markdown: {
            // Configure the available callout themes
            callouts: {
                theme: 'obsidian' // Can also be 'github' or 'vitepress'
            },
            autoLinkHeadings: true,
            sanitize: {} // see https://github.com/natemoo-re/ultrahtml?tab=readme-ov-file#sanitization for full options
        }
    })],
});
```

#### Use the integration

**`src/pages/index.astro`**

```astro
---
import { Markdown } from 'studiocms:markdown-remark';
import Custom from '../components/Custom.astro';
---
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Example</title>
    </head>
    <body>
        <Markdown content={`# Hello World! <custom></custom>`} components={{ custom: Custom }} />
    </body>
</html>
```

OR

```astro
---
import { render } from 'studiocms:markdown-remark';
import Custom from '../components/Custom.astro';

// @ts-ignore
const { html } = render('# Hello World! <custom></custom>', {}, { $$result, {custom: Custom} })
---
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Example</title>
    </head>
    <body>
        {html}
    </body>
</html>
```

### Using the markdown processor directly

**`src/utils/render.ts`**

```ts
import { type MarkdownProcessorRenderOptions, createMarkdownProcessor } from '@studiocms/markdown-remark';

const processor = await createMarkdownProcessor({
	/* 
    * Your Options here 
    * same as https://docs.astro.build/en/reference/configuration-reference/#markdown-options
    */
});

export async function render(
	content: string,
	options?: MarkdownProcessorRenderOptions
) {
	const result = await processor.render(content, options);

	return {
		html: result.astroHTML,
		meta: result.metadata,
	};
}
```

**`src/pages/index.astro`**

```astro
---
import { render } from '../utils/render';

const content = await render("# Hello World!")
---
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Example</title>
    </head>
    <body>
        {content.html}
    </body>
</html>
```

## Changelog

See the [Changelog](https://github.com/withstudiocms/markdown-remark/blob/main/packages/markdown-remark/CHANGELOG.md) for the change history of this package.

## Contribution

If you see any errors or room for improvement, feel free to open an [issues or pull request](https://github.com/withstudiocms/markdown-remark/) . Thank you in advance for contributing! ❤️

## Licensing

[MIT Licensed](./LICENSE).