import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts never leave the editor. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}

/** URL-safe tag: "Map Projections" -> "map-projections". */
export function tagSlug(tag: string): string {
  return tag
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Every tag in use, keyed by slug so "Aliens" and "aliens" share a page. */
export function collectTags(posts: Post[]): Map<string, { label: string; posts: Post[] }> {
  const tags = new Map<string, { label: string; posts: Post[] }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      const entry = tags.get(slug) ?? { label: tag, posts: [] };
      entry.posts.push(post);
      tags.set(slug, entry);
    }
  }
  return tags;
}

// Dates are stored without a time, so format in UTC to avoid an off-by-one day.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { dateStyle: 'long', timeZone: 'UTC' });
}
