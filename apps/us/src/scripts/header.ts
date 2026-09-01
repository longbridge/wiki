/**
 * Header interactions — vanilla TypeScript, no framework.
 * Handles: I1 scroll transition, I2 mega-menu, I11 region switch,
 * theme toggle.
 */

// ── Scroll transition (I1) ─────────────────────────────────────────────────
;(function initScroll() {
  const header = document.getElementById('lb-header') as HTMLElement | null
  if (!header) return

  // Transparent state depends on a .hero element being present, not a static attribute
  const hero = document.querySelector('.hero')
  if (hero) {
    header.classList.add('header--transparent')
  }

  const THRESHOLD = 60
  let ticking = false

  function update() {
    if (window.scrollY > THRESHOLD) {
      header!.classList.add('is-scrolled')
    } else {
      header!.classList.remove('is-scrolled')
    }
    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }, { passive: true })

  update()
})()


// ── Mega menu (I2) ─────────────────────────────────────────────────────────
;(function initMega() {
  const trigger = document.querySelector<HTMLButtonElement>('[data-lb-dropdown-trigger]')
  const panel   = document.getElementById('lb-mega-menu')
  if (!trigger || !panel) return

  let hoverTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function openMega() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
    panel!.hidden = false
    trigger!.setAttribute('aria-expanded', 'true')
  }

  function closeMega() {
    panel!.hidden = true
    trigger!.setAttribute('aria-expanded', 'false')
  }

  // Hover open with 200ms delay
  trigger.addEventListener('mouseenter', () => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
    hoverTimer = setTimeout(openMega, 200)
  })
  trigger.addEventListener('mouseleave', () => {
    if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
    closeTimer = setTimeout(closeMega, 120)
  })
  panel.addEventListener('mouseenter', () => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  })
  panel.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(closeMega, 120)
  })

  // Click toggle
  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = trigger.getAttribute('aria-expanded') === 'true'
    if (expanded) { closeMega() } else { openMega() }
  })

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      closeMega()
      trigger.focus()
    }
  })

  // Outside click
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target as Node) && e.target !== trigger) {
      closeMega()
    }
  })

  // Category hover: left-column button → right panel
  const catBtns = document.querySelectorAll<HTMLButtonElement>('[data-lb-cat-btn]')

  function activateCat(btn: HTMLButtonElement) {
    const cat = btn.dataset.cat
    if (!cat) return

    catBtns.forEach((b) => {
      b.classList.toggle('is-active', b === btn)
      b.setAttribute('aria-expanded', b === btn ? 'true' : 'false')
    })

    document.querySelectorAll<HTMLElement>('.lb-mega__panel').forEach((p) => {
      const match = p.dataset.cat === cat
      p.classList.toggle('is-active', match)
      p.hidden = !match
    })
  }

  catBtns.forEach((btn) => {
    btn.addEventListener('mouseenter', () => activateCat(btn))
    btn.addEventListener('click', () => activateCat(btn))
  })
})()


// ── Region switch (I11) ────────────────────────────────────────────────────
;(function initRegion() {
  const trigger = document.querySelector<HTMLButtonElement>('[data-lb-region-trigger]')
  const menu    = document.getElementById('lb-region-menu')
  if (!trigger || !menu) return

  function openRegion() {
    menu!.hidden = false
    trigger!.setAttribute('aria-expanded', 'true')
  }

  function closeRegion() {
    menu!.hidden = true
    trigger!.setAttribute('aria-expanded', 'false')
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = trigger.getAttribute('aria-expanded') === 'true'
    if (expanded) { closeRegion() } else { openRegion() }
  })

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target as Node) && e.target !== trigger) {
      closeRegion()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      closeRegion()
      trigger.focus()
    }
  })

  // Region option click — set cookie + navigate
  document.querySelectorAll<HTMLButtonElement>('[data-lb-region-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.regionCode
      if (!code) return

      // Set cookie: 1 year via max-age (clock-skew-robust), path=/, SameSite=Lax
      document.cookie = 'region=' + code + ';path=/;max-age=31536000;SameSite=Lax'

      // Navigate to region root
      window.location.assign('/' + code + '/')
    })
  })
})()


// ── Theme toggle ───────────────────────────────────────────────────────────
;(function initTheme() {
  const btn = document.querySelector<HTMLButtonElement>('[data-lb-theme-toggle]')
  if (!btn) return

  btn.addEventListener('click', () => {
    const current = (window as any).lbGetThemeMode?.() ?? 'light'
    const next = current === 'dark' ? 'light' : 'dark';
    (window as any).lbSetThemeMode?.(next, true)
  })
})()
