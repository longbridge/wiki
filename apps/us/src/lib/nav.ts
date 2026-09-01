import { getCollection } from 'astro:content'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { buildNavFromRaw, selectPromotedByCategory, type NavCategory, type NavArticle, type RawDoc } from './nav-core'

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
  return selectPromotedByCategory(await getNav())
}
