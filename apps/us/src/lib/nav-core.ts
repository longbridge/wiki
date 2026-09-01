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
