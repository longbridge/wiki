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
