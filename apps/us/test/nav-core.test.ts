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
