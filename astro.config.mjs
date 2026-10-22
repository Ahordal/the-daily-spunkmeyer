// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical URLs, link previews, RSS and the sitemap are built from this.
  // Update it when a custom domain is added.
  site: 'https://the-daily-spunkmeyer.vercel.app',
  // Blog pages prerender to static HTML; the adapter only serves Keystatic's admin routes.
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
