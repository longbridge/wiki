/**
 * whale-bridge.ts — Longbridge App(Whale WebView) 内嵌适配。
 * 移植自 Zendesk 主题 script.js(680–957、1313–1346),保持行为一致：
 *   1. dsbridge v3 JS→Native 最小通道 (bridgeCall / bridgeCallSync / initDsBridge)
 *   2. lbConfigNativeBar:进 App 隐藏原生导航栏，由 H5 .lb-app-navbar 接管
 *   3. App 导航栏按钮：返回 / 搜索 / 关闭
 *   4. .lb-fab-menu 悬浮菜单按钮：可拖、位置记 cookie、点按打开分类抽屉
 *   5. 首页链接拦截 → lbGetNativePage(原生页栈开新 WebView)
 *   6. 剥掉所有 :hover 规则 (触屏 sticky hover)
 * 非 App 环境全部静默 no-op，普通浏览器安全。
 */

type Cb = (val: unknown) => void

const w = window as any
const isWhale = document.documentElement.classList.contains('is-whale-app')

// ── 1. dsbridge 通道 ─────────────────────────────────────────────────────────
let dsSeq = 0

function hasChannel(): boolean {
  return !!(w._dsbridge || w._dswk || navigator.userAgent.indexOf('_dsbridge') > -1)
}

/** 异步调用。始终挂 _dscbstub —— 该 App 的 dsbridge 没有回调桩会直接丢弃调用。 */
function bridgeCall(method: string, params?: unknown, cb?: Cb): boolean {
  const arg: Record<string, unknown> = { data: params == null ? null : params }
  const cbName = 'lbHcDscb_' + (dsSeq++).toString(36) + '_' + Date.now().toString(36)
  w[cbName] = (resp: any) => {
    try {
      if (cb) cb(resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp)
    } finally {
      delete w[cbName]
    }
  }
  arg._dscbstub = cbName
  setTimeout(() => {
    if (w[cbName]) delete w[cbName]
  }, 30000)
  try {
    const argStr = JSON.stringify(arg)
    if (w._dsbridge) {
      w._dsbridge.call(method, argStr)
      return true
    }
    if (w._dswk || navigator.userAgent.indexOf('_dsbridge') > -1) {
      window.prompt('_dsbridge=' + method, argStr)
      return true
    }
  } catch {
    /* no channel */
  }
  return false
}

/** 同步调用。不挂 _dscbstub —— 部分同步原生方法 (如 lbGetNativePage) 见到 cbstub 会 no-op。 */
function bridgeCallSync(method: string, params?: unknown): unknown {
  const arg = { data: params == null ? null : params }
  try {
    const argStr = JSON.stringify(arg)
    let ret: string | null = null
    if (w._dsbridge) ret = w._dsbridge.call(method, argStr)
    else if (w._dswk || navigator.userAgent.indexOf('_dsbridge') > -1) ret = window.prompt('_dsbridge=' + method, argStr)
    if (!ret) return null
    try {
      return JSON.parse(ret).data
    } catch {
      return null
    }
  } catch {
    return null
  }
}

w.lbBridgeCall = bridgeCall

/** JS 侧 dsbridge 初始化：装 Native→JS 分发器并发 _dsb.dsinit。
 *  没有 dsinit,dsbridge-iOS 会把所有 native→JS 求值 (含异步回调) 永久排队。 */
function initDsBridge(): void {
  if (!hasChannel() || w._dsf) return
  w._dsf = { _obs: {} }
  w._dsaf = { _obs: {} }
  w.dscb = 0
  w.dsBridge = { call: bridgeCall }
  w.close = () => {
    bridgeCall('_dsb.closePage')
  }
  w._handleMessageFromNative = (info: { data: string; callbackId: string; method: string }) => {
    const arg = JSON.parse(info.data)
    const ret: { id: string; complete: boolean; data: unknown } = { id: info.callbackId, complete: true, data: null }
    const f = w._dsf[info.method]
    const af = w._dsaf[info.method]
    if (f) {
      ret.data = f.apply(w._dsf, arg)
      bridgeCall('_dsb.returnValue', ret)
    } else if (af) {
      arg.push((data: unknown, complete?: boolean) => {
        ret.data = data
        ret.complete = complete !== false
        bridgeCall('_dsb.returnValue', ret)
      })
      af.apply(w._dsaf, arg)
    }
  }
  w._dsf._hasJavascriptMethod = (method: string) => !!(w._dsf[method] || w._dsaf[method])
  setTimeout(() => {
    bridgeCall('_dsb.dsinit')
  }, 0)
}
initDsBridge()

// ── 2–5. 仅 App 内 ───────────────────────────────────────────────────────────
if (isWhale) {
  const isHome = !!document.querySelector('.hero')

  // 2. 隐藏原生导航栏，H5 .lb-app-navbar 接管 (首页 / 非首页配置相同)
  bridgeCall('lbConfigNativeBar', {
    hidden: true,
    fitsStatusBar: false,
    titleConfig: { title: '', color: '#000000' },
    rightConfigs: [],
  })

  // 3. App 导航栏按钮
  const backBtn = document.querySelector<HTMLElement>('[data-lb-app-back]')
  backBtn?.addEventListener('click', () => {
    // h5hub 风格：优先 WebView 内后退;没有可退的历史才关 WebView
    if (window.history.length <= 1) {
      bridgeCall('lbCloseWebView')
      return
    }
    const url = location.href
    let navigated = false
    const onPop = () => {
      navigated = true
      window.removeEventListener('popstate', onPop)
    }
    window.addEventListener('popstate', onPop)
    history.back()
    setTimeout(() => {
      window.removeEventListener('popstate', onPop)
      if (!navigated && location.href === url) bridgeCall('lbCloseWebView')
    }, 300)
  })
  // 搜索按钮：带 .lb-search-modal-trigger，由 search.ts 的委托点击直接打开搜索框，这里无需接线
  document.querySelector<HTMLElement>('[data-lb-app-close]')?.addEventListener('click', () => {
    bridgeCall('lbCloseWebView', { root: true })
  })

  // 4. 悬浮菜单按钮：拖拽 + 记位置;点按 (未拖动)→ 复用 header 汉堡的开抽屉链路
  const fab = document.querySelector<HTMLElement>('[data-lb-fab-menu]')
  if (fab) {
    const FAB_THRESH = 6
    let drag = false
    let moved = false
    let sx = 0
    let sy = 0
    let ox = 0
    let oy = 0
    try {
      const ck = document.cookie.match(/(?:^|; )lb_fab_pos=([^;]*)/)
      const saved = ck ? JSON.parse(decodeURIComponent(ck[1])) : null
      if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
        fab.style.left = saved.left + 'px'
        fab.style.top = saved.top + 'px'
        fab.style.bottom = 'auto'
      }
    } catch {
      /* cookie unavailable */
    }
    const point = (e: MouseEvent | TouchEvent) => ('touches' in e && e.touches[0] ? e.touches[0] : (e as MouseEvent))
    const down = (e: MouseEvent | TouchEvent) => {
      const p = point(e)
      drag = true
      moved = false
      sx = p.clientX
      sy = p.clientY
      const r = fab.getBoundingClientRect()
      ox = r.left
      oy = r.top
      fab.style.transition = 'none'
      fab.style.left = ox + 'px'
      fab.style.top = oy + 'px'
      fab.style.bottom = 'auto'
    }
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drag) return
      const p = point(e)
      const dx = p.clientX - sx
      const dy = p.clientY - sy
      if (!moved && (Math.abs(dx) > FAB_THRESH || Math.abs(dy) > FAB_THRESH)) moved = true
      if (moved) {
        if (e.cancelable) e.preventDefault()
        const bw = fab.offsetWidth
        const bh = fab.offsetHeight
        fab.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, ox + dx)) + 'px'
        fab.style.top = Math.max(8, Math.min(window.innerHeight - bh - 8, oy + dy)) + 'px'
      }
    }
    const up = () => {
      if (!drag) return
      drag = false
      fab.style.transition = ''
      if (!moved) {
        document.querySelector<HTMLElement>('[data-lb-cat-drawer-open]')?.click()
        return
      }
      const r = fab.getBoundingClientRect()
      const bw = fab.offsetWidth
      const bh = fab.offsetHeight
      const left = r.left + bw / 2 < window.innerWidth / 2 ? 16 : window.innerWidth - bw - 16
      const top = Math.max(8, Math.min(window.innerHeight - bh - 8, r.top))
      fab.style.left = left + 'px'
      fab.style.top = top + 'px'
      try {
        document.cookie =
          'lb_fab_pos=' + encodeURIComponent(JSON.stringify({ left, top })) + '; path=/; max-age=31536000'
      } catch {
        /* cookie unavailable */
      }
    }
    fab.addEventListener('touchstart', down, { passive: true })
    fab.addEventListener('touchmove', move, { passive: false })
    fab.addEventListener('touchend', up)
    fab.addEventListener('mousedown', down)
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  // 5. 仅首页：拦截链接，经 bridge 用原生页栈打开新 WebView
  if (isHome) {
    document.addEventListener(
      'click',
      (e) => {
        const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
        if (!link) return
        const href = link.getAttribute('href')
        if (!href) return
        if (href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return
        if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return
        // 自带点击行为 / 开弹层的元素不拦:.hero-hot-tag 开搜索框;data-lb-no-intercept 通用退出
        if (link.classList.contains('hero-hot-tag')) return
        if (link.hasAttribute('data-lb-no-intercept')) return
        let absoluteUrl: string
        try {
          absoluteUrl = new URL(href, location.href).href
        } catch {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        bridgeCallSync('lbGetNativePage', { page: absoluteUrl })
      },
      true,
    )
  }

  // 6. 剥掉同源样式表里的所有 :hover 规则 —— 触屏没有真 hover，点按会留下 sticky hover。
  //    在 CSSOM 层整类消灭，而不是逐个选择器覆盖。
  const stripGroup = (owner: CSSStyleSheet | CSSGroupingRule, rules: CSSRuleList) => {
    for (let j = rules.length - 1; j >= 0; j--) {
      const rule = rules[j] as CSSRule & { cssRules?: CSSRuleList; selectorText?: string }
      if (rule.cssRules && rule.cssRules.length) {
        stripGroup(rule as unknown as CSSGroupingRule, rule.cssRules)
        continue
      }
      if (!rule.selectorText || rule.selectorText.indexOf(':hover') === -1) continue
      const kept = rule.selectorText.split(',').filter((s) => s.indexOf(':hover') === -1)
      try {
        if (kept.length) (rule as CSSStyleRule).selectorText = kept.join(',')
        else owner.deleteRule(j)
      } catch {
        try {
          owner.deleteRule(j)
        } catch {
          /* immutable */
        }
      }
    }
  }
  const stripAll = () => {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i]
      let rules: CSSRuleList | null = null
      try {
        rules = sheet.cssRules
      } catch {
        continue // cross-origin
      }
      if (rules) stripGroup(sheet, rules)
    }
  }
  if (document.readyState === 'complete') stripAll()
  else window.addEventListener('load', stripAll)
  stripAll()
}
