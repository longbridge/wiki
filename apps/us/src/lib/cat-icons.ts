/**
 * Category icon SVGs and slug-to-key mapping.
 * Icons are the Zendesk theme's `iconForCatSvg` set (lucide-style, stroke-width 2)
 * so Header mega-menu + SideTree render the exact same glyphs as the live theme.
 */

const OPEN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'

export const CAT_ICONS: Record<string, string> = {
  // AI — sparkle
  ai: `${OPEN}<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  // Trading & Investing — bar chart
  trading: `${OPEN}<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  // Account & Security — shield + check
  security: `${OPEN}<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  // Funding — wallet
  funding: `${OPEN}<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`,
  // Promotions / Campaigns — gift
  promotion: `${OPEN}<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  // Opening an Account — user
  opening: `${OPEN}<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
  // Longbridge Community — users
  community: `${OPEN}<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`,
  // Documents & Taxes — file
  document: `${OPEN}<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  // Fallback — book
  book: `${OPEN}<path d="M4 4h11a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M4 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13"/></svg>`,
}

export function iconKeyForSlug(slug: string): string {
  if (slug === 'opening-an-account') return 'opening'
  if (slug === 'trading-and-investing') return 'trading'
  if (slug === 'funding-your-account-withdrawals-and-transfer') return 'funding'
  if (slug === 'account-and-security') return 'security'
  if (slug === 'longbridge-community') return 'community'
  if (slug === 'ai-related') return 'ai'
  if (slug === 'documents-and-taxes') return 'document'
  if (slug === 'promotions' || slug === 'campaigns') return 'promotion'
  return 'book'
}
