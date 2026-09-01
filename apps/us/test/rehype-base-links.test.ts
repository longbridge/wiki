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
