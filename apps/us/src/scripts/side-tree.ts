/**
 * Side Tree interactions — vanilla TypeScript, no framework.
 * Handles: cat/sec fold/unfold, aria-expanded sync, scrollIntoView for current item.
 *
 * Designed to work on any `.side-tree` container (desktop sidebar or mobile drawer).
 * Called once per host element — safe to call multiple times on different hosts.
 */

export function initSideTree(host: Element): void {
  // ── Category toggle ──────────────────────────────────────────────────────
  host.querySelectorAll<HTMLButtonElement>('.side-tree__cat-head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.closest<HTMLElement>('.side-tree__cat')
      if (!cat) return

      const willOpen = !cat.classList.contains('is-open')
      cat.classList.toggle('is-open', willOpen)
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false')
    })
  })

  // ── Section toggle ───────────────────────────────────────────────────────
  host.querySelectorAll<HTMLButtonElement>('.side-tree__sec-head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sec = btn.closest<HTMLElement>('.side-tree__sec')
      if (!sec) return

      const willOpen = !sec.classList.contains('is-open')
      sec.classList.toggle('is-open', willOpen)
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false')
    })
  })

  // ── Scroll current item into view (container-scoped) ────────────────────
  const cur = host.querySelector<HTMLElement>('.side-tree__item.is-current')
  if (cur) {
    // Use requestAnimationFrame to ensure layout is complete before scrolling
    requestAnimationFrame(() => {
      try {
        cur.scrollIntoView({ block: 'center', behavior: 'auto' })
      } catch (_e) {
        // Fallback for browsers that don't support scrollIntoView options
        const scrollContainer = host.closest<HTMLElement>('.side-tree') ?? (host as HTMLElement)
        if (cur.offsetTop > scrollContainer.clientHeight - 80) {
          scrollContainer.scrollTop = cur.offsetTop - 120
        }
      }
    })
  }
}

// Auto-init on all .side-tree elements present at load time.
// Drawer re-init is handled by drawer.ts when it opens.
document.querySelectorAll<HTMLElement>('.side-tree').forEach((host) => {
  initSideTree(host)
})
