---
"@studiocms/markdown-remark": minor
---

Introduce custom User-Defined component handling.

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