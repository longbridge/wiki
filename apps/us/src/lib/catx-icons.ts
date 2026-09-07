/**
 * catx-icons.ts — build-time icon helpers for the "You might want to know" section.
 * Ported from the Zendesk home_page.hbs client-side script (2026-08-04).
 * Used only in index.astro at SSG time; no runtime dependency.
 */

const SVG_OPEN =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'

const ICONS: Record<string, string> = {
  doc:      SVG_OPEN + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  trend:    SVG_OPEN + '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>',
  shield:   SVG_OPEN + '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  swap:     SVG_OPEN + '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
  userplus: SVG_OPEN + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
  info:     SVG_OPEN + '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  gift:     SVG_OPEN + '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.4 3 11 5.2 12 8c1-2.8 2.6-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
  users:    SVG_OPEN + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  lock:     SVG_OPEN + '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  key:      SVG_OPEN + '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
  alert:    SVG_OPEN + '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  clock:    SVG_OPEN + '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  up:       SVG_OPEN + '<path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>',
  down:     SVG_OPEN + '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>',
  receipt:  SVG_OPEN + '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></svg>',
  percent:  SVG_OPEN + '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  building: SVG_OPEN + '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  layers:   SVG_OPEN + '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  wallet:   SVG_OPEN + '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  book:     SVG_OPEN + '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  coins:    SVG_OPEN + '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
  phone:    SVG_OPEN + '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  chart:    SVG_OPEN + '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
}

/** Section-title keyword rules: more specific than category rules, checked first. */
const SECTION_RULES: [RegExp, string][] = [
  [/multi-factor|authentication|\bmfa\b|\b2fa\b/, 'key'],
  [/login|password|verification|\bsms\b/, 'lock'],
  [/scam|fraud|phish/, 'alert'],
  [/secure|security/, 'shield'],
  [/unsettled|settle|pending/, 'clock'],
  [/withdraw/, 'up'],
  [/deposit|fund my|funding/, 'down'],
  [/transfer/, 'swap'],
  [/fee|charge|commission|pricing/, 'receipt'],
  [/tax|1099|w-8|w8/, 'receipt'],
  [/statement|document|report/, 'doc'],
  [/corporate/, 'building'],
  [/option/, 'layers'],
  [/cash|balance/, 'wallet'],
  [/margin/, 'percent'],
  [/crypto|token|coin/, 'coins'],
  [/basics|guide|getting started|introduction|how to/, 'book'],
  [/market|quote|data/, 'chart'],
  [/app\b|mobile/, 'phone'],
  [/open.*account|onboard/, 'userplus'],
  [/community|forum/, 'users'],
  [/reward|promo|campaign|offer/, 'gift'],
  [/about|company/, 'info'],
  [/trade|trading|order|invest/, 'trend'],
]

/** Category-name fallback rules (checked when section rules miss). */
const CATEGORY_RULES: [RegExp, string][] = [
  [/document|tax/, 'doc'],
  [/trading|invest/, 'trend'],
  [/opening/, 'userplus'],
  [/account|security/, 'shield'],
  [/funding|withdraw|transfer/, 'swap'],
  [/about/, 'info'],
  [/campaign|promotion|reward/, 'gift'],
  [/community/, 'users'],
]

function pick(rules: [RegExp, string][], text: string): string | null {
  for (const [re, key] of rules) {
    if (re.test(text)) return key
  }
  return null
}

/**
 * Returns an inline SVG string for the given section / category name.
 * `used` is a per-category deduplication record; pass a fresh `{}` per tab
 * and reset it between categories.  The function mutates `used` in place.
 */
export function iconFor(
  sectionName: string,
  categoryName: string,
  used?: Record<string, boolean>,
): string {
  let chose =
    pick(SECTION_RULES, sectionName.toLowerCase()) ??
    pick(CATEGORY_RULES, categoryName.toLowerCase()) ??
    'doc'

  if (used && used[chose]) {
    const pool = Object.keys(ICONS)
    for (const k of pool) {
      if (!used[k]) { chose = k; break }
    }
  }
  if (used) used[chose] = true
  return ICONS[chose]
}
