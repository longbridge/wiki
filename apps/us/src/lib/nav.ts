import { getCollection } from 'astro:content'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { buildNavFromRaw, selectCatxCards, type NavCategory, type CatxCard, type RawDoc } from './nav-core'

const DOCS_DIR = join(process.cwd(), 'docs/en')
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

// 根 docs/en/_order.json:分类 slug 按 Zendesk category.position(sync 生成)。缺失则回退 nav-core 写死顺序。
function loadCategoryOrder(): string[] {
  const root = join(DOCS_DIR, '_order.json')
  return existsSync(root) ? JSON.parse(readFileSync(root, 'utf8')) : []
}

export async function getNav(): Promise<NavCategory[]> {
  if (cache) return cache
  const entries = await getCollection('docs')
  const raw: RawDoc[] = entries.map((e) => ({
    id: e.id, title: e.data.title, promoted: e.data.promoted,
    position: e.data.position, updatedAt: e.data.zendesk_updated_at,
  }))
  const catOrder = loadCategoryOrder()
  cache = buildNavFromRaw(raw, loadOrders(), catOrder.length ? catOrder : undefined)
  return cache
}

export async function getCatxCards(): Promise<Map<string, CatxCard[]>> {
  return selectCatxCards(await getNav())
}
