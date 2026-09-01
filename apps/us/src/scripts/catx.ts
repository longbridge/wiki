/**
 * catx.ts — client-side interactivity for the "You might want to know" section.
 *
 * All card markup is pre-rendered at build time (index.astro SSG).
 * This script handles only:
 *   - tab switching (show/hide grids, update is-active pill)
 *   - CARD_LIMIT enforcement + fade mask
 *   - "Show N more" / "Show less" accordion expand/collapse
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
      btn.textContent = 'Show less'
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

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.key
      if (!key) return

      // Update active tab pill
      tabs.forEach((t) => {
        const active = t.dataset.key === key
        t.classList.toggle('is-active', active)
        t.setAttribute('aria-selected', String(active))
      })

      // Show/hide grids and their expand buttons
      grids.forEach((grid) => {
        const isActive = grid.dataset.tab === key
        grid.hidden = !isActive
        const btn = grid.nextElementSibling
        if (btn?.classList.contains('catx-expand-btn')) {
          ;(btn as HTMLElement).hidden = !isActive
        }
      })

      // Apply filter to the newly active grid
      const escapedKey = key.replace(/[^\w-]/g, '')
      const activeGrid = section.querySelector<HTMLElement>(`.catx__grid[data-tab="${escapedKey}"]`)
      if (activeGrid) applyFilter(activeGrid)
    })
  })

  // Initialise: apply filter to first grid, hide the rest
  grids.forEach((grid, i) => {
    if (i > 0) {
      grid.hidden = true
    }
  })
  if (grids[0]) applyFilter(grids[0])
}

document.addEventListener('DOMContentLoaded', initCatx)
