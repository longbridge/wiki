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
// Verified against tabs.config.ts: categories match exactly in this order.
// 分类展示顺序，对齐 Zendesk 线上 category.position(mega / sidebar 共用)。
export const CATEGORY_ORDER = [
  'ai-related',
  'trading-and-investing',
  'account-and-security',
  'promotions',
  'documents-and-taxes',
  'funding-your-account-withdrawals-and-transfer',
  'opening-an-account',
  'longbridge-community',
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

/** Pure: filter promoted articles per category, sorted by updatedAt DESC (empty string sorts last). */
export function selectPromotedByCategory(nav: NavCategory[]): Map<string, NavArticle[]> {
  const out = new Map<string, NavArticle[]>()
  for (const cat of nav) {
    const promoted = cat.sections
      .flatMap((s) => s.articles)
      .filter((a) => a.promoted)
      .sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return 0
        if (!a.updatedAt) return 1  // empty string sorts last
        if (!b.updatedAt) return -1
        return b.updatedAt.localeCompare(a.updatedAt) // DESC
      })
    if (promoted.length) out.set(cat.slug, promoted)
  }
  return out
}

export interface CatxCard { title: string; path: string; sectionTitle: string }

const CATX_CARD_LIMIT = 12

/**
 * Promoted-preferred card selection per category.
 * Falls back to the first up-to-CATX_CARD_LIMIT articles (in _order.json order
 * as built by buildNavFromRaw) when a category has NO promoted articles — this
 * ensures all 6 categories appear even when zero articles are promoted.
 */
export function selectCatxCards(nav: NavCategory[]): Map<string, CatxCard[]> {
  const out = new Map<string, CatxCard[]>()
  for (const cat of nav) {
    const withSection = cat.sections.flatMap((s) =>
      s.articles.map((a) => ({ article: a, sectionTitle: s.title }))
    )
    const promoted = withSection.filter(({ article }) => article.promoted)
    // Zendesk catx 只显示含 promoted 文章的分类 (promoted-only，无 fallback)。
    // 无 promoted 的分类不出现在 Helpful Topics(仍存在于 mega / 侧栏)。
    if (promoted.length === 0) continue
    const source = promoted.sort((a, b) => {
      if (!a.article.updatedAt && !b.article.updatedAt) return 0
      if (!a.article.updatedAt) return 1
      if (!b.article.updatedAt) return -1
      return b.article.updatedAt.localeCompare(a.article.updatedAt)
    })
    const cards: CatxCard[] = source.slice(0, CATX_CARD_LIMIT).map(({ article, sectionTitle }) => ({
      title: article.title,
      path: article.path,
      sectionTitle,
    }))
    if (cards.length > 0) out.set(cat.slug, cards)
  }
  return out
}
