import type { Post } from './posts';

// Field Notes are published on both sites; the portfolio copy is the canonical one.
// astro.config.mjs keeps its own copy of the section value for the sitemap filter.
export const PORTFOLIO_BLOG_URL = 'https://www.alexhordal.ca/field_notes/';

export function isFieldNote(post: Post): boolean {
  return post.data.section === 'field-note';
}

export function portfolioUrl(post: Post): string {
  return new URL(`${post.id}/`, PORTFOLIO_BLOG_URL).href;
}
