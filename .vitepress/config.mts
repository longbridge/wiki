import { defineConfig } from 'vitepress'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const docsRoot = join(__dirname, '../docs')

function getSidebarItems(dir: string, base: string) {
  const entries = readdirSync(dir).sort()
  const items: any[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const children = getSidebarItems(fullPath, `${base}/${entry}`)
      if (children.length > 0) {
        items.push({
          text: entry,
          collapsed: true,
          items: children,
        })
      }
    } else if (entry.endsWith('.md') && !['readme.md', 'index.md'].includes(entry.toLowerCase())) {
      const name = entry.replace(/\.md$/, '')
      items.push({
        text: name,
        link: `${base}/${name}`,
      })
    }
  }

  return items
}

function buildSidebar() {
  const topDirs = readdirSync(docsRoot)
    .filter(e => statSync(join(docsRoot, e)).isDirectory() && !e.startsWith('.'))
    .sort()

  return topDirs.map(dir => ({
    text: dir,
    collapsed: true,
    items: getSidebarItems(join(docsRoot, dir), `/${dir}`),
  }))
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Longbridge Wiki',
  description: 'Longbridge Securities Knowledge Base',
  base: '/wiki/',
  srcDir: './docs',
  srcExclude: ['**/node_modules/**'],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
    ],
    sidebar: buildSidebar(),
    search: {
      provider: 'local',
    },
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
