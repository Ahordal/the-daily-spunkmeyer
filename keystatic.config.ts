import { config, fields, collection } from '@keystatic/core';
import { wrapper } from '@keystatic/core/content-components';
import { SECTIONS, CATEGORIES } from './src/utils/taxonomy';

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
      columns: ['title', 'section', 'publishedDate'],
      schema: {
        section: fields.select({
          label: 'Section',
          description:
            'Field Note: map, design and code work, also published on alexhordal.ca. Article: longer personal pieces. Dispatch: quick, light finds.',
          options: SECTIONS.map((s) => ({ label: s.singular, value: s.id })),
          defaultValue: 'article',
        }),
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
          description: 'Optional. One or two sentences for the post list, search results and link previews.',
          multiline: true,
          validation: { length: { max: 200 } },
        }),
        link: fields.url({
          label: 'Link',
          description: 'Optional. For a dispatch about something you found: where it lives.',
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
        categories: fields.multiselect({
          label: 'Categories',
          description: 'Pick any that fit. Used for the coloured markers and the archive filter.',
          options: CATEGORIES.map((c) => ({ label: c.label, value: c.id })),
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
