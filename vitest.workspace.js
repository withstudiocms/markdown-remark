import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'./packages/markdown-remark-processor/vitest.config.mts',
	'./packages/markdown-remark-processor-web/vitest.config.mts',
	'./packages/markdown-remark/vitest.config.mts',
]);
