// Configuration du site mohamednjikam.com (Astro, site statique).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mohamednjikam.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', fr: 'fr-FR' } },
    }),
  ],
});
