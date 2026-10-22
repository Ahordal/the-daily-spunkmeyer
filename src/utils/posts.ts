import { getCollection, type CollectionEntry } from 'astro:content';
import type { SectionId } from './taxonomy';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts never leave the editor. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}

export async function getPostsInSection(section: SectionId): Promise<Post[]> {
  return (await getPublishedPosts()).filter((post) => post.data.section === section);
}

// Dates are stored without a time, so format in UTC to avoid an off-by-one day.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { dateStyle: 'long', timeZone: 'UTC' });
}

/** Bare host for a dispatch's source link: "https://www.example.com/x" -> "example.com". */
export function linkHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

/** Masthead edition line: volume counts years since launch, number counts published posts. */
export async function getEdition(): Promise<{ volume: number; number: string; date: Date } | null> {
  const posts = await getPublishedPosts();
  if (posts.length === 0) return null;
  const latest = posts[0].data.publishedDate;
  return {
    volume: latest.getUTCFullYear() - 2026 + 1,
    number: String(posts.length).padStart(3, '0'),
    date: latest,
  };
}
