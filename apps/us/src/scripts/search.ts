/**
 * search.ts — Zendesk-style search modal backed by Pagefind (Task 6)
 * Ports header.hbs:164-328; replaces Zendesk API with Pagefind lazy-load.
 */

const modal = document.getElementById('lb-search-modal') as HTMLElement | null
const modalInput = document.getElementById('lb-search-input') as HTMLInputElement | null
const results = document.getElementById('lb-search-results') as HTMLElement | null

;(function init() {
  if (!modal || !modalInput || !results) {
    console.error('[search] Required DOM nodes missing')
    return
  }

  // ── Pagefind lazy loader ──────────────────────────────────────────────────

  let pagefind: any = null

  async function ensurePagefind() {
    if (pagefind) return pagefind
    try {
      pagefind = await import(/* @vite-ignore */ import.meta.env.BASE_URL + 'pagefind/pagefind.js')
      await pagefind.init()
    } catch {
      pagefind = null // dev server has no index; gracefully degrade
    }
    return pagefind
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  function esc(s: string): string {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c
    )
  }

  function highlight(s: string, q: string): string {
    if (!q) return esc(s)
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig')
    return esc(s).replace(re, '<mark>$1</mark>')
  }

  // ── State messages ────────────────────────────────────────────────────────

  function showHint(t: string) {
    results!.innerHTML = '<div class="lb-search-modal__hint">' + esc(t) + '</div>'
  }
  function showEmpty(q: string) {
    results!.innerHTML = '<div class="lb-search-modal__empty">No results for &ldquo;' + esc(q) + '&rdquo;</div>'
  }
  function showLoading() {
    results!.innerHTML = '<div class="lb-search-modal__loading">Searching&hellip;</div>'
  }
  function renderHint() {
    results!.innerHTML =
      '<div class="lb-search-modal__hint">Search is available on the built site — run <code>astro preview</code></div>'
  }

  // ── Recent search history (query strings, Zendesk parity) ─────────────────

  const HISTORY_KEY = 'lb_search_history_v1'
  const HISTORY_LIMIT = 10

  function readHistory(): string[] {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') || [] } catch { return [] }
  }
  function writeHistory(list: string[]) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)) } catch { /* quota exceeded */ }
  }
  function saveHistoryQuery(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()
    const list = readHistory().filter((h) => h && h.toLowerCase() !== lower)
    list.unshift(trimmed)
    writeHistory(list.slice(0, HISTORY_LIMIT))
  }
  function removeHistoryQuery(q: string) {
    if (!q) return
    const lower = q.toLowerCase()
    writeHistory(readHistory().filter((h) => h && h.toLowerCase() !== lower))
  }
  function clearHistoryList() { writeHistory([]) }

  const CLOCK_SVG =
    '<svg class="lb-search-modal__history-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  const REMOVE_SVG =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>'

  function showHistory() {
    const list = readHistory()
    if (!list.length) { showHint('Type to search articles...'); return }

    let out =
      '<div class="lb-search-modal__history">' +
      '  <div class="lb-search-modal__history-head">' +
      '    <span class="lb-search-modal__history-label">Recent searches</span>' +
      '    <button type="button" class="lb-search-modal__history-clear" data-clear-history>Clear</button>' +
      '  </div>' +
      '  <ul class="lb-search-modal__history-list">'

    list.forEach((q) => {
      out +=
        '<li class="lb-search-modal__history-row">' +
        '  <button type="button" class="lb-search-modal__history-item" data-run-history-query="' + esc(q) + '">' +
        CLOCK_SVG +
        '    <span class="lb-search-modal__history-title">' + esc(q) + '</span>' +
        '  </button>' +
        '  <button type="button" class="lb-search-modal__history-remove" data-remove-history data-history-q="' + esc(q) + '" aria-label="Remove">' + REMOVE_SVG + '</button>' +
        '</li>'
    })
    out += '</ul></div>'
    results!.innerHTML = out
  }

  // ── Search ────────────────────────────────────────────────────────────────

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let lastQuery = ''

  async function run(q: string) {
    if (q === lastQuery && !results!.querySelector('.lb-search-modal__loading')) return
    lastQuery = q
    if (!q) { showHint('Type to search articles...'); return }
    showLoading()

    const pf = await ensurePagefind()
    if (!pf) { renderHint(); return }

    const search = await pf.debouncedSearch(q)
    if (!search) return // stale call cancelled by Pagefind

    const items = await Promise.all(
      search.results.slice(0, 10).map((r: any) => r.data())
    )

    if (!items.length) { showEmpty(q); return }

    let out = '<ul class="lb-search-modal__list">'
    items.forEach((a: any) => {
      // Pagefind: a.url, a.meta.title, a.excerpt (already has <mark> tags)
      const title = (a.meta && a.meta.title) || ''
      const snippet = a.excerpt || ''
      out +=
        '<li>' +
        '<a class="lb-search-modal__item" href="' + esc(a.url) + '">' +
        '<span class="lb-search-modal__title">' + highlight(title, q) + '</span>' +
        '<p class="lb-search-modal__snippet">' + snippet + '</p>' +
        '</a></li>'
    })
    out += '</ul>'
    results!.innerHTML = out
  }

  function trigger() {
    if (debounceTimer !== null) clearTimeout(debounceTimer)
    const q = modalInput!.value.trim()
    if (!q) { lastQuery = ''; showHistory(); return }
    debounceTimer = setTimeout(() => { run(q) }, 250)
  }

  // ── Open / Close ──────────────────────────────────────────────────────────

  function openModal(seed?: string) {
    modal!.hidden = false
    modal!.setAttribute('aria-hidden', 'false')
    document.documentElement.classList.add('lb-search-open')
    if (typeof seed === 'string') modalInput!.value = seed
    setTimeout(() => {
      modalInput!.focus()
      try {
        const end = modalInput!.value.length
        modalInput!.setSelectionRange(end, end)
      } catch { /* readonly input */ }
    }, 20)
    const q = modalInput!.value.trim()
    if (q) run(q); else showHistory()
  }

  function closeModal() {
    modal!.hidden = true
    modal!.setAttribute('aria-hidden', 'true')
    document.documentElement.classList.remove('lb-search-open')
  }

  // Expose global opener for hero / hot-tags (Task 7 will call window.lbOpenSearch)
  ;(window as any).lbOpenSearch = openModal

  // ── Event wiring ──────────────────────────────────────────────────────────

  // Input debounce
  modalInput!.addEventListener('input', trigger)

  // Close on [data-close] click inside modal (backdrop + close button)
  modal!.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    if (target?.hasAttribute('data-close')) closeModal()
  })

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (!modal!.hidden && e.key === 'Escape') closeModal()
  })

  // ⌘/Ctrl+K to open
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault()
      openModal(modalInput!.value.trim())
    }
  })

  // Delegated click: search buttons + any .lb-search-modal-trigger
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    if (!target) return
    const btn = target.closest('.lb-header-search-btn, .lb-search-modal-trigger')
    if (btn) { e.preventDefault(); openModal('') }
  })

  // Capture-phase delegated: history interactions + save query + close on result click
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest) return

      // Remove single history query
      const rm = target.closest('[data-remove-history]') as HTMLElement | null
      if (rm && results!.contains(rm)) {
        removeHistoryQuery(rm.getAttribute('data-history-q') ?? '')
        showHistory()
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Clear all history
      const clr = target.closest('[data-clear-history]')
      if (clr && results!.contains(clr)) {
        clearHistoryList()
        showHistory()
        e.preventDefault()
        return
      }

      // History query row click: re-run that search (do NOT navigate)
      const qBtn = target.closest('[data-run-history-query]') as HTMLElement | null
      if (qBtn && results!.contains(qBtn)) {
        const q = qBtn.getAttribute('data-run-history-query') ?? ''
        if (q) {
          modalInput!.value = q
          modalInput!.focus()
          lastQuery = '' // force re-render
          run(q)
        }
        e.preventDefault()
        return
      }

      // Result link click: save the CURRENT query, then close
      const a = target.closest('a[href]') as HTMLAnchorElement | null
      if (!a || !results!.contains(a)) return
      const currentQ = modalInput!.value.trim()
      if (currentQ) saveHistoryQuery(currentQ)
      setTimeout(closeModal, 0)
    },
    true // capture phase
  )

  // Auto-open when landing with ?q=
  const initQ = new URLSearchParams(location.search).get('q')
  if (initQ) {
    setTimeout(() => {
      openModal(initQ)
      try { history.replaceState(null, '', location.pathname) } catch { /* private browsing */ }
    }, 60)
  }
})()
