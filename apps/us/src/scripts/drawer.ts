/**
 * Cat drawer interactions — vanilla TypeScript, no framework.
 * Handles: open, close (button/backdrop/ESC), scroll lock, bfcache reset,
 * capture-phase link-click (close then navigate).
 */

const DRAWER_ID = 'lb-cat-drawer'
const SCROLL_LOCK_CLASS = 'lb-drawer-open'

function getDrawer(): HTMLElement | null {
  return document.getElementById(DRAWER_ID)
}

function openDrawer(): void {
  const drawer = getDrawer()
  if (!drawer) return

  drawer.removeAttribute('hidden')
  drawer.setAttribute('aria-hidden', 'false')
  document.documentElement.classList.add(SCROLL_LOCK_CLASS)

  // Focus first interactive element inside panel for accessibility
  const firstFocusable = drawer.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  firstFocusable?.focus()
}

function closeDrawer(): void {
  const drawer = getDrawer()
  if (!drawer) return

  drawer.setAttribute('hidden', '')
  drawer.setAttribute('aria-hidden', 'true')
  document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
}

// ── Open trigger ─────────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const target = (e.target as Element).closest<HTMLElement>('[data-lb-cat-drawer-open]')
  if (!target) return
  e.preventDefault()
  openDrawer()
})

// ── Close triggers (backdrop + close button) ─────────────────────────────────
document.addEventListener('click', (e) => {
  const target = (e.target as Element).closest<HTMLElement>('[data-lb-cat-drawer-close]')
  if (!target) return
  e.preventDefault()
  closeDrawer()
})

// ── ESC key ───────────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  const drawer = getDrawer()
  if (!drawer || drawer.hasAttribute('hidden')) return
  closeDrawer()
})

// ── Capture-phase link clicks inside drawer ───────────────────────────────────
// Close drawer first, then let navigation proceed naturally.
document.addEventListener(
  'click',
  (e) => {
    const drawer = getDrawer()
    if (!drawer || drawer.hasAttribute('hidden')) return

    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
    if (!link || !drawer.contains(link)) return

    // Close immediately; navigation continues after this handler returns.
    closeDrawer()
  },
  true, // capture phase so we run before any stopPropagation on inner elements
)

// ── bfcache: reset drawer state when navigating back ─────────────────────────
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    closeDrawer()
  }
})
