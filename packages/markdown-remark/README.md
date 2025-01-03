# @studiocms/markdown-remark

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
    integrations: [markdownRemark()],
});
```

#### Use the integration

**`src/pages/index.astro`**

```astro
---
import { Markdown } from 'studiocms:markdown-remark';
---
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Example</title>
    </head>
    <body>
        <Markdown content={`# Hello World!`} />
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