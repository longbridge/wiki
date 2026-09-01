# US Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `apps/us` 从 VitePress 2 重建为 Astro 7 静态站，视觉与交互 1:1 对齐 Zendesk 主题 `/Users/tangyu/Downloads/Longbridge_us`,保留 region 切换 / 明暗切换 / GitHub 功能，内容管道与 URL 不变。

**Architecture:** 零框架 island 的纯 Astro 静态站。Zendesk 主题里运行时从 HC API 拉的数据 (mega 菜单、catx promoted 卡、side-tree 树、面包屑改写) 全部转为构建期静态渲染;客户端只保留 DOM 行为脚本 (vanilla TS，从原主题逐条移植)。搜索用 Pagefind。

**Tech Stack:** bun workspace、Astro ^7.2(`base:'/us/'`、`build.format:'file'`)、remark-breaks、Pagefind、vanilla TS、纯 CSS(design.md §5 token 体系)。

**Spec:** `specs/us-astro-migration/design.md` — 本计划的所有视觉/交互规格、token 值、验收口径都在 spec 里，**执行每个任务前先读 spec 对应章节**。

## Global Constraints

- 视觉/交互唯一基准：`/Users/tangyu/Downloads/Longbridge_us`(style.css 同一选择器**以文件末尾规则为准**;spec §10 风险清单必读)。
- 只动 `apps/us`、`.github/workflows/deploy.yml`、根 `README.md`、`specs/us-astro-migration/`;**禁碰** `apps/hk`、`apps/sg`、`packages/shared`、`apps/us/scripts/**`(唯一例外:Task 14 对 `scripts/zendesk/client.ts` 的认证可选化)、`apps/us/.env*`。
- `apps/us/docs/en/**` 内容只读 (仅 Task 1 一次性删除 `index.md`、`graph.md`)。
- 新依赖白名单：`astro`、`remark-breaks`、`pagefind`、`@astrojs/check`+`typescript`(dev)。其余一律不加;现有 sync 依赖 (dotenv/turndown/turndown-plugin-gfm/github-slugger/@types/turndown) 必须保留。
- 禁 UI 框架 (react/vue/svelte)island;交互全部 vanilla TS。
- 强调色只用 spec §5 的 `--accent-teal` 体系 (#00B8B8 / #00F0C4 / #22E5CF);禁止照抄原主题未定义的 `var(--primary)` 等。
- 所有内部链接/资产经 `withBase()` 或 `import.meta.env.BASE_URL` 处理 (base=`/us/`)。
- 验证全部 scoped:`cd apps/us` 后跑 `bunx astro build` / `bun test` / `bunx astro check`;不跑仓库级全量命令 (hk/sg 回归仅在 Task 12 各跑一次 build)。
- Commit 格式 `<type>(us): <描述>`(CI/README 用 `ci(us)`/`docs(repo)`);只 stage 本任务文件，禁 `git add -A`、禁 `--no-verify`。
- 秘钥零硬编码;`.env.local` 不进 git(现状已如此)。

---

### Task 1: Astro 工程脚手架 (替换 VitePress 壳)

**Files:**
- Modify: `apps/us/package.json`(整体重写，保留原 `name` 字段值与全部 sync 依赖)
- Create: `apps/us/astro.config.mjs`、`apps/us/tsconfig.json`、`apps/us/src/pages/index.astro`(占位，Task 7 重写)、`apps/us/src/env.d.ts`
- Delete: `apps/us/docs/.vitepress/`(整目录，含 cache/dist/config.mts/theme/topic-counts.data.ts/link-graph.json)、`apps/us/docs/en/index.md`、`apps/us/docs/en/graph.md`

**Interfaces:**
- Produces: 可运行的 Astro 工程;`bun run dev` / `bun run build` / `bun run preview` / `bun run check` / `bun run test` 脚本;后续任务全部在此骨架内添加文件。

- [ ] **Step 1: 重写 `apps/us/package.json`**

先 `cat apps/us/package.json` 记下原 `name` 与 sync 相关依赖的现有版本号，然后写入 (`name`、sync 依赖版本照抄原值):

```json
{
  "name": "<原值>",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "test": "bun test",
    "sync": "bun run scripts/fetch-zendesk.ts"
  },
  "dependencies": {
    "astro": "^7.2.0",
    "pagefind": "^1.0.0",
    "remark-breaks": "^4.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "latest 用 bun add -d 解析",
    "typescript": "同上",
    "dotenv": "<原值>",
    "github-slugger": "<原值>",
    "turndown": "<原值>",
    "turndown-plugin-gfm": "<原值>",
    "@types/turndown": "<原值>"
  }
}
```

在仓库根跑 `bun install`;`@astrojs/check`/`typescript` 用 `cd apps/us && bun add -d @astrojs/check typescript` 让 bun 解析当前版本。

- [ ] **Step 2: 写 `apps/us/astro.config.mjs`**

```js
import { defineConfig } from 'astro/config'
import remarkBreaks from 'remark-breaks'
import { rehypeBaseLinks } from './src/lib/rehype-base-links.mjs'

// US app:内容主源 en(Zendesk 同步产物，见 apps/us/scripts),URL /us/ 前缀由 base 提供。
// build.format:'file' 产出 {path}.html，与旧 VitePress cleanUrls 的产物形态/对外 URL 一致。
export default defineConfig({
  base: '/us/',
  outDir: './dist',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 4321 },
  markdown: {
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [rehypeBaseLinks],
  },
})
```

同时创建最小占位 `src/lib/rehype-base-links.mjs`(Task 2 实现真逻辑):

```js
export function rehypeBaseLinks() {
  return () => {}
}
```

- [ ] **Step 3: 写 `tsconfig.json` 与 `src/env.d.ts`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist", "scripts"]
}
```

`src/env.d.ts`:`/// <reference types="astro/client" />`。注意 `exclude: ["scripts"]`——sync 脚本沿用原有根 tsconfig 环境，不纳入 astro check。

- [ ] **Step 4: 占位首页 `src/pages/index.astro`**

```astro
---
// 占位:Task 7 重写为 Zendesk home 复刻
---
<html lang="en"><head><meta charset="utf-8" /><title>Longbridge Help Center</title></head>
<body><h1>US Astro scaffold OK</h1></body></html>
```

- [ ] **Step 5: 删除 VitePress 遗留**

```bash
rm -rf apps/us/docs/.vitepress
rm apps/us/docs/en/index.md apps/us/docs/en/graph.md
```

删除前 `rg -l "graph|topic-counts" apps/us --glob '!node_modules'` 确认无其他引用;`apps/us/docs/zh-HK` 是 gitignored 生成物，本地留存与否不影响 git，可顺手 `rm -rf`。

- [ ] **Step 6: 验证构建**

```bash
cd apps/us && bunx astro build && bunx astro preview &
curl -s http://localhost:4321/us/ | grep "scaffold OK"
```

Expected: build 成功，dist/ 生成，占位页可访问 (注意 preview 也走 /us/ base)。验证后杀掉 preview。

- [ ] **Step 7: Commit**

```bash
git add apps/us/package.json apps/us/astro.config.mjs apps/us/tsconfig.json apps/us/src bun.lock
git add -u apps/us/docs
git commit -m "feat(us): replace vitepress shell with astro 7 scaffold"
```

---

### Task 2: 内容层 (collection + 导航构建 + 链接改写)

**Files:**
- Create: `apps/us/src/content.config.ts`、`apps/us/src/lib/nav-core.ts`、`apps/us/src/lib/nav.ts`、`apps/us/src/lib/paths.ts`
- Modify: `apps/us/src/lib/rehype-base-links.mjs`(实现真逻辑)
- Test: `apps/us/test/nav-core.test.ts`、`apps/us/test/rehype-base-links.test.ts`

**Interfaces:**
- Consumes: `apps/us/docs/en/**`(内容契约见 spec §3)。
- Produces(后续所有任务的数据源):
  - `getNav(): Promise<NavCategory[]>`(nav.ts;进程内缓存)
  - `interface NavArticle { slug: string; title: string; path: string; promoted: boolean; position: number; updatedAt: string }`(path 不含 base，如 `/trading-and-investing/crypto-trading/xxx`)
  - `interface NavSection { slug: string; title: string; overviewPath: string; firstArticlePath: string; articles: NavArticle[] }`
  - `interface NavCategory { slug: string; title: string; overviewPath: string; firstArticlePath: string; sections: NavSection[] }`
  - `getPromotedCards(): Promise<Map<string, NavArticle[]>>`(key=category slug，组内 updatedAt 倒序)
  - `withBase(path: string): string`(paths.ts,`/us` 前缀，幂等)
  - `CATEGORY_ORDER: string[]`(nav-core.ts 导出)

- [ ] **Step 1: 写 failing 测试 `test/nav-core.test.ts`**

```ts
import { expect, test } from 'bun:test'
import { orderedMerge, buildNavFromRaw, CATEGORY_ORDER } from '../src/lib/nav-core'

test('orderedMerge: _order.json 优先，幽灵项跳过，多余项按字母序追加', () => {
  expect(orderedMerge(['b', 'a', 'ghost'], ['a', 'b', 'z', 'c'])).toEqual(['b', 'a', 'c', 'z'])
})

test('buildNavFromRaw: 组装树、overview 提供显示名、首篇文章按序解析', () => {
  const nav = buildNavFromRaw(
    [
      { id: 'cat-a/overview', title: 'Category A' },
      { id: 'cat-a/sec-1/overview', title: 'Section One' },
      { id: 'cat-a/sec-1/art-2', title: 'Art 2', promoted: false, position: 2, updatedAt: '2026-01-02' },
      { id: 'cat-a/sec-1/art-1', title: 'Art 1', promoted: true, position: 9, updatedAt: '2026-01-01' },
    ],
    { 'cat-a': ['sec-1'], 'cat-a/sec-1': ['art-1', 'art-2'] },
    ['cat-a'],
  )
  expect(nav).toHaveLength(1)
  expect(nav[0].title).toBe('Category A')
  expect(nav[0].sections[0].title).toBe('Section One')
  expect(nav[0].sections[0].articles.map((a) => a.slug)).toEqual(['art-1', 'art-2'])
  expect(nav[0].firstArticlePath).toBe('/cat-a/sec-1/art-1')
  expect(nav[0].sections[0].overviewPath).toBe('/cat-a/sec-1/overview')
})
```

- [ ] **Step 2: 跑测试确认失败**

`cd apps/us && bun test` — Expected: FAIL(模块不存在)。

- [ ] **Step 3: 实现 `src/lib/nav-core.ts`(纯函数，零 astro 依赖)**

```ts
export interface RawDoc {
  id: string // 'cat/sec/article' | 'cat/overview' | 'cat/sec/overview'
  title: string
  promoted?: boolean
  position?: number
  updatedAt?: string
}
export interface NavArticle { slug: string; title: string; path: string; promoted: boolean; position: number; updatedAt: string }
export interface NavSection { slug: string; title: string; overviewPath: string; firstArticlePath: string; articles: NavArticle[] }
export interface NavCategory { slug: string; title: string; overviewPath: string; firstArticlePath: string; sections: NavSection[] }

// 顶级分类顺序：同旧 NAV_TABS_US(packages/shared/src/config/tabs.config.ts:69-106),写死。
// 实现时对照该文件核对一次顺序。
export const CATEGORY_ORDER = [
  'opening-an-account',
  'trading-and-investing',
  'funding-your-account-withdrawals-and-transfer',
  'account-and-security',
  'longbridge-community',
  'campaigns',
]

export function orderedMerge(order: string[], actual: string[]): string[] {
  const actualSet = new Set(actual)
  const seen = new Set<string>()
  const out: string[] = []
  for (const slug of order) if (actualSet.has(slug) && !seen.has(slug)) { out.push(slug); seen.add(slug) }
  return [...out, ...actual.filter((s) => !seen.has(s)).sort((a, b) => a.localeCompare(b))]
}

const titleCase = (slug: string) => slug.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')

// orders: key 为 'cat' 或 'cat/sec',值为该目录 _order.json 内容
export function buildNavFromRaw(docs: RawDoc[], orders: Record<string, string[]>, categoryOrder: string[] = CATEGORY_ORDER): NavCategory[] {
  const overviewTitle = new Map<string, string>() // 'cat' | 'cat/sec' -> title
  const articles = new Map<string, Map<string, NavArticle[]>>() // cat -> sec -> arts
  for (const d of docs) {
    const seg = d.id.split('/')
    if (seg[seg.length - 1] === 'overview') { overviewTitle.set(seg.slice(0, -1).join('/'), d.title); continue }
    if (seg.length !== 3) continue // 非三级文章 (防御)
    const [cat, sec, slug] = seg
    const bySec = articles.get(cat) ?? new Map()
    const list = bySec.get(sec) ?? []
    list.push({ slug, title: d.title, path: `/${cat}/${sec}/${slug}`, promoted: d.promoted ?? false, position: d.position ?? 0, updatedAt: d.updatedAt ?? '' })
    bySec.set(sec, list); articles.set(cat, bySec)
  }
  const cats: NavCategory[] = []
  for (const cat of orderedMerge(categoryOrder, [...articles.keys()])) {
    const bySec = articles.get(cat)!
    const secSlugs = orderedMerge(orders[cat] ?? [], [...bySec.keys()])
    const sections: NavSection[] = secSlugs.map((sec) => {
      const arts = bySec.get(sec)!
      const ordered = orderedMerge(orders[`${cat}/${sec}`] ?? [], arts.map((a) => a.slug))
        .map((slug) => arts.find((a) => a.slug === slug)!)
      return {
        slug: sec,
        title: overviewTitle.get(`${cat}/${sec}`) ?? titleCase(sec),
        overviewPath: `/${cat}/${sec}/overview`,
        firstArticlePath: ordered[0]?.path ?? `/${cat}/${sec}/overview`,
        articles: ordered,
      }
    }).filter((s) => s.articles.length > 0)
    if (sections.length === 0) continue
    cats.push({
      slug: cat,
      title: overviewTitle.get(cat) ?? titleCase(cat),
      overviewPath: `/${cat}/overview`,
      firstArticlePath: sections[0].firstArticlePath,
      sections,
    })
  }
  return cats
}
```

- [ ] **Step 4: 跑测试确认通过**

`bun test` — Expected: PASS。

- [ ] **Step 5: 写 `src/content.config.ts`**

```ts
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
```

- [ ] **Step 6: 写 `src/lib/nav.ts`(astro 胶水) 与 `src/lib/paths.ts`**

```ts
// paths.ts
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // '/us'
  return path.startsWith(base + '/') || path === base ? path : base + path
}
```

```ts
// nav.ts
import { getCollection } from 'astro:content'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { buildNavFromRaw, type NavCategory, type NavArticle, type RawDoc } from './nav-core'

const DOCS_DIR = new URL('../../docs/en', import.meta.url).pathname
let cache: NavCategory[] | null = null

function loadOrders(): Record<string, string[]> {
  const orders: Record<string, string[]> = {}
  for (const cat of readdirSync(DOCS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const catOrder = join(DOCS_DIR, cat.name, '_order.json')
    if (existsSync(catOrder)) orders[cat.name] = JSON.parse(readFileSync(catOrder, 'utf8'))
    for (const sec of readdirSync(join(DOCS_DIR, cat.name), { withFileTypes: true }).filter((d) => d.isDirectory())) {
      const secOrder = join(DOCS_DIR, cat.name, sec.name, '_order.json')
      if (existsSync(secOrder)) orders[`${cat.name}/${sec.name}`] = JSON.parse(readFileSync(secOrder, 'utf8'))
    }
  }
  return orders
}

export async function getNav(): Promise<NavCategory[]> {
  if (cache) return cache
  const entries = await getCollection('docs')
  const raw: RawDoc[] = entries.map((e) => ({
    id: e.id, title: e.data.title, promoted: e.data.promoted,
    position: e.data.position, updatedAt: e.data.zendesk_updated_at,
  }))
  cache = buildNavFromRaw(raw, loadOrders())
  return cache
}

export async function getPromotedCards(): Promise<Map<string, NavArticle[]>> {
  const nav = await getNav()
  const out = new Map<string, NavArticle[]>()
  for (const cat of nav) {
    const promoted = cat.sections.flatMap((s) => s.articles).filter((a) => a.promoted)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    if (promoted.length) out.set(cat.slug, promoted)
  }
  return out
}
```

- [ ] **Step 7: 实现 rehype 链接改写 + 测试**

`test/rehype-base-links.test.ts`(手写 hast 递归，不引 unist-util-visit 依赖):

```ts
import { expect, test } from 'bun:test'
import { rehypeBaseLinks } from '../src/lib/rehype-base-links.mjs'

const run = (href: string) => {
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'a', properties: { href }, children: [] }] }
  rehypeBaseLinks()(tree)
  return (tree.children[0] as any).properties.href
}

test('根相对内链加 /us 前缀', () => expect(run('/trading-and-investing/a/b')).toBe('/us/trading-and-investing/a/b'))
test('已带 /us 幂等', () => expect(run('/us/x')).toBe('/us/x'))
test('绝对外链不动', () => expect(run('https://longbridgeus.zendesk.com/x')).toBe('https://longbridgeus.zendesk.com/x'))
test('协议相对不动', () => expect(run('//cdn.example.com/x')).toBe('//cdn.example.com/x'))
```

实现 (替换 Task 1 占位):

```js
const BASE = '/us'
export function rehypeBaseLinks() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
        && href !== BASE && !href.startsWith(BASE + '/')) {
        node.properties.href = BASE + href
      }
    }
    for (const child of node.children ?? []) walk(child)
  }
  return (tree) => walk(tree)
}
```

- [ ] **Step 8: 全部测试通过 + 构建冒烟**

```bash
cd apps/us && bun test && bunx astro build
```

Expected: 测试 PASS;build 通过 (collection 装载全部内容不报 schema 错——如报错，把报错字段调 optional 并核对 spec §3.2)。

- [ ] **Step 9: Commit**

```bash
git add apps/us/src apps/us/test
git commit -m "feat(us): content collection, nav builder and base-link rewrite"
```

---

### Task 3: 设计 token / 全局样式 / 明暗主题引导

**Files:**
- Create: `apps/us/src/styles/tokens.css`、`apps/us/src/styles/base.css`、`apps/us/src/scripts/theme-mode.js`

**Interfaces:**
- Produces: 全站 CSS 变量 (spec §5 全表);`window.lbGetThemeMode()` / `window.lbSetThemeMode(mode, persist?)` / `window.changeTheme('light-theme'|'dark-theme')`;`lb:theme-change` CustomEvent;`html[theme]` + `html.theme-light/.theme-dark` 钩子。Task 4 的 BaseLayout 引入这三个文件。

- [ ] **Step 1: 写 `tokens.css`**

按 spec §5.1/§5.2 完整写入：`:root` 亮色块、`html[theme="dark"], .theme-dark` 暗色块、`@media (prefers-color-scheme: dark)` 下 `html:not([theme="light"]):not(.theme-light)` 的系统跟随块 (内容与暗色块相同，用 CSS 变量重复定义，勿用 `var()` 互指)。**逐值对照 spec，不要发明新值。**

- [ ] **Step 2: 写 `base.css`**

内容：`@font-face` SF Pro Display + Source Han Sans CN(**从 `/Users/tangyu/Downloads/Longbridge_us/style.css:8817-8824` 逐字拷贝 URL 与 weight**);`* { box-sizing: border-box }`;body 重置 (margin 0、`font-family: var(--lb-font-sans)`、15px/1.5、`background: var(--background)`、`color: var(--foreground)`);h1-h4 字号 (32/22/18/16,h3 600);链接默认色 teal;`.visibility-hidden`、`.skip-navigation` 工具类 (对照 style.css 原实现);`html { scroll-behavior: smooth }` 不加 (TOC 用 JS 平滑滚动)。

- [ ] **Step 3: 写 `theme-mode.js`(BaseLayout 中以 `is:inline` 注入 head，防 FOUC)**

完整移植 document_head.hbs:51-131 的逻辑，插入 localStorage 层 (spec §8.1):

```js
;(function () {
  var d = document.documentElement
  var KEY = 'lb-theme-mode'
  function fromQuery() {
    try { var m = new URLSearchParams(location.search).get('theme'); return m === 'dark' || m === 'light' ? m : null } catch (e) { return null }
  }
  function fromUA() {
    var m = navigator.userAgent.match(/lbtheme\/(dark|light)/i)
    return m ? m[1].toLowerCase() : null
  }
  function fromStore() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null } catch (e) { return null }
  }
  function fromSystem() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : null
  }
  var overridden = !!(fromQuery() || fromUA())
  function resolve() { return fromQuery() || fromUA() || fromStore() || fromSystem() || 'light' }
  function apply(mode) {
    d.setAttribute('theme', mode)
    d.classList.remove('theme-light', 'theme-dark')
    d.classList.add('theme-' + mode)
    var syncBody = function () { if (document.body) document.body.setAttribute('theme', mode) }
    document.body ? syncBody() : document.addEventListener('DOMContentLoaded', syncBody)
    try { document.dispatchEvent(new CustomEvent('lb:theme-change', { detail: { mode: mode } })) } catch (e) {}
  }
  apply(resolve())
  window.lbGetThemeMode = function () { return d.getAttribute('theme') || 'light' }
  window.lbSetThemeMode = function (mode, persist) {
    if (mode !== 'dark' && mode !== 'light') return
    if (persist !== false) { try { localStorage.setItem(KEY, mode) } catch (e) {} }
    apply(mode)
  }
  window.changeTheme = function (name) { window.lbSetThemeMode(name === 'dark-theme' ? 'dark' : 'light', false) }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)')
    var onChange = function () { if (!overridden && !fromStore()) apply(resolve()) }
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
  }
  // Whale App 检测 (spec §8.4)
  if (/lbcommitid/i.test(navigator.userAgent)) d.classList.add('is-whale-app')
})()
```

- [ ] **Step 4: 验证**

暂无消费方 (Task 4 接线后浏览器验证);本步仅 `cd apps/us && bunx astro build` 冒烟。

- [ ] **Step 5: Commit**

```bash
git add apps/us/src/styles apps/us/src/scripts/theme-mode.js
git commit -m "feat(us): design tokens, base styles and theme-mode bootstrap"
```

---

### Task 4: BaseLayout + Header(mega 菜单/三保留功能)+ Footer

**Files:**
- Create: `apps/us/src/layouts/BaseLayout.astro`、`apps/us/src/components/Header.astro`、`apps/us/src/components/Footer.astro`、`apps/us/src/styles/header.css`、`apps/us/src/styles/footer.css`、`apps/us/src/scripts/header.ts`
- Create: `apps/us/public/assets/footer-logo.png`(下载)

**Interfaces:**
- Consumes: `getNav()`、`withBase()`(Task 2);tokens/base/theme-mode(Task 3)。
- Produces: `BaseLayout` props `{ title: string; description?: string; isHome?: boolean }`;渲染 head(charset/viewport/favicon/title/styles/theme-mode inline)+ Header + `<slot />` + Footer(**文章页例外**:ArticleLayout 自带 footer 于 grid 内，通过 `hideFooter` prop 控制，见 Task 8;故 props 增加 `hideFooter?: boolean`)。Header 内含 `#lb-search-modal` 触发按钮 (`.lb-header-search-btn`) 与分类抽屉触发 (`[data-lb-cat-drawer-open]`),真实弹窗/抽屉分别在 Task 6/5 挂进 BaseLayout。

- [ ] **Step 1: 下载 footer logo**

```bash
curl -fL -o apps/us/public/assets/footer-logo.png "https://longbridgeus.zendesk.com/hc/theming_assets/01KXJ51VKFDV2EHRRH6SCTPQES"
```

若 403(Cloudflare),回退：`cp /Users/tangyu/Downloads/Longbridge_us/settings/logo.png apps/us/public/assets/footer-logo.png`,并在 PR 描述记录该替换。favicon 沿用旧配置远程 URL `https://assets.wbrks.com/assets/logo/logo1.png`;header logo 用 lbkrs 远程 URL(style.css:5972 与 9030 两个变体，亮 hero 态用 logo_light)。

- [ ] **Step 2: 写 `BaseLayout.astro`**

head 内：`<meta charset>`、viewport(`viewport-fit=cover`;`is-whale-app` 禁缩放逻辑由 theme-mode.js 检测后无须单独 meta 变体，保持单一 viewport 即可)、favicon、`<title>{title} – Longbridge Help Center</title>`(首页只 "Longbridge Help Center")、`import '../styles/tokens.css'` 等样式、`<script is:inline>` 内嵌 theme-mode.js 源码 (用 `import themeMode from '../scripts/theme-mode.js?raw'` + `<script is:inline set:html={themeMode} />`)。body:`<a class="skip-navigation" href="#main-content">`、`<Header isHome={isHome} />`、`<slot />`、`{!hideFooter && <Footer isHome={isHome} />}`。

- [ ] **Step 3: 写 `Header.astro` 结构**

对照 spec §6.1 与 `header.hbs:29-148`:logo 链接 (`withBase('/')`);桌面 `.lb-topnav`:Home 链接、All Topics dropdown(`data-lb-dropdown`,`.lb-topnav__menu[hidden]` 内**构建期直接渲染** mega 内容：左列每分类一项 (图标 + 名称 + 文章数),右面板每分类一块 (section 分组的文章预览 + "View all"→`withBase(cat.firstArticlePath)`);图标用 Task 7 的 `iconForCategory`,本任务先内联 8 个分类图标 SVG，对照 header.hbs:381-401 拷贝)、`.lb-header-search-btn`;右侧:region 弹层 (HK/SG/US)、theme toggle(Sun/Moon 两个 SVG,`v-show` 等价用 CSS `html.theme-dark .icon-sun{display:none}` 方式)、GitHub 图标外链。移动：`.lb-header-search-btn` + 汉堡 `[data-lb-cat-drawer-open]`。**不渲染**:Ask AI、登录、community(spec §9)。

- [ ] **Step 4: 写 `header.ts`(交互 I1/I2/I11/I12 + theme toggle)**

对照移植：
- I1 滚动过渡 (script.js:1023-1065):首页检测 `.hero` 存在 → header 加 `.header--transparent`;scroll(rAF 节流)>60px 时 header 与 `<html>` 加 `.is-scrolled`,反之移除。
- I2 mega 开合 (script.js:1067-1253 的交互部分，数据已构建期化):toggle 点击开合;桌面 hover 打开、离开 200ms 延时关闭;左列 item hover/focus 切右面板 `.is-active`;ESC/外点关闭;`aria-expanded` 同步。
- I11 region 切换：弹层开合;点击 region:同 region 只关菜单;否则 `document.cookie = 'region=' + code + ';path=/;max-age=31536000;SameSite=Lax'` 后 `window.location.assign('/' + code + '/')`。
- theme toggle:点击 `window.lbSetThemeMode(window.lbGetThemeMode() === 'dark' ? 'light' : 'dark')`。
- I12 移动菜单 aria toggle + ESC。

脚本在 Header.astro 尾部 `<script>`(Astro 打包，非 inline) 引入。

- [ ] **Step 5: 写 `Footer.astro` + 样式**

文案**逐字拷贝** `footer.hbs:1-18`(tagline/meta/两段 disclaimer 含 BrokerCheck 链接);logo 用 `withBase('/assets/footer-logo.png')`;样式对照 spec §6.8(首页 `--lb-footer-bg` 变体用 `isHome` prop 加 class)。

- [ ] **Step 6: 浏览器验证**

```bash
cd apps/us && bunx astro dev
```

真实浏览器打开 `http://localhost:4321/us/`:header 三态类切换 (占位首页无 hero，验证白底态即可，透明态留 Task 7 复验)、mega 打开有全部 6 分类与文章、region 弹层出现 (点击跳 /hk/ 会 404 属预期)、明暗 toggle 生效且刷新记忆、GitHub 新窗打开、footer 文案与线上一致。

- [ ] **Step 7: Commit**

```bash
git add apps/us/src/layouts apps/us/src/components apps/us/src/styles/header.css apps/us/src/styles/footer.css apps/us/src/scripts/header.ts apps/us/public
git commit -m "feat(us): base layout, header with mega menu/region/theme/github, footer"
```

---

### Task 5: side-tree 组件 + 移动分类抽屉

**Files:**
- Create: `apps/us/src/components/SideTree.astro`、`apps/us/src/components/CatDrawer.astro`、`apps/us/src/styles/side-tree.css`、`apps/us/src/scripts/drawer.ts`、`apps/us/src/scripts/side-tree.ts`
- Modify: `apps/us/src/layouts/BaseLayout.astro`(挂 CatDrawer)

**Interfaces:**
- Consumes: `getNav()`、`withBase()`。
- Produces: `<SideTree nav={nav} currentPath={string} />`(构建期渲染全树：当前文章 `.is-current` + `aria-current="page"`;当前文章所在 section 沿 parent 链的分类/子节点 `.is-open`;分类头链接→`firstArticlePath`);CatDrawer(`#lb-cat-drawer`,含 SideTree,`currentPath` 传当前页)。

- [ ] **Step 1: 写 SideTree 结构与样式**

对照 `header.hbs:403-512`(结构) 与 spec §6.4(样式):`.side-tree__cat`(head:图标 24 + label 16/600 + chevron;body 收纳 sections)> `.side-tree__sec`(head 缩进 44;body 文章列表)> `.side-tree__item`(14px,`--muted-foreground`,hover 灰底;current teal + `rgba(0,184,184,.12)` 底 + 600;暗色 current `#22e5cf`)。分类图标对照 header.hbs:381-401 的 `CAT_ICONS` 8 个 SVG 逐字拷贝为 `src/lib/cat-icons.ts` 导出 (供 Header/SideTree/Task 7 复用;若 Task 4 已内联，重构集中到本文件)。折叠态 chevron `-90°`。

- [ ] **Step 2: 写 `side-tree.ts`(I6)**

分类/sec head 点击 toggle `.is-open`;初始化后 `querySelector('.is-current')?.scrollIntoView({ block: 'center' })`(仅容器内滚动：侧栏容器 `overflow-y:auto`,用 `scrollTop` 计算避免整页跳动——对照 header.hbs:506-511 的实现方式)。

- [ ] **Step 3: 写 CatDrawer + `drawer.ts`(I5)**

结构对照 `header.hbs:334-345`:backdrop + 右滑面板 (header "Help Center" + 关闭钮 + SideTree)。交互对照 script.js:1277-1310, 1456-1485:委托点击 `[data-lb-cat-drawer-open]` 开 / `[data-lb-cat-drawer-close]`、backdrop 关;`html.lb-drawer-open` 锁滚动;ESC 关;抽屉内链接点击 (捕获阶段) 先关再导航;`pageshow`(persisted) 时复位。

- [ ] **Step 4: 浏览器验证**

dev server 下移动视口 (<900px):汉堡开抽屉、树可折叠、ESC/backdrop/链接点击均关闭、无横向滚动条。

- [ ] **Step 5: Commit**

```bash
git add apps/us/src
git commit -m "feat(us): build-time side-tree and mobile category drawer"
```

---

### Task 6: 搜索弹窗 + Pagefind

**Files:**
- Create: `apps/us/src/components/SearchModal.astro`、`apps/us/src/styles/search.css`、`apps/us/src/scripts/search.ts`
- Modify: `apps/us/src/layouts/BaseLayout.astro`(挂 SearchModal)

**Interfaces:**
- Consumes: Task 4 的 `.lb-header-search-btn`;Task 7 将复用 opener(hero 输入 focus、hot-tag)。
- Produces: 全局搜索弹窗;opener 约定：任何带 `.lb-search-modal-trigger` 或 `.lb-header-search-btn` 的元素点击即开;`window.lbOpenSearch(seed?: string)` 供 hero/hot-tag 调用;URL `?q=` 落地自动打开。

- [ ] **Step 1: 结构与样式**

对照 `header.hbs:151-163` 与 spec §6.7:`#lb-search-modal[hidden]` > backdrop + panel(radius 16、阴影 `0 24px 64px rgba(0,0,0,.24)`;head:放大镜 SVG + `#lb-search-input` + 关闭钮;body `#lb-search-results`)。

- [ ] **Step 2: 写 `search.ts`(I4 全量移植 header.hbs:164-328，数据层换 Pagefind)**

要点：
- `openModal(seed)`:去 hidden、`html.lb-search-open` 锁滚动、input focus、seed 有值立即检索;`closeModal` 反向。
- openers:委托点击 `.lb-header-search-btn, .lb-search-modal-trigger`;`window.lbOpenSearch = openModal`;`⌘/Ctrl+K` preventDefault 后开;`new URLSearchParams(location.search).get('q')` 有值自动开;ESC/backdrop/`[data-close]` 关。
- 检索:input 250ms debounce → `run(q)`;Pagefind 懒加载：

```ts
let pagefind: any = null
async function ensurePagefind() {
  if (pagefind) return pagefind
  try {
    pagefind = await import(/* @vite-ignore */ import.meta.env.BASE_URL + 'pagefind/pagefind.js')
    await pagefind.init()
  } catch { pagefind = null } // dev server 无索引
  return pagefind
}
async function run(q: string) {
  const pf = await ensurePagefind()
  if (!pf) { renderHint() ; return } // "Search index is built at build time — run astro preview"
  const search = await pf.debouncedSearch(q)
  if (!search) return
  const items = await Promise.all(search.results.slice(0, 10).map((r: any) => r.data()))
  renderResults(q, items) // item.url / item.meta.title / item.excerpt(已含 <mark>)
}
```

- 结果渲染：标题 + 摘要，query 词 `<mark>` 高亮 (Pagefind excerpt 自带 mark;标题用自实现 `highlight(text, q)`,先 HTML 转义再包 mark——对照 header.hbs:179-183 的 strip+mark 做法)。
- 最近搜索:localStorage `lb_search_history_v1`,MRU 10 去重;空 query 渲染历史 (时钟图标 + 单条删除 + Clear);点击结果时 (捕获阶段) 把当前 query 写入历史。

- [ ] **Step 3: 验证 (必须用 preview,dev 无索引)**

```bash
cd apps/us && bunx astro build && bunx astro preview
```

浏览器 `/us/`:⌘K 开弹窗、输入 "fees" 有结果且高亮、点击结果跳文章、历史记录出现且可删、`/us/?q=crypto` 自动开并出结果。dev server 下确认降级提示不报错。

- [ ] **Step 4: Commit**

```bash
git add apps/us/src
git commit -m "feat(us): zendesk-style search modal backed by pagefind"
```

---

### Task 7: 首页 (hero + catx)

**Files:**
- Create: `apps/us/src/styles/home.css`、`apps/us/src/scripts/catx.ts`、`apps/us/src/lib/catx-icons.ts`
- Modify: `apps/us/src/pages/index.astro`(替换占位)

**Interfaces:**
- Consumes: `getPromotedCards()`、`getNav()`、`window.lbOpenSearch`、BaseLayout(`isHome:true`)。
- Produces: `/us/` 首页。

- [ ] **Step 1: hero 区**

对照 spec §6.2 与 `home_page.hbs:1-22`:结构照抄 (类名保持 `.hero.hero--dark` 以便 CSS 对照，即使视觉是亮薄荷);底色 `#C2FFF7`;`.hero-bg` 用 lbkrs 远程 `hero-bg3.png`(桌面 `background: url(...) no-repeat calc(50% + 235px) -64px / 815px auto`)、`::after` sun.png 光晕、`::before` 顶部渐变 (三条 URL/regola 对照 style.css:8996-9018 拷贝);标题/副标题/hot-tag 文案与 5 个词照抄;搜索输入：白底圆角 input(placeholder "Find your answer"),**focus 即 `window.lbOpenSearch(input.value)` 并 blur**;hot-tag 点击 `lbOpenSearch(tag 文本)`(不再跳 search URL);hero-hot-tag 样式按 spec(teal 实心 36 高)。标题 h 层级对照 home_page.hbs:1-9(SEO 隐藏 h1 + 可见 h1)。

- [ ] **Step 2: catx 构建期渲染**

`index.astro` frontmatter 取 `getPromotedCards()` + `getNav()`(tab 顺序 = CATEGORY_ORDER 中有 promoted 卡的分类;tab 显示名 = category title;另加第一个 "All" tab?——**对照线上行为**:home_page.hbs 的 buildTabs 只按有卡分类建 tab、无 All，照此实现)。渲染:tab 行 (`.catx__tab` + `data-cat`)+ 全量卡片 `.catx__cell[data-cat]`(结构 `[icon][title+sub][arrow]`,sub= section 名)。图标启发式：把 `home_page.hbs:89-170` 的 `ICONS`(22 个 SVG)、`SECTION_RULES`、`CATEGORY_RULES`、`iconFor()` **逐字移植**为 `catx-icons.ts` 构建期函数 (输入 section 名/分类名，输出 SVG 字符串;含同分类内去重逻辑)。

- [ ] **Step 3: 写 `catx.ts`(I3 客户端行为)**

对照 home_page.hbs:348-433 与 script.js:1431-1453:tab 点击切 `.is-active` + 过滤 `data-cat` 匹配的 cell + 重触发 `.catx__fade` 动画 + tab 滚动居中;每 tab 下最多显示 12 张，超出的进 `.catx__expand` 手风琴，`.catx__expand-toggle` 显示 "Show N more"/"Collapse" 切 `.is-expanded`;tabs 容器横向滚动时两侧 `--fade-l/--fade-r` 24px mask 渐隐 (scroll passive + resize)。active tab 底部 teal 药丸用 CSS `::after`(spec §6.3,**不做 underline 元素**)。

- [ ] **Step 4: 浏览器验证**

build+preview:hero 视觉对照线上首页 (亮薄荷底、右侧插画、光晕);tab 切换动画、12 上限 + Show more、边缘渐隐;hero 输入 focus 开搜索弹窗、hot-tag 带词开弹窗;首页 header 透明态→滚动白底态 (补验 Task 4 的 I1)。

- [ ] **Step 5: Commit**

```bash
git add apps/us/src
git commit -m "feat(us): home page with mint hero and build-time catx module"
```

---

### Task 8: 文章页 (路由 + 布局 + 正文排版 + 尾部区块)

**Files:**
- Create: `apps/us/src/pages/[...slug].astro`、`apps/us/src/layouts/ArticleLayout.astro`、`apps/us/src/styles/article.css`、`apps/us/src/scripts/article.ts`
- Create(占位，Task 10 实现): `apps/us/src/layouts/CategoryOverview.astro`、`apps/us/src/layouts/SectionOverview.astro`

**Interfaces:**
- Consumes: collection 条目 (`render()` 出 `<Content/>`)、`getNav()`、SideTree、BaseLayout(`hideFooter:true`)。
- Produces: 所有 `/us/{...}` 内容路由;`[...slug].astro` 按 entry.id 判型分发：`{cat}/overview`→CategoryOverview、`{cat}/{sec}/overview`→SectionOverview、其余→ArticleLayout。占位 overview 布局本任务先渲染 `<h1>{title}</h1>` 保 build 通过。

- [ ] **Step 1: 动态路由**

```astro
---
// src/pages/[...slug].astro
import { getCollection, render } from 'astro:content'
import ArticleLayout from '../layouts/ArticleLayout.astro'
import CategoryOverview from '../layouts/CategoryOverview.astro'
import SectionOverview from '../layouts/SectionOverview.astro'

export async function getStaticPaths() {
  const entries = await getCollection('docs')
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }))
}
const { entry } = Astro.props
const seg = entry.id.split('/')
const kind = seg.at(-1) === 'overview' ? (seg.length === 2 ? 'category' : 'section') : 'article'
const { Content } = await render(entry)
---
{kind === 'article' && <ArticleLayout entry={entry}><Content /></ArticleLayout>}
{kind === 'category' && <CategoryOverview entry={entry}><Content /></CategoryOverview>}
{kind === 'section' && <SectionOverview entry={entry}><Content /></SectionOverview>}
```

- [ ] **Step 2: ArticleLayout 结构**

对照 `article_page.hbs` 与 spec §6.4。桌面 grid `272px 1fr; column-gap:32px`,`grid-row` 让 aside 纵跨正文+footer(footer **构建期直接渲染进容器**,BaseLayout 传 `hideFooter`,容器末尾 `<Footer/>`)。左 `<aside>` = `<SideTree nav currentPath={'/'+entry.id} />`(sticky top 56)。右 `<article id="main-content">`:面包屑 (Home→`withBase('/')`;分类→`cat.firstArticlePath`;section→`sec.firstArticlePath`;末项当前标题，13px 灰、`>` 分隔、中间项可省略号收缩)→ `<h1 class="article-title">`(40px)→ `.article-body` 包 `<slot/>` → 尾部：
- 投票条：结构对照 article_page.hbs:79-110("Was this article helpful?" + Yes/No 钮);行为 (article.ts):点击写 localStorage `lb_article_vote_{zendesk_article_id}`,选中态高亮，**不显示票数**(spec §9)。
- related:构建期同 section 相邻文章 ≤4(按 `_order.json` 序，排除自身)。
- recently viewed:`<div data-recent-articles>` 占位，article.ts 从 localStorage `lb_recent_articles_v1` 渲染 (本页进入时把 `{path,title}` unshift 进列表，去重留 6)。
- "Edit this page on GitHub" → `https://github.com/longbridge/docs/edit/main/apps/us/docs/en/{entry.id}.md`。

- [ ] **Step 3: `article.css` 正文排版**

逐条对照 spec §6.4:body 1.7;h2/h3/h4 margin(首个归零);ul/ol `margin:8px 0 20px 20px`、disc;table:`figure.wysiwyg-table{width:max-content;max-width:100%}` + 单元格 `border:1px solid var(--border)` + thead `background:var(--muted)` + 偶数行微灰;img `max-width:100%;height:auto`(暗色 `filter:brightness(.9)`);code/pre `var(--muted)` 底 + radius 3;blockquote `var(--muted)` 底 + 左 3px teal;a teal 系。移动端 (≤900) 单栏、aside 隐藏 (TOC FAB 接管，Task 9)。

- [ ] **Step 4: `article.ts`**

投票 + recently-viewed(上述)+ **I9 表格清洗**:`document.querySelectorAll('.article-body figure.wysiwyg-table, .article-body table').forEach(el => { el.style.width = '' })`(对照 script.js:959-966，去内联 width 让 CSS 生效)。

- [ ] **Step 5: 验证**

build+preview 抽查 3 页：
1. `/us/trading-and-investing/trading-basics/longbridge-securities-llc-fees-charges` — **raw HTML 表格正常渲染**(spec 风险 #3)、表格可横向滚动不破版。
2. 任一 promoted 文章 — side-tree 定位高亮 + 展开链正确、面包屑中间项直链首篇文章。
3. 任意文章 — 投票记忆、recently viewed 跨页累积、edit 链接指向正确 GitHub 路径、内链带 /us/ 前缀可点通。

- [ ] **Step 6: Commit**

```bash
git add apps/us/src
git commit -m "feat(us): article route and layout with side-tree, votes and github edit link"
```

---

### Task 9: 文章 TOC(桌面右栏 + 移动 FAB/抽屉)

**Files:**
- Create: `apps/us/src/scripts/toc.ts`、`apps/us/src/scripts/toc-drawer.ts`、`apps/us/src/styles/toc.css`
- Modify: `apps/us/src/layouts/ArticleLayout.astro`(挂脚本 + FAB/抽屉标记)

**Interfaces:**
- Consumes: 渲染后的 `.article-body` DOM、`getNav()`(抽屉树构建期渲染)。
- Produces: 桌面 `.lb-toc` 目录、`html.lb-has-toc`(容器加宽 1396，写进 article.css 或 toc.css);移动 `#toc-fab` + `#toc-drawer`。

- [ ] **Step 1: `toc.ts`(I7，逐行对照 script.js:1348-1429 移植)**

必须包含：
- 伪标题启发式 `isPseudoHeading(el)`:无块级子元素、文本 ≤120 字、(`span.wysiwyg-font-size-large/x-large/xx-large` 或 整段恰为单个 `<strong>/<b>`)。
- 收集 `.article-body` h1-h4 + 伪标题;<2 个不渲染;无 id 者 slug 化生成 (小写连字符、重名加 `-n`);`minLevel` 归一，深度写 `--toc-depth` + `.lb-toc__item--sub`。
- 构建 `<nav class="lb-toc">`(title "On this page")append 到 body。
- 点击：平滑滚动 (scrollMarginTop = header 高 + 20)+ `history.replaceState` hash。
- `position()`:右侧空间 `innerWidth - article.getBoundingClientRect().right`;<210 或 `html.is-whale-app` 隐藏并移除 `.lb-has-toc`;否则 `left = article.right + 32`、`width = min(240, space - 48)`、`html.lb-has-toc`。
- `spy()`:`pageYOffset + 130` 标记线，最后一个越线者 `.is-active`。
- 监听：`resize`→position、`scroll`(passive)→spy、`load`→position、`setTimeout(position, 400)`。

样式对照 spec §6.5(fixed top 96、title 11.5 大写、item 13、active teal + 左 2px teal 边、sub 缩进 29)。

- [ ] **Step 2: 移动 FAB + 抽屉 (I8)**

标记对照 `article_page.hbs:265-293`(FAB 列表图标;抽屉:backdrop + 底部面板：分类链接头 + 树)。**树构建期渲染**(当前分类展开、当前 section 展开、当前文章 `.is-current`) 替代原运行时 API 重建。`toc-drawer.ts` 对照 article_page.hbs:298-328, 448-528:开合 (`.is-open`、220ms 后 hidden、锁 body 滚动、ESC/backdrop 关)+ FAB pointer 拖拽 (6px 阈值分辨 tap/drag、松手水平贴边吸附、localStorage `lb_toc_fab` 记忆、resize 重夹、拖后阻止 click)。

- [ ] **Step 3: 验证**

preview 桌面宽窗：长文章 (fees-charges)TOC 出现、容器加宽、滚动高亮跟随、点击平滑滚动带 hash;窄窗 (<210px 右侧空间)TOC 消失;移动视口:FAB 可拖拽吸附且刷新记忆位置、抽屉树当前项高亮。找一篇含 Lark 粘贴伪标题的文章验证启发式 (在 `apps/us/docs/en` 里 `rg -l 'wysiwyg-font-size-large|^\*\*[^*]+\*\*$'` 抽一篇)。

- [ ] **Step 4: Commit**

```bash
git add apps/us/src
git commit -m "feat(us): article toc rail with scroll spy and mobile toc drawer"
```

---

### Task 10: 分类/小节 overview 页

**Files:**
- Modify: `apps/us/src/layouts/CategoryOverview.astro`、`apps/us/src/layouts/SectionOverview.astro`(替换 Task 8 占位)
- Create: `apps/us/src/styles/listing.css`

**Interfaces:**
- Consumes: `getNav()`(该分类/小节的 section/article 列表;**忽略 overview.md 正文的 markdown 链接列表**,构建期数据更可靠，`<Content/>` 不渲染)。
- Produces: `/us/{cat}/overview`、`/us/{cat}/{sec}/overview` 页面。

- [ ] **Step 1: CategoryOverview**

对照 `category_page.hbs` 与 spec §6.6:面包屑 (Home > 当前分类名，末项不链)+ page-header h1 + section-tree(桌面两列 `flex:0 0 45%`):每 section `h2` 链接 (→ `sec.firstArticlePath`,按导航约定)+ `.article-list`(promoted 星标 SVG 前置，对照 style.css:1613 的 `.icon-star` teal 星;行 16px/padding 15px 0)。

- [ ] **Step 2: SectionOverview**

对照 `section_page.hbs`:面包屑 (Home > 分类 (→firstArticlePath)> 当前 section 名)+ h1 + `.article-list` 全量文章。子小节列表结构 (section_page.hbs:19-32) 保留样式但当前数据无嵌套 section，数据为空时不渲染。

- [ ] **Step 3: 验证 + Commit**

preview 抽查 `/us/trading-and-investing/overview` 与任一 section overview:两列布局、星标、链接全部可点通且遵守"入口直链首篇文章"约定。

```bash
git add apps/us/src
git commit -m "feat(us): category and section overview pages"
```

---

### Task 11: 404 + Whale 最小适配 + 收尾样式

**Files:**
- Create: `apps/us/src/pages/404.astro`、`apps/us/src/styles/whale.css`

**Interfaces:**
- Consumes: BaseLayout。
- Produces: `/us/404.html`;`.is-whale-app` 作用域样式。

- [ ] **Step 1: 404 页**

BaseLayout 包一个居中简版 (对照 error_page.hbs 的文案结构：标题 + "back to Help Center" 链接→`withBase('/')`),不追求像素级。

- [ ] **Step 2: whale.css(spec §8.4)**

```css
html.is-whale-app .header,
html.is-whale-app .lb-toc { display: none !important; }
@media (hover: hover) { /* 站内所有 hover 效果统一写在 hover: hover 内，App 内 WebView 自然失效 */ }
```

回查前面任务的 CSS，把 hover 规则统一收进 `@media (hover: hover)`(替代原主题的 CSSOM 剥离方案 script.js:1313-1346)。

- [ ] **Step 3: 验证 + Commit**

preview 访问不存在路径出 404;UA 模拟含 `lbcommitid` 时 header 隐藏。

```bash
git add apps/us/src
git commit -m "feat(us): 404 page and minimal whale-app scoping"
```

---

### Task 12: CI 与文档更新 + 三站回归

**Files:**
- Modify: `.github/workflows/deploy.yml`(us 产物路径)、`README.md`(us 段落)

- [ ] **Step 1: deploy.yml**

把 us 拷贝行的源路径 `apps/us/docs/.vitepress/dist` 改为 `apps/us/dist`(对照 deploy.yml:36-38 找到 us 那行，只动这一处)。

- [ ] **Step 2: README**

更新仓库结构图中 us 行 (VitePress → Astro)、"已知限制"如有变化、补一句 US 搜索索引由 Pagefind 在 build 时生成。

- [ ] **Step 3: 三站回归**

```bash
bun run build:hk && bun run build:sg && bun run build:us
```

Expected: 三个 build 全部通过;`ls apps/us/dist/index.html apps/us/dist/pagefind` 存在。

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci(us): point deploy artifact to astro dist and update docs"
```

---

### Task 13: E2E 视觉/交互对照验收 (vs 线上 Zendesk)

**Files:** 无代码;产出验收报告 `specs/us-astro-migration/acceptance-report.md`。

- [ ] **Step 1: 环境**

`bun run build:us && cd apps/us && bunx astro preview`;真实浏览器 (chrome-devtools MCP 或 Playwright;**WebFetch 会被 Cloudflare 403，不可用**) 双开 `http://localhost:4321/us/` 与 `https://longbridgeus.zendesk.com/hc/en-us`。

- [ ] **Step 2: 逐页视觉对照 (桌面 1440 + 移动 390 两档，亮/暗两主题)**

首页 / 一篇长文章 (fees-charges)/ 一篇 promoted 文章 / 分类 overview / 小节 overview，截图并排比对：布局、间距、字号、颜色、hero 插画位、卡片 hover。**允许差异**:spec §9 列出的有意偏差;文章集合差异 (线上含未同步草稿变化)。

- [ ] **Step 3: 交互清单逐项打勾 (spec §7 I1–I12)**

每项记录 通过/偏差/失败 与截图。重点：搜索弹窗全交互链、catx tab+Show more、TOC spy+ 伪标题、FAB 拖拽、抽屉、明暗切换记忆、region 跳转 (检查 cookie 写入 + 跳 `/hk/`,404 属 dev/preview 预期，记录即可)、GitHub 两个入口。

- [ ] **Step 4: 写验收报告并 Commit**

报告分：已验证通过 / 有意偏差 (引 spec §9)/ 发现问题 (回修对应 Task)/ 环境阻塞未验证。

```bash
git add specs/us-astro-migration/acceptance-report.md
git commit -m "docs(us): astro migration acceptance report"
```

---

### Task 14: 自动同步 (webhook 准实时 + 定时兜底 + 认证可选化)

> 前置依赖:Task 12 完成 (deploy.yml 已指向 astro dist)。设计见 spec §11。

**Files:**
- Modify: `.github/workflows/deploy.yml`(新增触发器 + concurrency + 两个条件步骤)
- Modify: `apps/us/scripts/zendesk/client.ts`(认证改可选)
- Modify: `apps/us/.env.example`(注明凭据现为可选)
- 人工配置 (非代码，见 Step 5):Zendesk webhook + GitHub fine-grained PAT

**Interfaces:**
- Consumes: `bun run sync:us` 现有行为 (全量覆盖 + prune，产出契约 spec §3)。
- Produces: `repository_dispatch(event_type: zendesk-sync)` 与 `schedule` 触发的自动同步部署链路。

- [ ] **Step 1: client.ts 认证可选化**

读 `apps/us/scripts/zendesk/client.ts:39` 附近现有 Basic Auth 构造与 env 读取/校验逻辑 (含 `fetch-zendesk.ts` 或 `zendesk.config.ts` 里可能存在的"凭据缺失即报错"检查，一并放宽):凭据齐全时行为与现在完全一致;缺失时不带 `Authorization` 头匿名请求，并 `console.warn('[sync] running unauthenticated (no ZENDESK credentials)')`。改法示意：

```ts
const auth = email && token
  ? { Authorization: 'Basic ' + Buffer.from(`${email}/token:${token}`).toString('base64') }
  : {}
```

(以文件实际写法为准，保持原代码风格;429/5xx 重试逻辑不动。)

- [ ] **Step 2: 验证同步器两种模式**

```bash
cd apps/us && bun run sync   # 模式 A:.env.local 凭据在位
mv .env.local /tmp/env.bak && bun run sync && mv /tmp/env.bak .env.local  # 模式 B:匿名
git diff --stat apps/us/docs/en
```

Expected: 两种模式都成功;模式 B 打出 warn;两次运行后 `docs/en` 无内容差异 (匿名与认证看到的已发布集合一致)。

- [ ] **Step 3: 改 deploy.yml**

在现有 workflow 上叠加 (保持现有 push/build/merge/deploy 步骤不动):

```yaml
on:
  push: { branches: [main] }
  workflow_dispatch:
  repository_dispatch:
    types: [zendesk-sync]
  schedule:
    - cron: '17 */6 * * *' # 兜底:每 6 小时，错开整点

concurrency:
  group: deploy
  cancel-in-progress: true

# jobs.<现有 job> 顶部 permissions 增加 contents: write
# checkout 之后、build 之前插入:
      - name: Sync from Zendesk
        if: github.event_name == 'repository_dispatch' || github.event_name == 'schedule'
        run: bun run sync:us
      - name: Commit synced content
        if: github.event_name == 'repository_dispatch' || github.event_name == 'schedule'
        run: |
          git config user.name "zendesk-sync[bot]"
          git config user.email "zendesk-sync[bot]@users.noreply.github.com"
          git add apps/us/docs/en
          git diff --cached --quiet || { git commit -m "chore(us): sync zendesk content" && git push; }
```

注意:sync 步骤不配 Zendesk env(走 Step 1 的匿名路径);`GITHUB_TOKEN` 的 push 不会重触发 workflow，本次 run 继续用新内容 build——这是有意设计，不要"修复"。若未来匿名被 Cloudflare 拦 (表现为 sync 步骤 403/429 失败),在 repo Secrets 配 `ZENDESK_*`(变量名对照 `apps/us/.env.example`) 并给 sync 步骤加 env 块即可恢复。

- [ ] **Step 4: 本地验证 workflow 语法 + dispatch 冒烟**

`bunx yaml-lint` 不在白名单，用 `bunx --bun js-yaml .github/workflows/deploy.yml >/dev/null` 校验语法即可 (或依赖 push 后 Actions 页面的解析结果)。push 分支后用 `gh api repos/{owner}/{repo}/dispatches -f event_type=zendesk-sync` 冒烟需先合 main，故 dispatch 全链路验证放到合并后，记入验收报告的 follow-up。

- [ ] **Step 5: 人工配置清单 (写进 PR 描述，交给有 Zendesk Admin 权限的人)**

1. GitHub:创建 fine-grained PAT——仅 `longbridge/docs` 仓、仅 Contents:write、设过期时间。
2. Zendesk Admin Center → Apps and integrations → Webhooks → Create webhook:订阅 Article published + unpublished(事件名以后台事件目录为准);Endpoint `https://api.github.com/repos/longbridge/docs/dispatches`;POST/JSON;Auth=Bearer(上述 PAT);Body `{"event_type":"zendesk-sync"}`。
3. 点 Test webhook → 确认 Actions 出现一次 `zendesk-sync` 触发的 run，且 3-5 分钟后站点更新。

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml apps/us/scripts/zendesk/client.ts apps/us/.env.example
git commit -m "ci(us): webhook-triggered zendesk sync with scheduled fallback"
```

---

## Self-Review 记录 (计划作者)

- Spec 覆盖:§1–§8 逐条映射到 Task 1–13;§9 偏差在 Task 4/6/8 落地并由 Task 13 复核;§10 风险分别由 Task 2(链接/schema)、8(raw HTML)、12(CI)、13(浏览器验证) 覆盖;§11 自动同步由 Task 14 落地 (webhook 全链路冒烟依赖合并 main，列为验收报告 follow-up)。
- 类型一致性：`NavCategory/NavSection/NavArticle/withBase/getNav/getPromotedCards/lbOpenSearch/lbSetThemeMode` 在定义任务 (2/3/6) 与消费任务 (4/5/7/8/9/10) 间名称一致。
- 已知留白 (有意，非 placeholder):22 个 catx 图标 SVG、8 个分类图标 SVG、@font-face URL、footer 免责声明文案 —— 均为"从源文件 file:line 逐字拷贝"指令，源文件在执行者可读的本地路径。
