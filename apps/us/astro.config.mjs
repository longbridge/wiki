import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import remarkBreaks from 'remark-breaks'
import { rehypeBaseLinks } from './src/lib/rehype-base-links.mjs'

// US app: 内容主源 en(Zendesk 同步产物，见 apps/us/scripts),URL /us/ 前缀由 base 提供。
// build.format:'file' 产出 {path}.html，与旧 VitePress cleanUrls 的产物形态/对外 URL 一致。
export default defineConfig({
  base: '/us/',
  outDir: './dist',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 4321 },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkBreaks],
      rehypePlugins: [rehypeBaseLinks],
    }),
  },
})
