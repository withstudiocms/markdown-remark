# @studiocms/markdown-remark-processor

## 1.1.0

### Minor Changes

- [#24](https://github.com/withstudiocms/markdown-remark/pull/24) [`6a05fec`](https://github.com/withstudiocms/markdown-remark/commit/6a05fecf27c68f57168cf522a9cec178d71a9f7c) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update to add support for TOML frontmatter to match Astro's markdown-remark package compat

## 1.0.0

### Major Changes

- [#15](https://github.com/withstudiocms/markdown-remark/pull/15) [`ab0142b`](https://github.com/withstudiocms/markdown-remark/commit/ab0142bc28ba51de5884c0f6ee0d655400532009) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - First Major Release

  Package has been divided into multiple smaller packages:

  - `@studiocms/markdown-remark`: The Primary Astro integration that includes the underlying processor as well as custom functionality to allow custom markdown rendering pipelines.
  - `@studiocms/markdown-remark-processor`: The Main markdown processor for `@studiocms/markdown-remark`.
  - `@studiocms/markdown-remark-processor-web`: A Client side browser-first version of our main processor.

### Minor Changes

- [#15](https://github.com/withstudiocms/markdown-remark/pull/15) [`ab0142b`](https://github.com/withstudiocms/markdown-remark/commit/ab0142bc28ba51de5884c0f6ee0d655400532009) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Add support for Discord subtext `-#` syntax using custom remark plugin
