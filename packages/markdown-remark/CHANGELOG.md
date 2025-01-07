# @studiocms/markdown-remark

## 0.2.0

### Minor Changes

- [#8](https://github.com/withstudiocms/markdown-remark/pull/8) [`6b0053b`](https://github.com/withstudiocms/markdown-remark/commit/6b0053b37ec58e56bd757d68f1d4a27f78b233b7) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Introduce custom User-Defined component handling.

  This update includes significant enhancements to the Markdown Remark processor Astro Integration, allowing for more flexible and powerful Markdown rendering with custom components.

  ### New Features:

  - Added custom components support in the Markdown Remark processor Astro Integration.
  - Introduced utility functions in `utils.ts` for component proxy creation, indentation handling, dedenting strings, and merging records.
  - Moved zod schema to separate `schema.ts` file.

  ### Integration Updates:

  - Enhanced Astro integration to support custom components configuration via `astro.config.mjs`.
  - Updated `markdown.ts` to include custom components during Markdown rendering.
  - Extended `index.ts` to utilize the new schema and utilities.

  ### Documentation:

  - Updated `README.md` with instructions for setting up custom components in Astro integration.

  ### Dependencies:

  - Added `entities` and `ultrahtml` as new dependencies.

## 0.1.1

### Patch Changes

- [#3](https://github.com/withstudiocms/markdown-remark/pull/3) [`74d2b32`](https://github.com/withstudiocms/markdown-remark/commit/74d2b320c9acc562f0c87f5c6cea69712bcfba88) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update CSS and add flags to prevent vite dynamic import warnings

- [#5](https://github.com/withstudiocms/markdown-remark/pull/5) [`4beb076`](https://github.com/withstudiocms/markdown-remark/commit/4beb07632d18e05b3cece083512bdbd8197ebc31) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Add support for github Callouts/asides

## 0.1.0

### Minor Changes

- [`e5c6ea2`](https://github.com/withstudiocms/markdown-remark/commit/e5c6ea207285dc623f6879b0160c5b4b05542e52) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Initial Release

  This package is heavily inspired by and based on `@astrojs/markdown-remark`. It provides seamless integration with Astro, allowing you to easily parse and transform Markdown content within your Astro projects. The package leverages the power of remark to offer a highly configurable and extensible Markdown parser and transformer.
