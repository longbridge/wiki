// Article TOC — right-side sticky rail (desktop only).
// SPA-aware: rebuilds on `lb:content-swapped`; window listeners bound once.

type TocApi = { position: () => void; spy: () => void }
let activeToc: TocApi | null = null

function buildToc(): void {
  // 清理上一篇的 rail(SPA 重建时)
  document.querySelectorAll('.lb-toc').forEach((el) => el.remove())
  document.documentElement.classList.remove('lb-has-toc')
  activeToc = null

  const body = document.querySelector<HTMLElement>('.article-body')
  if (!body) return
  const articleEl = document.querySelector<HTMLElement>('.article-page__main')
  if (!articleEl) return
  const article: HTMLElement = articleEl

  // ── ID generation ────────────────────────────────────────────────────────
  const usedIds: Record<string, number> = {}
  function slugId(t: string): string {
    let s =
      t
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'section'
    let k = s
    let n = 2
    while (usedIds[k] || document.getElementById(k)) {
      k = s + '-' + n++
    }
    usedIds[k] = 1
    return k
  }

  // ── Pseudo-heading heuristic (Lark-pasted large bold run) ─────────────────
  function isPseudoHeading(el: Element): boolean {
    if (el.querySelector('div, p, h1, h2, h3, h4, ul, ol, table, img, a')) return false
    const t = el.textContent?.trim() ?? ''
    if (!t || t.length > 120) return false
    if (
      !el.querySelector(
        'span.wysiwyg-font-size-large, span.wysiwyg-font-size-x-large, span.wysiwyg-font-size-xx-large',
      )
    )
      return false
    const b = el.querySelectorAll('strong, b')
    return b.length === 1 && b[0].textContent?.trim() === t
  }

  // ── Collect headings ─────────────────────────────────────────────────────
  const headings = Array.from(
    body.querySelectorAll<HTMLElement>('h1, h2, h3, h4, div, p'),
  ).filter((h) => {
    if (!h.textContent?.trim()) return false
    return /^H[1-4]$/.test(h.tagName) || isPseudoHeading(h)
  })

  if (headings.length < 2) return

  headings.forEach((h) => {
    if (!h.id) h.id = slugId(h.textContent?.trim() ?? '')
  })

  function absLevel(h: HTMLElement): number {
    const m = h.tagName.match(/^H([1-4])$/)
    return m ? parseInt(m[1], 10) : 2
  }
  // 只保留最浅的两个层级 (如 h1/h2/h3 → 只留 h1/h2;h2/h3/h4 → 只留 h2/h3)。
  // rankOf 把这两级映射成 0/1 作为缩进深度，绝对级差再大也只两档。
  const distinctLevels = [...new Set(headings.map(absLevel))].sort((a, b) => a - b)
  const rankOf = new Map<number, number>(
    distinctLevels.slice(0, 2).map((lv, i) => [lv, i]),
  )
  const shown = headings.filter((h) => rankOf.has(absLevel(h)))
  if (shown.length < 2) return

  // ── Build nav element ─────────────────────────────────────────────────────
  const toc = document.createElement('nav')
  toc.className = 'lb-toc'
  toc.setAttribute('aria-label', 'On this page')

  const titleEl = document.createElement('div')
  titleEl.className = 'lb-toc__title'
  titleEl.textContent = 'On this page'
  toc.appendChild(titleEl)

  const list = document.createElement('ul')
  list.className = 'lb-toc__list'

  const links: { a: HTMLAnchorElement; h: HTMLElement }[] = []

  shown.forEach((h) => {
    const li = document.createElement('li')
    const depth = rankOf.get(absLevel(h)) ?? 0
    li.className = 'lb-toc__item' + (depth > 0 ? ' lb-toc__item--sub' : '')
    li.style.setProperty('--toc-depth', String(depth))

    const a = document.createElement('a')
    a.href = '#' + h.id
    a.textContent = h.textContent?.trim() ?? ''
    a.setAttribute('data-toc-target', h.id)

    a.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(h.id)
      if (target) {
        const hdr = document.querySelector<HTMLElement>('header.header, .lb-header')
        target.style.scrollMarginTop =
          Math.round((hdr ? hdr.getBoundingClientRect().bottom : 56) + 20) + 'px'
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', '#' + h.id)
      }
    })

    li.appendChild(a)
    list.appendChild(li)
    links.push({ a, h })
  })

  toc.appendChild(list)
  document.body.appendChild(toc)

  // ── Positioning ───────────────────────────────────────────────────────────
  function position(): void {
    const r = article.getBoundingClientRect()
    const space = window.innerWidth - r.right
    if (space < 210 || document.documentElement.classList.contains('is-whale-app')) {
      toc.style.display = 'none'
      document.documentElement.classList.remove('lb-has-toc')
      return
    }
    toc.style.display = 'block'
    document.documentElement.classList.add('lb-has-toc')
    // main 自带 30px 右 padding,再 +32 = 正文到 TOC 视觉 62(对齐 Zendesk toc.js)
    toc.style.left = Math.round(r.right + 32) + 'px'
    toc.style.width = Math.min(240, space - 48) + 'px'
  }

  // ── Scroll spy ────────────────────────────────────────────────────────────
  function spy(): void {
    const mark = window.pageYOffset + 130
    let cur = links[0]
    links.forEach((o) => {
      if (o.h.getBoundingClientRect().top + window.pageYOffset <= mark) cur = o
    })
    links.forEach((o) => {
      o.a.parentElement?.classList.toggle('is-active', o === cur)
    })
  }

  activeToc = { position, spy }
  position()
  spy()
}

// ── Window listeners: bound ONCE, always drive the current rail ─────────────
window.addEventListener('resize', () => activeToc?.position())
window.addEventListener('scroll', () => activeToc?.spy(), { passive: true })
window.addEventListener('load', () => activeToc?.position())

// ── First build + SPA rebuild ───────────────────────────────────────────────
buildToc()
document.addEventListener('lb:content-swapped', () => {
  buildToc()
  setTimeout(() => activeToc?.position(), 50)
})
setTimeout(() => activeToc?.position(), 400)
