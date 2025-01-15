# @studiocms/markdown-remark-processor

[![NPM Version](https://img.shields.io/npm/v/@studiocms/markdown-remark-processor?style=for-the-badge&logo=npm)](https://npm.im/@studiocms/markdown-remark-processor)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=for-the-badge&logo=biome)](https://biomejs.dev/)

## Overview

`@studiocms/markdown-remark-processor` is a powerful Markdown parser and transformer built on top of [remark](https://github.com/remarkjs/remark). It provides seamless integration with [Astro](https://astro.build/), allowing you to easily parse and transform Markdown content within your Astro projects.

This project is heavily based on and compatible with Astro's built-in `@astrojs/markdown-remark`

## Features

- **Markdown Parsing**: Parse Markdown content into an abstract syntax tree (AST) using remark.
- **Custom Plugins**: Extend the functionality with custom remark plugins.
- **Configurable**: Highly configurable to suit your specific needs.

## Installation

To install `@studiocms/markdown-remark-processor`, use your preferred package manager:

```bash
npm install @studiocms/markdown-remark-processor
# or
yarn add @studiocms/markdown-remark-processor
# or
pnpm add @studiocms/markdown-remark-processor
```

## Usage

First setup your render function

**`src/utils/render.ts`**

```ts
import { type MarkdownProcessorRenderOptions, createMarkdownProcessor } from '@studiocms/markdown-remark-processor';

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

Then use it!

**`/src/pages/index.astro`**
```astro
---
import { render } from '../utils/render';

const content = `# Hello world!`

const { html } = await render(content)
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

## Changelog

See the [Changelog](https://github.com/withstudiocms/markdown-remark/blob/main/packages/markdown-remark-processor/CHANGELOG.md) for the change history of this package.

## Contribution

If you see any errors or room for improvement, feel free to open an [issue or pull request](https://github.com/withstudiocms/markdown-remark/) . Thank you in advance for contributing! ❤️

## Licensing

[MIT Licensed](./LICENSE).