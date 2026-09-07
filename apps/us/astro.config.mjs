import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import remarkBreaks from 'remark-breaks'
import { rehypeBaseLinks } from './src/lib/rehype-base-links.mjs'

// US app: 内容主源 en(Zendesk 同步产物，见 apps/us/scripts),URL /us/ 前缀由 base 提供。
// build.format:'file' 产出 {path}.html，与旧 VitePress cleanUrls 的产物形态/对外 URL 一致。
export default defineConfig({
  base: '/us/en/support/',
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
  // 浏览器兼容目标:Chrome 80(web 下限)+ Safari 13(App WebKit 下限)。
  // - build.target:esbuild 按此降级 JS 语法(如为 safari13 降 ?./?? 等)
  // - css.transformer=lightningcss:按 targets 降级 CSS(inset 简写拆长手、自动补 -webkit- 前缀)。
  //   注意:凡 lightningcss 认识的属性(backdrop-filter/mask 等)源里只写无前缀版,前缀交给它补;
  //   手写前缀+无前缀并存会被它砍成只剩前缀,反而丢无前缀(见 search/whale/home 已清理)。
  //   :has() 与 flex gap 它不处理,分别靠 JS 打 class 与手改 margin。
  vite: {
    build: { target: ['chrome80', 'safari13'] },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: { chrome: 80 << 16, safari: 13 << 16 },
      },
    },
  },
})
