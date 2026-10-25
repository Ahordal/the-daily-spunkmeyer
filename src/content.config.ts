import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS } from './utils/taxonomy';

// Mirrors the posts schema in keystatic.config.ts; keep the two in step.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        portfolio: z.boolean().default(false),
        publishedDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional().nullable(),
        summary: z.string().optional().nullable(),
        link: z.string().url().optional().nullable(),
        cover: image().optional().nullable(),
        coverAlt: z.string().optional().nullable(),
        categories: z.array(z.enum(CATEGORY_IDS)).default([]),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || data.coverAlt, {
        message: 'A cover image needs a description (coverAlt).',
        path: ['coverAlt'],
      }),
});

export const collections = { posts };
