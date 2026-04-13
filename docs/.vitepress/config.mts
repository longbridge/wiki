import { defineConfig, type Plugin } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 访问 /some/page.md 返回原始 markdown 源码（开发模式 + 生产构建）
function rawMarkdownPlugin(): Plugin {
  return {
    name: 'raw-markdown-source',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').replace(/\?.*$/, '')
        if (!url.endsWith('.md')) return next()

        // 只处理浏览器导航请求，放过 Vite 内部模块导入（import('/xxx.md')）
        // 浏览器导航时 Accept 包含 text/html，模块导入时为 */*
        const accept = req.headers['accept'] ?? ''
        if (!accept.includes('text/html')) return next()

        // 优先从 zh-CN 目录查找（rewrites 映射的内容）
        const candidates = [
          path.join('docs/zh-CN', url),
          path.join('docs', url),
        ]

        for (const filePath of candidates) {
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(content)
            return
          }
        }

        next()
      })
    },

    // 生产构建：把所有 .md 源文件复制到 dist，保持与 HTML 相同的路径结构
    closeBundle() {
      const outDir = path.resolve('docs/.vitepress/dist')
      if (!fs.existsSync(outDir)) return

      function copyMdFiles(srcDir: string, urlBase: string) {
        if (!fs.existsSync(srcDir)) return
        for (const entry of fs.readdirSync(srcDir)) {
          const srcPath = path.join(srcDir, entry)
          const stat = fs.statSync(srcPath)
          if (stat.isDirectory()) {
            copyMdFiles(srcPath, `${urlBase}/${entry}`)
          } else if (entry.endsWith('.md')) {
            const destPath = path.join(outDir, urlBase, entry)
            fs.mkdirSync(path.dirname(destPath), { recursive: true })
            fs.copyFileSync(srcPath, destPath)
          }
        }
      }

      // zh-CN 内容通过 rewrites 映射到根路径，dest 也用根路径
      copyMdFiles(path.resolve('docs/zh-CN'), '')
    },
  }
}

// 从 .md 文件中提取 frontmatter title 或第一个 H1
function extractTitle(filePath: string, fallback: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (fmMatch) {
      const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m)
      if (titleMatch) return titleMatch[1].trim()
    }
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) return h1Match[1].trim()
  } catch {}
  return fallback
}

// 目录显示名称映射（英文目录名 → 中文显示名）
const dirDisplayNames: Record<string, string> = {
  'getting-started': '新手入门',
  'account': '开户与账户',
  'deposit': '入金',
  'withdrawal': '出金',
  'transfers-and-fx': '资金划转与换汇',
  'stock-trading': '股票交易',
  'derivatives': '衍生品',
  'ipo': '新股认购',
  'margin': '融资融券',
  'funds-and-wealth': '基金与理财',
  'market-data': '行情数据',
  'portfolio-and-statements': '资产与账单',
  'rewards': '活动与奖励',
  'compliance-and-tax': '合规与税务',
  'troubleshooting': '故障排查',
  // stock-trading 子目录
  'trading-hours-and-rules': '交易时间与规则',
  'trading-fees': '交易费用',
  'corporate-actions': '分红与公司行动',
  'desktop-tools': '桌面端工具',
  'stock-transfer': '股票转仓',
  'order-types': '订单类型',
}

// 跳过的目录（语言子目录 + 文档中心入口目录）
const skipDirs = new Set(['en', 'zh-HK', 'zh-CN', 'docs'])

// 读取目录的排序配置（_order.json），返回 slug/dirname 数组
function loadOrder(dir: string): string[] {
  try {
    const orderFile = path.join(dir, '_order.json')
    if (fs.existsSync(orderFile)) {
      return JSON.parse(fs.readFileSync(orderFile, 'utf-8'))
    }
  } catch {}
  return []
}

// 递归扫描目录生成侧边栏 items
function generateSidebarItemsFromDir(dir: string, base: string): any[] {
  const items: any[] = []

  try {
    const order = loadOrder(dir)
    const allEntries = fs.readdirSync(dir)
      .filter(e => !e.startsWith('.') && e !== '_order.json')

    // 按 _order.json 排序；未列出的追加到末尾（字母序）
    const sorted = [
      ...order.filter(o => allEntries.includes(o) || allEntries.includes(`${o}.md`))
             .map(o => allEntries.find(e => e === o || e === `${o}.md`)!),
      ...allEntries.filter(e => {
        const slug = e.replace(/\.md$/, '')
        return !order.includes(slug) && !order.includes(e)
      }).sort(),
    ]

    for (const entry of sorted) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        const link = `${base}/${entry}/`
        const subItems = generateSidebarItemsFromDir(fullPath, `${base}/${entry}`)
        const displayName = dirDisplayNames[entry] || entry

        items.push({
          text: displayName,
          link,
          collapsed: false,
          items: subItems,
        })
      } else if (entry.endsWith('.md') && entry !== 'index.md') {
        const slug = entry.replace(/\.md$/, '')
        const link = `${base}/${slug}`
        const title = extractTitle(fullPath, slug)
        items.push({
          text: title,
          link,
        })
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }

  return items
}

// 分类展示顺序（文档中心侧边栏按此顺序排列）
const categoryOrder = [
  'getting-started',
  'account',
  'deposit',
  'withdrawal',
  'transfers-and-fx',
  'stock-trading',
  'derivatives',
  'ipo',
  'margin',
  'funds-and-wealth',
  'market-data',
  'portfolio-and-statements',
  'rewards',
  'compliance-and-tax',
  'troubleshooting',
]

// 生成侧边栏配置（从 zh-CN 读取，路径映射到根路径）
function generateSidebar() {
  const zhCNRoot = './docs/zh-CN'

  const topDirs = (() => {
    try {
      return fs.readdirSync(zhCNRoot)
        .filter(e => {
          if (skipDirs.has(e)) return false
          const fullPath = path.join(zhCNRoot, e)
          return fs.statSync(fullPath).isDirectory() && !e.startsWith('.')
        })
        .sort()
    } catch { return [] }
  })()

  // 全站共用一份聚合侧边栏，key 用 '/' 匹配所有路由
  // 这样点击文章后侧边栏不会切换，只高亮当前页
  const allItems = categoryOrder
    .filter(dir => topDirs.includes(dir))
    .map(dir => {
      const dirPath = path.join(zhCNRoot, dir)
      const items = generateSidebarItemsFromDir(dirPath, `/${dir}`)
      return {
        text: dirDisplayNames[dir] || dir,
        link: `/${dir}/`,
        collapsed: false,
        items,
      }
    })

  return { '/': allItems }
}

export default defineConfig({
  title: 'Longbridge Wiki',
  description: '长桥证券用户知识库',
  base: '/wiki/',
  ignoreDeadLinks: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: 'https://assets.wbrks.com/assets/logo/logo1.png' }],
  ],

  // 将 zh-CN/ 下的文件重写到根路径，使简体中文成为默认语言
  rewrites: {
    'zh-CN/index.md': 'index.md',
    'zh-CN/docs/index.md': 'docs/index.md',
    'zh-CN/:path*': ':path*',
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
    },
    'zh-HK': {
      label: '繁體中文',
      lang: 'zh-HK',
      link: '/zh-HK/',
    },
  },

  themeConfig: {
    logo: {
      src: 'https://assets.wbrks.com/assets/logo/logo-without-title-lb.svg',
      alt: 'Longbridge',
    },

    sidebar: generateSidebar(),

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
      { text: 'Developers', link: 'https://open.longbridge.com', target: '_blank' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/longbridge/wiki' },
    ],

    footer: {
      message: '© 2024 Longbridge. All rights reserved.',
      copyright: 'Made with VitePress',
    },
  },

  markdown: {
    breaks: true,
  },

  vite: {
    plugins: [rawMarkdownPlugin()],
  },
})
