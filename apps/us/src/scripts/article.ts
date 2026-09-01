/**
 * article.ts — client-side logic for article pages
 *
 * 1. Votes  — persist up/down vote in localStorage per zendesk_article_id
 * 2. Recently viewed — record & render last 6 unique articles
 * 3. Table I9 — strip inline width so CSS max-content wins
 */

// ── 1. Votes ───────────────────────────────────────────────────────────────

type VoteValue = 'up' | 'down' | null

function getVoteKey(articleId: number): string {
  return `lb_article_vote_${articleId}`
}

function loadVote(articleId: number): VoteValue {
  try {
    const raw = localStorage.getItem(getVoteKey(articleId))
    if (raw === 'up' || raw === 'down') return raw
  } catch (_) {
    // localStorage may throw in private/sandbox contexts
  }
  return null
}

function saveVote(articleId: number, value: VoteValue): void {
  try {
    if (value === null) {
      localStorage.removeItem(getVoteKey(articleId))
    } else {
      localStorage.setItem(getVoteKey(articleId), value)
    }
  } catch (_) {
    // noop
  }
}

function initVotes(): void {
  const container = document.querySelector<HTMLElement>('.article-votes')
  if (!container) return

  const articleIdRaw = container.dataset.articleId
  if (!articleIdRaw) return
  const articleId = parseInt(articleIdRaw, 10)
  if (isNaN(articleId)) return

  const btnUp = container.querySelector<HTMLButtonElement>('[data-vote="up"]')
  const btnDown = container.querySelector<HTMLButtonElement>('[data-vote="down"]')
  if (!btnUp || !btnDown) return

  function applyState(value: VoteValue): void {
    btnUp!.classList.toggle('is-selected', value === 'up')
    btnDown!.classList.toggle('is-selected', value === 'down')
    btnUp!.setAttribute('aria-pressed', String(value === 'up'))
    btnDown!.setAttribute('aria-pressed', String(value === 'down'))
  }

  // Restore persisted state
  applyState(loadVote(articleId))

  function handleClick(clicked: VoteValue): void {
    const current = loadVote(articleId)
    // Toggle off if clicking the already-selected button
    const next: VoteValue = current === clicked ? null : clicked
    saveVote(articleId, next)
    applyState(next)
  }

  btnUp.addEventListener('click', () => handleClick('up'))
  btnDown.addEventListener('click', () => handleClick('down'))
}

// ── 2. Recently viewed ─────────────────────────────────────────────────────

const RECENT_KEY = 'lb_recent_articles_v1'
const RECENT_MAX = 6

interface RecentArticle {
  path: string
  title: string
}

function loadRecent(): RecentArticle[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is RecentArticle =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.path === 'string' &&
        typeof item.title === 'string',
    )
  } catch (_) {
    return []
  }
}

function saveRecent(items: RecentArticle[]): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items))
  } catch (_) {
    // noop
  }
}

function recordCurrentArticle(): void {
  const meta = document.querySelector<HTMLElement>('[data-article-path]')
  if (!meta) return

  const path = meta.dataset.articlePath
  const title = meta.dataset.articleTitle
  if (!path || !title) return

  const items = loadRecent().filter((a) => a.path !== path)
  items.unshift({ path, title })
  saveRecent(items.slice(0, RECENT_MAX))
}

function renderRecentArticles(): void {
  const section = document.querySelector<HTMLElement>('[data-recent-articles]')
  if (!section) return
  const list = section.querySelector<HTMLElement>('ul')
  if (!list) return

  const meta = document.querySelector<HTMLElement>('[data-article-path]')
  const selfPath = meta?.dataset.articlePath ?? ''

  const items = loadRecent().filter((a) => a.path !== selfPath)
  if (items.length === 0) {
    // Section stays hidden (default); nothing to show
    return
  }

  list.innerHTML = items
    .map(
      (a) =>
        `<li><a href="${escapeAttr(a.path)}">${escapeHtml(a.title)}</a></li>`,
    )
    .join('')
  // Reveal only when there is at least one entry
  section.hidden = false
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function initRecentlyViewed(): void {
  // First render existing list (before recording self, so self is excluded)
  renderRecentArticles()
  // Then record current page for future visits
  recordCurrentArticle()
}

// ── 3. Table I9 — strip inline width ──────────────────────────────────────

function fixTableWidths(): void {
  document
    .querySelectorAll<HTMLElement>(
      '.article-body figure.wysiwyg-table, .article-body table',
    )
    .forEach((el) => {
      el.style.width = ''
    })
}

// ── Init ───────────────────────────────────────────────────────────────────

function init(): void {
  initVotes()
  initRecentlyViewed()
  fixTableWidths()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
