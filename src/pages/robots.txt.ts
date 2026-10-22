import type { APIContext } from 'astro';

// Built from `site`, so the sitemap address follows a future custom domain.
export function GET(context: APIContext) {
  const sitemap = new URL('/sitemap-index.xml', context.site);
  const body = ['User-agent: *', 'Disallow: /keystatic', 'Disallow: /api/', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
