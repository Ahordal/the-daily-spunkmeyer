import type { APIContext } from 'astro';
import { getImage } from 'astro:assets';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getPublishedPosts } from '../../utils/posts';
import { isDevPost, portfolioUrl } from '../../utils/portfolio';

// Read by alexhordal.ca at build time to publish dev posts as its own /blog pages.
// Changing this shape means updating the portfolio's src/utils/blog.ts too.
export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = (await getPublishedPosts()).filter(isDevPost);
  const container = await AstroContainer.create();

  // The portfolio is another origin, so root-relative image paths must become absolute.
  const absolutize = (html: string) =>
    html
      .replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`)
      .replace(/srcset="([^"]*)"/g, (_, set: string) =>
        `srcset="${set
          .split(',')
          .map((part) => part.trim().replace(/^\/(?!\/)/, `${site.origin}/`))
          .join(', ')}"`,
      );

  const items = await Promise.all(
    posts.map(async (post) => {
      const { title, summary, publishedDate, updatedDate, tags, cover, coverAlt } = post.data;
      const image = cover ? await getImage({ src: cover, width: 1280, format: 'webp' }) : null;
      const { Content } = await render(post);
      return {
        slug: post.id,
        title,
        summary,
        url: portfolioUrl(post),
        blogUrl: new URL(`/posts/${post.id}/`, site).href,
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
        html: absolutize(await container.renderToString(Content)),
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
