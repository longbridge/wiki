import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

// schema 必须同时兼容文章与 overview 两种 frontmatter(spec §3.2)
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/en' }),
  schema: z.object({
    title: z.string(),
    zendesk_article_id: z.number().optional(),
    zendesk_section_id: z.number().optional(),
    zendesk_category_id: z.number().optional(),
    zendesk_updated_at: z.string().optional(),
    zendesk_edited_at: z.string().optional(),
    source_url: z.string().optional(),
    promoted: z.boolean().optional(),
    position: z.number().optional(),
    labels: z.array(z.string()).optional(),
    layout: z.string().optional(),
    sidebar: z.boolean().optional(),
  }),
})
export const collections = { docs }
