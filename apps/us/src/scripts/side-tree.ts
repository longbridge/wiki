/**
 * Side Tree interactions — vanilla TypeScript, no framework.
 * Handles: cat/sec fold/unfold, aria-expanded sync, container-scoped scroll for current item.
 *
 * Designed to work on any `.side-tree` container (desktop sidebar or mobile drawer).
 * Called once per host element — safe to call multiple times on different hosts.
 */

export function initSideTree(host: Element): void {
  // ── Chevron toggle (category + section) ─────────────────────────────────
  // Chevron buttons are separate from the navigable head links.
  // Must preventDefault+stopPropagation to fold without triggering the link.
  host.querySelectorAll<HTMLButtonElement>('.side-tree__chevron-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const cat = btn.closest<HTMLElement>('.side-tree__cat')
      const sec = btn.closest<HTMLElement>('.side-tree__sec')
      // sec is always inside cat, so check sec first
      const target = sec ?? cat
      if (!target) return

      const willOpen = !target.classList.contains('is-open')
      target.classList.toggle('is-open', willOpen)
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false')
    })
  })

  // ── Scroll current item into view (container-scoped, no page jump) ──────
  // Use scrollTop math against the scroll container to avoid scrolling the page.
  const container = (host.closest<HTMLElement>('.side-tree') ?? host) as HTMLElement
  const cur = host.querySelector<HTMLElement>('.side-tree__item.is-current')
  if (container && cur) {
    requestAnimationFrame(() => {
      const cRect = container.getBoundingClientRect()
      const curRect = cur.getBoundingClientRect()
      if (curRect.top < cRect.top || curRect.bottom > cRect.bottom) {
        container.scrollTop +=
          curRect.top - cRect.top - container.clientHeight / 2 + curRect.height / 2
      }
    })
  }
}

// Auto-init on all .side-tree elements present at load time.
// Drawer re-init is handled by drawer.ts when it opens.
document.querySelectorAll<HTMLElement>('.side-tree').forEach((host) => {
  initSideTree(host)
})
