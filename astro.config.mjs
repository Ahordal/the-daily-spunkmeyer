// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import notifyDestinations from './integrations/notify-destinations.mjs';
import { DESTINATIONS, canonicalDestination } from './src/utils/destinations';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Posts whose canonical copy is on another site stay out of this sitemap.
const postsDir = new URL('./src/content/posts/', import.meta.url);
const elsewherePaths = readdirSync(postsDir)
  .filter((file) => file.endsWith('.mdoc'))
  .filter((file) => {
    const frontMatter = parse(readFileSync(new URL(file, postsDir), 'utf8').split(/^---$/m)[1] ?? '') ?? {};
    return canonicalDestination({
      portfolio: frontMatter.portfolio === true,
      categories: frontMatter.categories ?? [],
    });
  })
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
      filter: (page) => !page.includes('/keystatic') && !elsewherePaths.some((path) => page.endsWith(path)),
    }),
    notifyDestinations({ site, destinations: DESTINATIONS }),
  ],
});
