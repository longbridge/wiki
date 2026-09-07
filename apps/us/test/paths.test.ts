import { expect, test } from 'bun:test'
import { applyBase } from '../src/lib/paths'

const BASE = '/us/'

test('applyBase: 根相对路径加前缀', () =>
  expect(applyBase('/trading-and-investing/x', BASE)).toBe('/us/trading-and-investing/x'))

test('applyBase: 已带 /us 幂等 — 不会双重前缀', () =>
  expect(applyBase('/us/x', BASE)).toBe('/us/x'))

test('applyBase: 裸 base (/us) 不变', () =>
  expect(applyBase('/us', BASE)).toBe('/us'))
