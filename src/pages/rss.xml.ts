import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'The Daily Spunkmeyer',
    description: 'A blog by Alex Hordal.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishedDate,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-ca</language>',
  });
}
