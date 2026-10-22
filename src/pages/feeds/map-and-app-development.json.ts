import type { APIContext } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedPosts } from '../../utils/posts';

// Read by alexhordal.ca at build time to list dev posts on its /blog page.
// Changing this shape means updating the portfolio's src/utils/blog.ts too.
export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = (await getPublishedPosts()).filter((post) => post.data.category === 'map-app-dev');

  const items = await Promise.all(
    posts.map(async (post) => {
      const { title, summary, publishedDate, updatedDate, tags, cover, coverAlt } = post.data;
      const image = cover ? await getImage({ src: cover, width: 960, format: 'webp' }) : null;
      return {
        title,
        summary,
        url: new URL(`/posts/${post.id}/`, site).href,
        publishedDate: publishedDate.toISOString(),
        updatedDate: updatedDate?.toISOString() ?? null,
        tags,
        cover: image
          ? {
              src: new URL(image.src, site).href,
              width: image.attributes.width,
              height: image.attributes.height,
              alt: coverAlt ?? '',
            }
          : null,
      };
    }),
  );

  const feed = {
    title: 'The Daily Spunkmeyer: Map & App Development',
    home: site.href,
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
