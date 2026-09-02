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
    // Panels have no layout while the menu is hidden → fit the active one once visible
    const active = panel!.querySelector<HTMLElement>('.lb-mega__panel.is-active')
    if (active) requestAnimationFrame(() => fitArts(active))
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

  // Category tabs: hover/focus switches the right panel; the tab is itself a link
  // to that category's first article (data-idx pairs tab ↔ panel by DOM order).
  const tabs = Array.from(panel.querySelectorAll<HTMLElement>('[data-lb-cat-tab]'))
  const panels = Array.from(panel.querySelectorAll<HTMLElement>('.lb-mega__panel'))

  // Trim the article list to what fits the panel height (Zendesk parity: no inner scroll)
  function fitArts(p: HTMLElement | null) {
    if (!p) return
    const ul = p.querySelector<HTMLElement>('.lb-mega__arts')
    if (!ul) return
    const items = Array.from(ul.children) as HTMLElement[]
    items.forEach((li) => { li.style.display = '' })
    const ulBottom = ul.getBoundingClientRect().bottom
    // 容差吸收亚像素取整边界：每条约 40px，末条只超几 px 时 (渲染取整所致)
    // 仍算“放得下”,超出部分由 ul 的 overflow:hidden 裁掉 padding，不切字。
    // 10px 远小于一条高度，不会多塞进一整条。
    const SLACK = 10
    for (let i = 1; i < items.length; i++) {
      if (items[i].getBoundingClientRect().bottom > ulBottom + SLACK) {
        for (let j = i; j < items.length; j++) items[j].style.display = 'none'
        break
      }
    }
  }

  function activate(idx: number) {
    tabs.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx)
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false')
    })
    panels.forEach((p, i) => p.classList.toggle('is-active', i === idx))
    fitArts(panels[idx])
    requestAnimationFrame(() => fitArts(panels[idx]))
  }

  tabs.forEach((t, i) => {
    t.addEventListener('mouseenter', () => activate(i))
    t.addEventListener('focus', () => activate(i))
  })

  window.addEventListener('resize', () => {
    const act = panel!.querySelector<HTMLElement>('.lb-mega__panel.is-active')
    if (act) fitArts(act)
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
