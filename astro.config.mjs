// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import notifyPortfolio from './integrations/notify-portfolio.mjs';
import { readdirSync, readFileSync } from 'node:fs';

// Dev posts' canonical copy is on the portfolio, so they stay out of this sitemap.
// Category value mirrors src/utils/portfolio.ts.
const postsDir = new URL('./src/content/posts/', import.meta.url);
const devPostPaths = readdirSync(postsDir)
  .filter((file) => file.endsWith('.mdoc'))
  .filter((file) => /^category:\s*map-app-dev\s*$/m.test(readFileSync(new URL(file, postsDir), 'utf8')))
  .map((file) => `/posts/${file.replace(/\.mdoc$/, '')}/`);

// Canonical URLs, link previews, RSS and the sitemap are built from this.
// Update it when a custom domain is added.
const site = 'https://the-daily-spunkmeyer.vercel.app';

// https://astro.build/config
export default defineConfig({
  site,
  // Blog pages prerender to static HTML; the adapter only serves Keystatic's admin routes.
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic') && !devPostPaths.some((path) => page.endsWith(path)),
    }),
    notifyPortfolio({ site }),
  ],
});
