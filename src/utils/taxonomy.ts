// Sections and categories in one place: the editor, the content schema and every page read these.
// A post has exactly one section and any number of categories; any category fits any section.

export const SECTIONS = [
  {
    id: 'article',
    label: 'Articles',
    singular: 'Article',
    path: '/articles/',
    description: 'Longer posts on The Daily Spunkmeyer.',
  },
  {
    id: 'dispatch',
    label: 'Dispatches',
    singular: 'Dispatch',
    path: '/dispatches/',
    description: 'Quick finds: links, clips and things worth a look.',
  },
  // Also published on alexhordal.ca/field_notes; see utils/portfolio.ts.
  {
    id: 'field-note',
    label: 'Field Notes',
    singular: 'Field Note',
    path: '/field_notes/',
    description: 'Map, design and code: my projects and how they are made.',
  },
] as const;

// Brighter, mid-toned squares, kept clear of the darker topographic section tabs.
// Order is mapping, then building, then field and personal; posts list their categories in this order.
export const CATEGORIES = [
  // Mapping
  { id: 'cartography', label: 'Cartography', color: '#e8222b' },
  { id: 'terrain', label: 'Terrain & Relief', color: '#b07a3b' },
  { id: 'gis-data', label: 'GIS & Data', color: '#13868a' },
  { id: 'web-maps', label: 'Web Maps', color: '#3a6fd8' },
  { id: 'dataviz', label: 'Data Visualization', color: '#e9a227' },
  // Building
  { id: 'building-with-ai', label: 'Building with AI', color: '#6b4fa0' },
  { id: 'ui-design', label: 'UI Design', color: '#d6458b' },
  { id: 'ux', label: 'UX', color: '#45b5d6' },
  { id: 'web-dev', label: 'Web Development', color: '#4a5568' },
  { id: 'tools', label: 'Tools & Workflow', color: '#9aa5b1' },
  // Field and personal
  { id: 'field', label: 'Field Experience', color: '#f26b1d' }, // safety orange
  { id: 'outdoors', label: 'Outdoors', color: '#5fa85a' },
  { id: 'games-film', label: 'Games & Film', color: '#17171c' },
  { id: 'life', label: 'Life', color: '#8c847e' },
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
