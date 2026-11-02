import type { APIContext } from 'astro';
import { getImage } from 'astro:assets';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getPublishedPosts } from '../../utils/posts';
import { DESTINATIONS, destinationUrl, receives, type Destination } from '../../utils/destinations';
import { getCategories } from '../../utils/taxonomy';

// One feed per destination site, read at its build time to publish the posts as its own pages.
// alexhordal.ca reads field-notes.json; changing this shape means updating the portfolio's src/utils/blog.ts too.
export function getStaticPaths() {
  return DESTINATIONS.map((destination) => ({ params: { site: destination.id }, props: { destination } }));
}

export async function GET(context: APIContext<{ destination: Destination }>) {
  const site = context.site!;
  const { destination } = context.props;
  const posts = (await getPublishedPosts()).filter((post) => receives(destination, post.data));
  const container = await AstroContainer.create();

  // The destination is another origin, so root-relative image paths must become absolute.
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
      const { title, summary, link, publishedDate, updatedDate, categories, cover, coverAlt } = post.data;
      const image = cover ? await getImage({ src: cover, width: 1280, format: 'webp' }) : null;
      const { Content } = await render(post);
      return {
        slug: post.id,
        title,
        summary: summary ?? '',
        link: link ?? null,
        url: destinationUrl(destination, post.id),
        blogUrl: new URL(`/posts/${post.id}/`, site).href,
        publishedDate: publishedDate.toISOString(),
        updatedDate: updatedDate?.toISOString() ?? null,
        categories: getCategories(categories).map(({ id, label, color }) => ({ id, label, color })),
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
    title: destination.feedTitle,
    home: site.href,
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
