import type { Post } from './posts';

// Posts ticked "Also on portfolio" become Field Notes on alexhordal.ca; that copy is the canonical one.
// astro.config.mjs reads the same front-matter flag for the sitemap filter.
export const PORTFOLIO_BLOG_URL = 'https://www.alexhordal.ca/field_notes/';

export function isOnPortfolio(post: Post): boolean {
  return post.data.portfolio;
}

export function portfolioUrl(post: Post): string {
  return new URL(`${post.id}/`, PORTFOLIO_BLOG_URL).href;
}
