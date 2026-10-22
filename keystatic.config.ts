import { config, fields, collection } from '@keystatic/core';

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
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedDate: fields.date({
          label: 'Published date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Hidden from the site until unchecked.',
          defaultValue: true,
        }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
