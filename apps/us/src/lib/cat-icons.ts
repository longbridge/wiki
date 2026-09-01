/**
 * Category icon SVGs and slug-to-key mapping.
 * Extracted from Header.astro for reuse across SideTree, Header, and future components.
 */

export const CAT_ICONS: Record<string, string> = {
  ai: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>`,
  trading: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>`,
  security: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v5c0 4.5-3.4 8.6-8 10-4.6-1.4-8-5.5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>`,
  funding: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10h.01M18 10h.01M6 14h.01M18 14h.01"/></svg>`,
  campaign: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4M8 4h8M3 12h18"/></svg>`,
  opening: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5 17c.6-2 2-3 4-3s3.4 1 4 3M15 10h4M15 13h4"/></svg>`,
  community: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M3 20c.8-3.5 3.2-5 6-5s5.2 1.5 6 5"/><path d="M15 20c.5-2 2-3 3.5-3s2.5.7 3 2"/></svg>`,
  book: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M4 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13"/></svg>`,
}

export function iconKeyForSlug(slug: string): string {
  if (slug === 'opening-an-account') return 'opening'
  if (slug === 'trading-and-investing') return 'trading'
  if (slug === 'funding-your-account-withdrawals-and-transfer') return 'funding'
  if (slug === 'account-and-security') return 'security'
  if (slug === 'longbridge-community') return 'community'
  if (slug === 'campaigns') return 'campaign'
  return 'book'
}
