import markdownRemark from '@studiocms/markdown-remark';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [markdownRemark()],
});
