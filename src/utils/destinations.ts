// Other sites that republish posts from here, in one place: feeds, canonical links,
// the sitemap and deploy hooks all read this. Plain data so astro.config.mjs can use it too.
// Each site gets /feeds/<id>.json and rebuilds from it.

import type { CategoryId } from './taxonomy';

/** The front-matter fields a destination's rule looks at. */
export interface RoutedPost {
  portfolio: boolean;
  categories: readonly CategoryId[];
}

export interface Destination {
  id: string;
  /** Shown on the post: "Also on <label>". */
  label: string;
  feedTitle: string;
  /** Where the site shows these posts; a post's copy is at <postsUrl><slug>/. */
  postsUrl: string;
  /** Which posts it receives. */
  receives: { portfolio: true } | { category: CategoryId };
  /** Content collections in its feed. Posts only for now; an aquarium log would add its own. */
  collections: readonly 'posts'[];
  /** Vercel env var holding the site's deploy hook URL. */
  hookEnv: string;
  /**
   * True once the site actually shows these posts. Until then the feed still builds,
   * but posts stay canonical here and the site isn't rebuilt.
   */
  live: boolean;
}

// Order matters: a post that goes to several sites is canonical on the first live one.
export const DESTINATIONS: readonly Destination[] = [
  {
    // The id keeps the portfolio's existing /feeds/field-notes.json address.
    id: 'field-notes',
    label: 'alexhordal.ca',
    feedTitle: 'The Daily Spunkmeyer: Field Notes',
    postsUrl: 'https://www.alexhordal.ca/field_notes/',
    receives: { portfolio: true },
    collections: ['posts'],
    hookEnv: 'PORTFOLIO_DEPLOY_HOOK_URL',
    live: true,
  },
  {
    id: 'ullr-maps',
    label: 'ULLR Maps',
    feedTitle: 'ULLR Maps: Articles',
    postsUrl: 'https://www.ullrmaps.com/articles/',
    receives: { category: 'ullr-maps' },
    collections: ['posts'],
    hookEnv: 'ULLR_DEPLOY_HOOK_URL',
    live: false,
  },
];

export function receives(destination: Destination, post: RoutedPost): boolean {
  const rule = destination.receives;
  return 'portfolio' in rule ? post.portfolio : post.categories.includes(rule.category);
}

export function destinationsFor(post: RoutedPost): Destination[] {
  return DESTINATIONS.filter((d) => receives(d, post));
}

/** The live site that holds a post's original, if another site does. */
export function canonicalDestination(post: RoutedPost): Destination | undefined {
  return destinationsFor(post).find((d) => d.live);
}

export function destinationUrl(destination: Destination, slug: string): string {
  return new URL(`${slug}/`, destination.postsUrl).href;
}
