// Configuration du site (Astro, site statique). L'adresse vient de src/config.ts (SITE_URL).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config.ts';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', fr: 'fr-FR' } },
    }),
  ],
});
