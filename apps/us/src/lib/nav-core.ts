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

// 分类展示顺序的 fallback:正常由 sync 生成的根 docs/en/_order.json(按 Zendesk category.position)
// 驱动，nav.ts 读它传给 buildNavFromRaw;仅当该文件缺失时用下面写死顺序兜底。无当前 position 的老分类
// (如 opening-an-account) 由 orderedMerge 追加到末尾。
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

export interface CatxCard { title: string; path: string; sectionTitle: string }

const CATX_CARD_LIMIT = 12

/**
 * 每个分类取前 CATX_CARD_LIMIT 篇文章的卡片，顺序 = nav 顺序 (section 拉平，已按
 * Zendesk position + created_at DESC 排好，见 _order.json)。所有分类都出，promoted
 * 不参与 (对齐 Zendesk 原生 mega / 分类展示)。
 */
export function selectCatxCards(nav: NavCategory[]): Map<string, CatxCard[]> {
  const out = new Map<string, CatxCard[]>()
  for (const cat of nav) {
    const cards: CatxCard[] = cat.sections
      .flatMap((s) => s.articles.map((a) => ({ title: a.title, path: a.path, sectionTitle: s.title })))
      .slice(0, CATX_CARD_LIMIT)
    if (cards.length > 0) out.set(cat.slug, cards)
  }
  return out
}
