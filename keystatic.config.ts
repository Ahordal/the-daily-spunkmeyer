import { config, fields, collection } from '@keystatic/core';
import { wrapper } from '@keystatic/core/content-components';

// Images live under src/ so Astro can resize and compress them at build time.
// publicPath is relative to the post file in src/content/posts/.
const postImages = {
  directory: 'src/assets/posts',
  publicPath: '../../assets/posts/',
};

export default config({
  // GitHub in every environment, so posts written locally, on the live site
  // and from a phone all land in the repo and can't drift apart.
  storage: {
    kind: 'github',
    repo: { owner: 'Ahordal', name: 'the-daily-spunkmeyer' },
  },
  ui: {
    brand: { name: 'The Daily Spunkmeyer' },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      columns: ['title', 'publishedDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL',
            description: 'The post address: /posts/<this>/. Changing it after publishing breaks old links.',
          },
        }),
        publishedDate: fields.date({
          label: 'Published date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Updated date',
          description: 'Optional. Set when a published post is meaningfully revised.',
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'One or two sentences. Shown in the post list, search results and link previews.',
          multiline: true,
          validation: { length: { min: 1, max: 200 } },
        }),
        cover: fields.image({
          label: 'Cover image',
          description: 'Optional. Top of the post, the post list and link previews. Landscape works best.',
          ...postImages,
        }),
        coverAlt: fields.text({
          label: 'Cover image description',
          description: 'What the cover shows, for screen readers. Required when there is a cover.',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Hidden from the site until unchecked.',
          defaultValue: true,
        }),
        content: fields.markdoc({
          label: 'Content',
          options: { image: postImages },
          components: {
            figure: wrapper({
              label: 'Figure',
              description: 'An image with a caption. Put the image inside the block.',
              schema: {
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),
          },
        }),
      },
    }),
  },
});
