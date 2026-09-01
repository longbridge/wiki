import { expect, test } from 'bun:test'
import { orderedMerge, buildNavFromRaw, selectPromotedByCategory, selectCatxCards, CATEGORY_ORDER } from '../src/lib/nav-core'
import type { NavCategory } from '../src/lib/nav-core'

// 'ghost' 在 order 中但不在 actual 中 → 被跳过（不出现在输出）; extras 按字母序追加
test('orderedMerge: _order.json 优先，幽灵项 (order 有 actual 无) 被跳过，多余项按字母序追加', () => {
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

const makeNav = (articles: { slug: string; promoted: boolean; updatedAt: string }[]): NavCategory[] => [
  {
    slug: 'cat-a',
    title: 'Cat A',
    overviewPath: '/cat-a/overview',
    firstArticlePath: '/cat-a/sec-1/' + articles[0]?.slug,
    sections: [
      {
        slug: 'sec-1',
        title: 'Sec 1',
        overviewPath: '/cat-a/sec-1/overview',
        firstArticlePath: '/cat-a/sec-1/' + articles[0]?.slug,
        articles: articles.map((a) => ({
          slug: a.slug,
          title: a.slug,
          path: `/cat-a/sec-1/${a.slug}`,
          promoted: a.promoted,
          position: 0,
          updatedAt: a.updatedAt,
        })),
      },
    ],
  },
]

test('selectPromotedByCategory: 只含 promoted 文章，按 updatedAt DESC 排序', () => {
  const nav = makeNav([
    { slug: 'old', promoted: true, updatedAt: '2026-01-01' },
    { slug: 'new', promoted: true, updatedAt: '2026-06-01' },
    { slug: 'skip', promoted: false, updatedAt: '2026-09-01' },
  ])
  const result = selectPromotedByCategory(nav)
  expect(result.has('cat-a')).toBe(true)
  expect(result.get('cat-a')!.map((a) => a.slug)).toEqual(['new', 'old'])
})

test('selectPromotedByCategory: 空 updatedAt 排最后', () => {
  const nav = makeNav([
    { slug: 'dated', promoted: true, updatedAt: '2026-01-01' },
    { slug: 'empty', promoted: true, updatedAt: '' },
  ])
  const result = selectPromotedByCategory(nav)
  expect(result.get('cat-a')!.map((a) => a.slug)).toEqual(['dated', 'empty'])
})

test('selectPromotedByCategory: 无 promoted 文章时该分类不出现在 Map 中', () => {
  const nav = makeNav([{ slug: 'art', promoted: false, updatedAt: '2026-01-01' }])
  expect(selectPromotedByCategory(nav).has('cat-a')).toBe(false)
})

// ── selectCatxCards ──────────────────────────────────────────────────────────

test('selectCatxCards: promoted-preferred — returns only promoted, sorted updatedAt DESC', () => {
  const nav = makeNav([
    { slug: 'old-p', promoted: true, updatedAt: '2026-01-01' },
    { slug: 'new-p', promoted: true, updatedAt: '2026-06-01' },
    { slug: 'noprm', promoted: false, updatedAt: '2026-09-01' },
  ])
  const result = selectCatxCards(nav)
  expect(result.has('cat-a')).toBe(true)
  const cards = result.get('cat-a')!
  expect(cards.map((c) => c.path)).toEqual(['/cat-a/sec-1/new-p', '/cat-a/sec-1/old-p'])
})

test('selectCatxCards: fallback — returns all articles in _order.json order when none promoted', () => {
  const nav = makeNav([
    { slug: 'art-1', promoted: false, updatedAt: '2026-01-01' },
    { slug: 'art-2', promoted: false, updatedAt: '2026-02-01' },
    { slug: 'art-3', promoted: false, updatedAt: '2026-03-01' },
  ])
  const result = selectCatxCards(nav)
  expect(result.has('cat-a')).toBe(true)
  const cards = result.get('cat-a')!
  expect(cards).toHaveLength(3)
  expect(cards.map((c) => c.path)).toEqual([
    '/cat-a/sec-1/art-1',
    '/cat-a/sec-1/art-2',
    '/cat-a/sec-1/art-3',
  ])
})

test('selectCatxCards: sectionTitle populated from parent section', () => {
  const nav = makeNav([{ slug: 'a', promoted: false, updatedAt: '2026-01-01' }])
  const cards = selectCatxCards(nav).get('cat-a')!
  expect(cards[0].sectionTitle).toBe('Sec 1')
  expect(cards[0].title).toBe('a')
})
