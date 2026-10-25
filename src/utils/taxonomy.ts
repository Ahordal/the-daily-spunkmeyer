// Categories in one place: the editor, the content schema and every page read these.
// Posts form one stream; categories are the only way they're sorted.

// The Topics page lists categories under these, in this order.
export const CATEGORY_GROUPS = [
  { id: 'mapping', label: 'Mapping' },
  { id: 'building', label: 'Building' },
  { id: 'field-life', label: 'Field & Life' },
] as const;

// Brighter, mid-toned squares, kept clear of the darker topographic page tabs.
// Posts list their categories in this order.
export const CATEGORIES = [
  { id: 'cartography', label: 'Cartography', color: '#e8222b', group: 'mapping' },
  { id: 'terrain', label: 'Terrain & Relief', color: '#b07a3b', group: 'mapping' },
  { id: 'gis-data', label: 'GIS & Data', color: '#13868a', group: 'mapping' },
  { id: 'web-maps', label: 'Web Maps', color: '#3a6fd8', group: 'mapping' },
  { id: 'dataviz', label: 'Data Visualization', color: '#e9a227', group: 'mapping' },
  { id: 'building-with-ai', label: 'Building with AI', color: '#6b4fa0', group: 'building' },
  { id: 'ui-design', label: 'UI Design', color: '#d6458b', group: 'building' },
  { id: 'ux', label: 'UX', color: '#45b5d6', group: 'building' },
  { id: 'web-dev', label: 'Web Development', color: '#4a5568', group: 'building' },
  { id: 'tools', label: 'Tools & Workflow', color: '#9aa5b1', group: 'building' },
  { id: 'field', label: 'Field Experience', color: '#f26b1d', group: 'field-life' }, // safety orange
  { id: 'outdoors', label: 'Outdoors', color: '#5fa85a', group: 'field-life' },
  { id: 'games-film', label: 'Games & Film', color: '#17171c', group: 'field-life' },
  { id: 'life', label: 'Life', color: '#8c847e', group: 'field-life' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

/** Categories in the canonical order above, whatever order the post lists them in. */
export function getCategories(ids: readonly CategoryId[]): Category[] {
  return CATEGORIES.filter((c) => ids.includes(c.id));
}

/** Tab text for a category-coloured tab: the light page colour, or near-black where that reads better. */
export function tabTextColor(hex: string): string {
  const luminance = (h: string) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  // Mirrors --bg and --text-title in global.css.
  return contrast(hex, '#ffffff') >= contrast(hex, '#0b0e1c') ? 'var(--bg)' : 'var(--text-title)';
}

export function topicPath(id: CategoryId): string {
  return `/topics/${id}/`;
}
