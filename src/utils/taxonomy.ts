// Sections and categories in one place: the editor, the content schema and every page read these.
// A post has exactly one section and any number of categories; any category fits any section.

export const SECTIONS = [
  { id: 'article', label: 'Articles', singular: 'Article', path: '/articles/' },
  { id: 'dispatch', label: 'Dispatches', singular: 'Dispatch', path: '/dispatches/' },
  // Also published on alexhordal.ca/field_notes; see utils/portfolio.ts.
  { id: 'field-note', label: 'Field Notes', singular: 'Field Note', path: '/field_notes/' },
] as const;

// Colours follow the Semiotic Standard palette (bar Tech and AI); the map/dev trio share the logo's red and navys.
export const CATEGORIES = [
  { id: 'cartography', label: 'Cartography', color: '#e8222b' },
  { id: 'maps', label: 'Maps', color: '#232f78' },
  { id: 'app-design', label: 'App Design', color: '#6c8ad8' },
  { id: 'film', label: 'Film & Sci-Fi', color: '#17171c' },
  { id: 'gaming', label: 'Gaming', color: '#e36f1e' },
  { id: 'outdoors', label: 'Outdoors & Travel', color: '#2e6b3a' },
  { id: 'life', label: 'Life', color: '#8c847e' },
  { id: 'memes', label: 'Memes', color: '#f4a259' },
  { id: 'clips', label: 'Clips', color: '#7fb685' },
  // Outside the Semiotic palette on purpose: no hues left there that read apart from the nine above.
  { id: 'tech', label: 'Tech', color: '#13868a' },
  { id: 'ai', label: 'AI', color: '#6b4fa0' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type Section = (typeof SECTIONS)[number];
export type Category = (typeof CATEGORIES)[number];

export const SECTION_IDS = SECTIONS.map((s) => s.id) as [SectionId, ...SectionId[]];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function getSection(id: SectionId): Section {
  return SECTIONS.find((s) => s.id === id)!;
}

/** Categories in the canonical order above, whatever order the post lists them in. */
export function getCategories(ids: readonly CategoryId[]): Category[] {
  return CATEGORIES.filter((c) => ids.includes(c.id));
}
