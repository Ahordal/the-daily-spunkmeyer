import { config, fields, collection } from '@keystatic/core';

export default config({
  // Switch to { kind: 'github', repo: 'owner/name' } to edit on the deployed site.
  storage: { kind: 'local' },
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
