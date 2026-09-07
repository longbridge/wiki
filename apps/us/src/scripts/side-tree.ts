/**
 * Side Tree interactions — vanilla TypeScript, no framework.
 * Handles: cat/sec fold/unfold, aria-expanded sync, container-scoped scroll for current item.
 *
 * Designed to work on any `.side-tree` container (desktop sidebar or mobile drawer).
 * Called once per host element — safe to call multiple times on different hosts.
 */

export function initSideTree(host: Element): void {
  // ── Row toggle (category + section) ─────────────────────────────────────
  // Whole head row is a <button> (Zendesk parity): clicking it folds/unfolds.
  host.querySelectorAll<HTMLButtonElement>('.side-tree__cat-head, .side-tree__sec-head').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()

      // sec-head → closest .side-tree__sec = its own sec;
      // cat-head → closest .side-tree__sec = null → fall back to cat.
      const sec = btn.closest<HTMLElement>('.side-tree__sec')
      const target = sec ?? btn.closest<HTMLElement>('.side-tree__cat')
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
