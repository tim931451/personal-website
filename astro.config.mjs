// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Eigene Domain später: nur diese Zeile ändern und die Domain in Cloudflare Pages hinzufügen.
const SITE = 'https://timrusch.pages.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [sitemap()],
});
