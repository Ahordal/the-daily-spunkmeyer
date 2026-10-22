import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

// Tags here must match the content components in keystatic.config.ts.
export default defineMarkdocConfig({
  tags: {
    figure: {
      render: component('./src/components/Figure.astro'),
      attributes: {
        caption: { type: String },
      },
    },
  },
});
