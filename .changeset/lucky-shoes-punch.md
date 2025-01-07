---
"@studiocms/markdown-remark": minor
---

Refactor integration exports and simplification

- Default package export `@studiocms/markdown-remark` now only exports the integration and integration options types.

New Export:
- `@studiocms/markdown-remark/integration` - Direct export of the included Astro integration

No longer depends on Astro-integration-kit.
