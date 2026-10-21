// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Blog pages prerender to static HTML; the adapter only serves Keystatic's admin routes.
  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic()],
});
