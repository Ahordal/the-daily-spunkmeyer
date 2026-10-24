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

/** Volumes count years from launch: 2026 is Vol. 1. */
export function volumeOf(date: Date): number {
  return date.getUTCFullYear() - 2026 + 1;
}

export interface Serial {
  volume: number;
  number: number;
}

/**
 * Each post's issue number, restarting at 1 every volume, in publish order.
 * Derived, not stored: back-dating or deleting a post renumbers the ones after it.
 */
export async function getSerials(): Promise<Map<string, Serial>> {
  const oldestFirst = [...(await getPublishedPosts())].sort(
    (a, b) => a.data.publishedDate.valueOf() - b.data.publishedDate.valueOf() || a.id.localeCompare(b.id),
  );
  const serials = new Map<string, Serial>();
  const counts = new Map<number, number>();
  for (const post of oldestFirst) {
    const volume = volumeOf(post.data.publishedDate);
    const number = (counts.get(volume) ?? 0) + 1;
    counts.set(volume, number);
    serials.set(post.id, { volume, number });
  }
  return serials;
}

/** "Vol. 1 · No. 014" */
export function formatSerial({ volume, number }: Serial): string {
  return `Vol. ${volume} · No. ${String(number).padStart(3, '0')}`;
}

/** Masthead edition line: the current volume and the latest post's date. */
export async function getEdition(): Promise<{ volume: number; date: Date } | null> {
  const posts = await getPublishedPosts();
  if (posts.length === 0) return null;
  const latest = posts[0].data.publishedDate;
  return { volume: volumeOf(latest), date: latest };
}
