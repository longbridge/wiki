// Mobile TOC FAB + slide-in drawer (build-time nav tree, no Zendesk API)
// Port of fab-drawer.hbs JS: drag, snap, open/close, accordion toggles.
;(() => {
  const fabEl = document.getElementById('toc-fab') as HTMLButtonElement | null
  const drawerEl = document.getElementById('toc-drawer') as HTMLDivElement | null
  if (!fabEl || !drawerEl) return
  // Non-null-typed aliases so nested closures don't re-widen to `| null`.
  const fab: HTMLButtonElement = fabEl
  const drawer: HTMLDivElement = drawerEl

  // ── Open / Close ──────────────────────────────────────────────────────────
  function openDrawer(): void {
    drawer.hidden = false
    void drawer.offsetWidth // force reflow so CSS transition runs
    drawer.classList.add('is-open')
    fab.classList.add('is-hidden')
    document.body.style.overflow = 'hidden'
  }

  function closeDrawer(): void {
    drawer.classList.remove('is-open')
    fab.classList.remove('is-hidden')
    document.body.style.overflow = ''
    setTimeout(() => {
      drawer.hidden = true
    }, 220)
  }

  // Backdrop click and ESC
  drawer.addEventListener('click', (e) => {
    const t = e.target as Element | null
    if (t?.hasAttribute?.('data-toc-close')) closeDrawer()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) closeDrawer()
  })

  // ── Draggable FAB ─────────────────────────────────────────────────────────
  const MARGIN = 16
  const SIZE = 44

  type DragState = {
    active: boolean
    moved: boolean
    startX: number
    startY: number
    origL: number
    origT: number
  }

  const drag: DragState = {
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origL: 0,
    origT: 0,
  }

  function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v))
  }

  function applyPos(l: number, t: number): void {
    fab.style.left = l + 'px'
    fab.style.top = t + 'px'
    fab.style.bottom = 'auto'
  }

  function clampedPos(l: number, t: number): [number, number] {
    return [
      clamp(l, MARGIN, window.innerWidth - SIZE - MARGIN),
      clamp(t, MARGIN, window.innerHeight - SIZE - MARGIN),
    ]
  }

  function snap(): void {
    const r = fab.getBoundingClientRect()
    const l =
      r.left + r.width / 2 < window.innerWidth / 2
        ? MARGIN
        : window.innerWidth - SIZE - MARGIN
    const t = clamp(r.top, MARGIN, window.innerHeight - SIZE - MARGIN)
    fab.style.transition = 'left 0.18s ease, top 0.18s ease'
    applyPos(l, t)
    setTimeout(() => {
      fab.style.transition = ''
    }, 200)
    try {
      localStorage.setItem('lb_toc_fab', JSON.stringify({ l, t }))
    } catch {
      // storage unavailable
    }
  }

  fab.addEventListener('pointerdown', (e) => {
    drag.active = true
    drag.moved = false
    drag.startX = e.clientX
    drag.startY = e.clientY
    const r = fab.getBoundingClientRect()
    drag.origL = r.left
    drag.origT = r.top
    try {
      fab.setPointerCapture(e.pointerId)
    } catch {
      // capture unavailable
    }
  })

  fab.addEventListener('pointermove', (e) => {
    if (!drag.active) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (!drag.moved && dx * dx + dy * dy < 36) return // 6px threshold
    drag.moved = true
    const [l, t] = clampedPos(drag.origL + dx, drag.origT + dy)
    applyPos(l, t)
    e.preventDefault()
  })

  fab.addEventListener('pointerup', () => {
    if (!drag.active) return
    drag.active = false
    if (drag.moved) snap()
  })

  fab.addEventListener('pointercancel', () => {
    drag.active = false
    if (drag.moved) snap()
  })

  fab.addEventListener('click', (e) => {
    if (drag.moved) {
      drag.moved = false
      e.preventDefault()
      e.stopImmediatePropagation()
      return
    }
    openDrawer()
  })

  window.addEventListener('resize', () => {
    if (fab.style.left) {
      const [l, t] = clampedPos(parseFloat(fab.style.left), parseFloat(fab.style.top))
      applyPos(l, t)
    }
  })

  // Restore persisted position
  try {
    const saved = JSON.parse(localStorage.getItem('lb_toc_fab') ?? 'null') as {
      l: number
      t: number
    } | null
    if (saved && typeof saved.l === 'number') {
      const [l, t] = clampedPos(saved.l, saved.t)
      applyPos(l, t)
    }
  } catch {
    // storage unavailable
  }
})()
