import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/posts';
import { getSection, getCategories } from '../utils/taxonomy';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'The Daily Spunkmeyer',
    description: 'A blog by Alex Hordal.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? undefined,
      pubDate: post.data.publishedDate,
      link: `/posts/${post.id}/`,
      // Section first, so feed readers can sort Articles, Dispatches and Field Notes apart.
      categories: [getSection(post.data.section).singular, ...getCategories(post.data.categories).map((c) => c.label)],
    })),
    customData: '<language>en-ca</language>',
  });
}
