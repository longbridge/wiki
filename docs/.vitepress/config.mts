import { defineConfig, type Plugin } from 'vitepress'
import { loadEnv } from 'vite'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import UnoCSS from 'unocss/vite'
import { tipContainerPlugin } from './md-plugins/tip-container'
import { normalizeMdPlugin } from './md-plugins/normalize-md'
import { NAV_TABS } from './tabs.config'
import zhCN from './i18n/locales/zh-CN'
import en from './i18n/locales/en'
import zhHK from './i18n/locales/zh-HK'

// 读取 docs/.env.local（不入 git）中的私密配置
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const env = loadEnv('development', path.resolve(__dirname, '..'), '')

// dev proxy: 直接用完整 endpoint 路径作 key
// vite proxy 是 prefix 匹配，整路径作 key 既能命中请求，又不会误拦其他路由
const AI_ENDPOINT_PATH = env.VITE_AI_API_ENDPOINT || '/api/forward/v1/customer-service/docs/chat'
const AI_PROXY_PREFIX = AI_ENDPOINT_PATH

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
  } catch { }
  return fallback
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
  } catch { }
  return []
}

// 递归扫描目录生成侧边栏 items
// depth=0：顶级分类的直接子目录（二级），展开；depth>=1：三级及以下，折叠
function generateSidebarItemsFromDir(dir: string, base: string, dirNames: Record<string, string>, depth = 0): any[] {
  const items: any[] = []

  try {
    const order = loadOrder(dir)
    const allEntries = fs.readdirSync(dir)
      .filter(e => !e.startsWith('.') && e !== '_order.json' && e !== 'images')

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
        const subItems = generateSidebarItemsFromDir(fullPath, `${base}/${entry}`, dirNames, depth + 1)
        const displayName = dirNames[entry] || entry
        const hasIndex = fs.existsSync(path.join(fullPath, 'index.md'))

        // openapi-website sidebar 风格:无图标,完全用排版层级
        const text = displayName

        const groupItem: any = {
          text,
          collapsed: true,
          items: subItems,
        }
        if (hasIndex) groupItem.link = `${base}/${entry}/`

        items.push(groupItem)
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

// 顶级分类 icon 字典(对齐 docs.cdp.coinbase.com 风格)
// 使用 lucide icon 名,经 UnoCSS preset-icons 渲染为 `<span class="i-lucide-XXX">` 的 CSS mask SVG
const CATEGORY_ICONS: Record<string, string> = {
  'getting-started':           'rocket',
  'app-guide':                 'smartphone',
  'account':                   'user-round',
  'deposit':                   'arrow-down-to-line',
  'withdrawal':                'arrow-up-from-line',
  'transfers-and-fx':          'arrow-left-right',
  'stock-trading':             'trending-up',
  'derivatives':               'layers',
  'crypto':                    'bitcoin',
  'ipo':                       'star',
  'margin':                    'scale',
  'funds-and-wealth':          'wallet',
  'market-data':               'bar-chart-3',
  'portfolio-and-statements':  'file-text',
  'rewards':                   'gift',
  'compliance-and-tax':        'shield-check',
  'troubleshooting':           'life-buoy',
}

// 分类展示顺序（文档中心侧边栏按此顺序排列）
const categoryOrder = [
  'getting-started',
  'app-guide',
  'account',
  'deposit',
  'withdrawal',
  'transfers-and-fx',
  'stock-trading',
  'derivatives',
  'crypto',
  'ipo',
  'margin',
  'funds-and-wealth',
  'market-data',
  'portfolio-and-statements',
  'rewards',
  'compliance-and-tax',
  'troubleshooting',
]

// 生成侧边栏配置（从 zh-CN 读取，按 tab 路径前缀返回多套 sidebar）
function generateSidebar(localeDir: string, dirNames: Record<string, string>) {
  const contentRoot = localeDir === 'zh-CN' ? './docs/zh-CN' : `./docs/${localeDir}`
  // en 和 zh-HK 目前无内容，fallback 到 zh-CN
  const zhCNRoot = './docs/zh-CN'
  const effectiveRoot = fs.existsSync(contentRoot) && localeDir !== 'en' && localeDir !== 'zh-HK'
    ? contentRoot
    : zhCNRoot

  const topDirs = (() => {
    try {
      return fs.readdirSync(effectiveRoot)
        .filter(e => {
          if (skipDirs.has(e)) return false
          const fullPath = path.join(effectiveRoot, e)
          return fs.statSync(fullPath).isDirectory() && !e.startsWith('.')
        })
        .sort()
    } catch { return [] }
  })()

  // 构建每个分类目录的 sidebar item
  const itemByCategory: Record<string, object> = {}
  for (const dir of categoryOrder) {
    if (!topDirs.includes(dir)) continue
    const dirPath = path.join(effectiveRoot, dir)
    const items = generateSidebarItemsFromDir(dirPath, `/${dir}`, dirNames)
    // cdp 风格顶级 section header:icon + 大写小字 label,不可点(无 link),不可折叠(collapsed:false)
    // text 走 HTML(VitePress sidebar `text` 字段是 v-html 渲染),sidebar.css 控制视觉
    const iconName = CATEGORY_ICONS[dir]
    const iconHtml = iconName
      ? `<span class="sidebar-group-icon i-lucide-${iconName}" aria-hidden="true"></span>`
      : ''
    const label = dirNames[dir] || dir
    itemByCategory[dir] = {
      text: `${iconHtml}<span class="sidebar-group-label">${label}</span>`,
      // 不设 link —— 顶级 header 不可点,纯装饰
      collapsed: false,
      items,
    }
  }

  // 每个 tab 路径前缀对应该 tab 下的分类列表
  const sidebar: Record<string, object[]> = {}
  for (const tab of NAV_TABS) {
    sidebar[tab.path] = tab.categories
      .filter(cat => itemByCategory[cat])
      .map(cat => itemByCategory[cat])
  }

  // 补齐各分类自身的路径前缀：
  // 例如 troubleshooting 的 URL 是 /troubleshooting/...，
  // 但它隶属于 /getting-started/ tab，VitePress 无法匹配，导致侧边栏消失。
  // 这里为每个非 tab-root 的分类额外注册同一份 sidebar。
  for (const tab of NAV_TABS) {
    for (const cat of tab.categories) {
      const catPath = `/${cat}/`
      if (catPath !== tab.path) {
        sidebar[catPath] = sidebar[tab.path]
      }
    }
  }

  return sidebar
}

const sidebarZhCN = generateSidebar('zh-CN', zhCN.data.dirNames)
const sidebarEn = generateSidebar('en', ((en as any).data?.dirNames ?? {}) as Record<string, string>)
const sidebarZhHK = generateSidebar('zh-HK', ((zhHK as any).data?.dirNames ?? {}) as Record<string, string>)

const sharedNav = [
  { text: '首页', link: '/' },
  { text: '文档', link: '/docs/' },
  { text: 'Developers', link: 'https://open.longbridge.com', target: '_blank' },
]

const editLinkPattern = 'https://github.com/longbridge/docs/edit/main/docs/:path'

export default defineConfig({
  title: zhCN.vp.title,
  description: zhCN.vp.description,
  base: '/',
  appearance: 'light',
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
      link: '/',
      title: zhCN.vp.title,
      description: zhCN.vp.description,
      themeConfig: {
        nav: sharedNav,
        sidebar: sidebarZhCN,
        outline: { level: [2, 4], label: zhCN.vp.outline },
        lastUpdated: {
          text: zhCN.vp.lastUpdated,
          formatOptions: { dateStyle: 'medium' },
        },
        editLink: {
          pattern: editLinkPattern,
          text: zhCN.vp.editLink,
        },
        docFooter: {
          prev: zhCN.vp.prev,
          next: zhCN.vp.next,
        },
        footer: {
          message: zhCN.vp.footerMessage,
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'Longbridge Docs',
      description: 'Longbridge Docs',
      themeConfig: {
        nav: sharedNav,
        sidebar: sidebarEn,
        outline: { level: [2, 4], label: 'On this page' },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: { dateStyle: 'medium' },
        },
        editLink: {
          pattern: editLinkPattern,
          text: 'Edit this page on GitHub',
        },
        docFooter: { prev: 'Previous', next: 'Next' },
      },
    },
    'zh-HK': {
      label: '繁體中文',
      lang: 'zh-HK',
      link: '/zh-HK/',
      title: 'Longbridge Docs',
      description: 'Longbridge Docs',
      themeConfig: {
        nav: sharedNav,
        sidebar: sidebarZhHK,
        outline: { level: [2, 4], label: '本頁內容' },
        lastUpdated: {
          text: '最近更新',
          formatOptions: { dateStyle: 'medium' },
        },
        editLink: {
          pattern: editLinkPattern,
          text: '在 GitHub 上編輯此頁',
        },
        docFooter: { prev: '上一篇', next: '下一篇' },
        footer: {
          message: '© 2026 Longbridge. All rights reserved.',
        },
      },
    },
  },

  themeConfig: {
    logo: {
      src: 'https://assets.wbrks.com/assets/logo/logo-without-title-lb.svg',
      alt: 'Longbridge',
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            storeFields: ['title', 'titles', 'text'],
          },
        },
        locales: {
          root: {
            translations: {
              button: {
                buttonText: zhCN.vp.search.buttonText,
                buttonAriaLabel: zhCN.vp.search.buttonAriaLabel,
              },
              modal: {
                displayDetails: zhCN.vp.search.displayDetails,
                resetButtonTitle: zhCN.vp.search.resetButtonTitle,
                backButtonTitle: zhCN.vp.search.backButtonTitle,
                noResultsText: zhCN.vp.search.noResultsText,
                footer: {
                  selectText: zhCN.vp.search.footer.selectText,
                  selectKeyAriaLabel: zhCN.vp.search.footer.selectKeyAriaLabel,
                  navigateText: zhCN.vp.search.footer.navigateText,
                  navigateUpKeyAriaLabel: zhCN.vp.search.footer.navigateUpKeyAriaLabel,
                  navigateDownKeyAriaLabel: zhCN.vp.search.footer.navigateDownKeyAriaLabel,
                  closeText: zhCN.vp.search.footer.closeText,
                  closeKeyAriaLabel: zhCN.vp.search.footer.closeKeyAriaLabel,
                },
              },
            },
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'Up arrow',
                  navigateDownKeyAriaLabel: 'Down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'Escape',
                },
              },
            },
          },
          'zh-HK': {
            translations: {
              button: { buttonText: '搜尋文件', buttonAriaLabel: '搜尋文件' },
              modal: {
                displayDetails: '顯示詳細列表',
                resetButtonTitle: '清除查詢',
                backButtonTitle: '關閉搜尋',
                noResultsText: '無法找到相關結果',
                footer: {
                  selectText: '選擇',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: '切換',
                  navigateUpKeyAriaLabel: '方向鍵上',
                  navigateDownKeyAriaLabel: '方向鍵下',
                  closeText: '關閉',
                  closeKeyAriaLabel: 'Escape',
                },
              },
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/longbridge/docs' },
    ],
  },

  markdown: {
    breaks: true,
    config(md) {
      md.use(normalizeMdPlugin)
      md.use(tipContainerPlugin)
    },
  },

  vite: {
    plugins: [UnoCSS(), rawMarkdownPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './theme'),
      },
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false,
    },
    ssr: {
      noExternal: ['@rive-app/canvas', 'vue-i18n', '@intlify/core-base', '@intlify/message-compiler'],
    },
    server: {
      proxy: {
        [AI_PROXY_PREFIX]: {
          target: env.VITE_AI_API_HOST,
          changeOrigin: true,
        },
      },
    },
  },
})
