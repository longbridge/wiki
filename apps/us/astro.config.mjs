import { defineConfig } from 'astro/config'

// US app: 内容主源 en(Zendesk 同步产物，见 apps/us/scripts),URL /us/ 前缀由 base 提供。
// build.format:'file' 产出 {path}.html，与旧 VitePress cleanUrls 的产物形态/对外 URL 一致。
//
// NOTE: remarkBreaks + rehypeBaseLinks wired in Task 2 via @astrojs/markdown-remark unified() API.
// Astro 7.2 dropped markdown.remarkPlugins/rehypePlugins without @astrojs/markdown-remark installed.
// Task 1 is scaffold-only (no Markdown content rendered); Task 2 adds the dep and migrates this config.
export default defineConfig({
  base: '/us/',
  outDir: './dist',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 4321 },
})
