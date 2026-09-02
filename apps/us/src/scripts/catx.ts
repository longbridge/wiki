/**
 * catx.ts — client-side interactivity for the "You might want to know" section.
 *
 * All card markup is pre-rendered at build time (index.astro SSG).
 * This script handles only:
 *   - tab switching (show/hide grids, update is-active pill, scroll-to-center)
 *   - CARD_LIMIT enforcement + grid fade mask
 *   - "Show N more" / "Collapse" accordion expand/collapse
 *   - Horizontal fade mask on tab strip when scrollable (--fade-l / --fade-r)
 */

const CARD_LIMIT = 12

function buildExpandRows(grid: HTMLElement, extras: HTMLElement[]): void {
  // Remove any stale expand button that follows this grid
  const next = grid.nextElementSibling
  if (next?.classList.contains('catx-expand-btn')) {
    next.remove()
  }

  if (extras.length === 0) {
    grid.classList.remove('catx__fade')
    return
  }

  const btn = document.createElement('button')
  btn.className = 'catx-expand-btn'
  btn.type = 'button'
  btn.textContent = `Show ${extras.length} more`
  btn.setAttribute('aria-expanded', 'false')

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true'
    if (expanded) {
      extras.forEach((c) => { c.hidden = true })
      grid.classList.add('catx__fade')
      btn.textContent = `Show ${extras.length} more`
      btn.setAttribute('aria-expanded', 'false')
    } else {
      extras.forEach((c) => { c.hidden = false })
      grid.classList.remove('catx__fade')
      btn.textContent = 'Collapse'
      btn.setAttribute('aria-expanded', 'true')
    }
  })

  grid.insertAdjacentElement('afterend', btn)
}

function applyFilter(grid: HTMLElement): void {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.catx-card'))
  const shown = cards.slice(0, CARD_LIMIT)
  const extras = cards.slice(CARD_LIMIT)

  shown.forEach((c) => { c.hidden = false })
  extras.forEach((c) => { c.hidden = true })

  if (extras.length > 0) {
    grid.classList.add('catx__fade')
  } else {
    grid.classList.remove('catx__fade')
  }

  buildExpandRows(grid, extras)
}

function initCatx(): void {
  const section = document.querySelector<HTMLElement>('.catx-section')
  if (!section) return

  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('.catx__tab'))
  const grids = Array.from(section.querySelectorAll<HTMLElement>('.catx__grid'))

  if (tabs.length === 0 || grids.length === 0) return

  const underline = section.querySelector<HTMLElement>('.catx__underline')
  const tabsWrap = section.querySelector<HTMLElement>('.catx-tabs')

  // 下划线：固定 32×3，居中在 active tab 文字下 (CSS 负责 left 过渡动画)
  const UNDERLINE_W = 32
  function moveUnderline(): void {
    const active = tabs.find((t) => t.classList.contains('is-active'))
    if (!underline || !active) return
    underline.hidden = false
    underline.style.width = `${UNDERLINE_W}px`
    underline.style.left = `${active.offsetLeft + active.offsetWidth / 2 - UNDERLINE_W / 2}px`
  }

  // 横向滚动两侧渐隐：按滚动位置设 --fade-l/r (Zendesk)
  function updateFade(): void {
    if (!tabsWrap) return
    const threshold = 20
    const scrollLeft = tabsWrap.scrollLeft
    const scrollRight = tabsWrap.scrollWidth - tabsWrap.clientWidth - scrollLeft
    tabsWrap.style.setProperty('--fade-l', scrollLeft > threshold ? '24px' : '0px')
    tabsWrap.style.setProperty('--fade-r', scrollRight > threshold ? '24px' : '0px')
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.key
      if (!key) return

      // Update active tab
      tabs.forEach((t) => {
        const active = t.dataset.key === key
        t.classList.toggle('is-active', active)
        t.setAttribute('aria-selected', String(active))
      })

      moveUnderline()

      // Scroll active tab into center of the strip (I3)
      if (tabsWrap) {
        tabsWrap.scrollTo({
          left: tab.offsetLeft - (tabsWrap.clientWidth - tab.offsetWidth) / 2,
          behavior: 'smooth',
        })
      }

      // Show/hide grids and their expand buttons
      grids.forEach((grid) => {
        const isActive = grid.dataset.tab === key
        grid.hidden = !isActive
        const btn = grid.nextElementSibling
        if (btn?.classList.contains('catx-expand-btn')) {
          ;(btn as HTMLElement).hidden = !isActive
        }
      })

      // Apply filter + replay fade-in on the newly active grid
      const escapedKey = key.replace(/[^\w-]/g, '')
      const activeGrid = section.querySelector<HTMLElement>(`.catx__grid[data-tab="${escapedKey}"]`)
      if (activeGrid) {
        applyFilter(activeGrid)
        activeGrid.classList.remove('catx__grid--enter')
        void activeGrid.offsetWidth
        activeGrid.classList.add('catx__grid--enter')
      }
    })
  })

  // Reposition underline + refresh fade on resize / after web fonts load
  window.addEventListener('resize', () => { moveUnderline(); updateFade() }, { passive: true })
  if (document.fonts?.ready) document.fonts.ready.then(moveUnderline)

  // Tab strip edge fade while scrolling
  if (tabsWrap) tabsWrap.addEventListener('scroll', updateFade, { passive: true })

  // Initialise: apply filter to first grid, hide the rest, place underline + fade
  grids.forEach((grid, i) => {
    if (i > 0) grid.hidden = true
  })
  if (grids[0]) applyFilter(grids[0])
  moveUnderline()
  updateFade()
}

document.addEventListener('DOMContentLoaded', initCatx)
