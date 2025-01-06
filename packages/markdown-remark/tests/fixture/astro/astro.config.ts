import markdownRemark from '@studiocms/markdown-remark';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [
		markdownRemark({
			markdown: {
				components: {
					custom: './src/pages/custom-components/_comps/Custom.astro',
				},
			},
		}),
	],
});
