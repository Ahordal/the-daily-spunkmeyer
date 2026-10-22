import type { Post } from './posts';

// Dev posts are published on both sites; the portfolio copy is the canonical one.
// astro.config.mjs keeps its own copy of the category value for the sitemap filter.
export const PORTFOLIO_BLOG_URL = 'https://www.alexhordal.ca/blog/';

export function isDevPost(post: Post): boolean {
  return post.data.category === 'map-app-dev';
}

export function portfolioUrl(post: Post): string {
  return new URL(`${post.id}/`, PORTFOLIO_BLOG_URL).href;
}
