# Task 4 Fix Report

## header.ts type-error fix

`SVGElement` lacks `.hidden`; toggled `is-hidden` CSS class instead:

```ts
// before (error TS2339)
iconOpen.hidden = true

// after
iconOpen?.classList.add('is-hidden')
iconClose?.classList.remove('is-hidden')
```

Same pattern in `closeMenu()`. Also removed `hidden` attribute from
the close-icon `<svg>` in `Header.astro` (replaced with `class="is-hidden"`).
Added `.is-hidden { display: none !important; }` to `header.css`.

## astro check output (0 errors)

```
Result (13 files):
- 0 errors
- 0 warnings
- 1 hint        ← theme-mode.js mq.addListener deprecation (accepted)
```

## nav.ts path fix

`import.meta.url` resolves to the prerendered chunk URL in `dist/.prerender/chunks/`
during SSG, causing `readdirSync('dist/docs/en')` to fail.
Fixed by anchoring to `process.cwd()` (always the project root `apps/us/`):

```ts
// before
const DOCS_DIR = new URL('../../docs/en', import.meta.url).pathname
// after
const DOCS_DIR = join(process.cwd(), 'docs/en')
```

## dist/index.html structure evidence

`grep` on `dist/index.html` confirmed all required tokens present:

```
account-and-security    ✓  (mega menu category)
BrokerCheck             ✓  (footer disclaimer)
campaigns               ✓  (mega menu category)
FINRA                   ✓  (footer disclaimer)
funding-your-account    ✓  (mega menu category)
github.com              ✓  (GitHub link)
lb-header               ✓  (<header> element)
lb-region               ✓  (region switcher)
lbSetThemeMode          ✓  (inline theme-mode script)
longbridge-community    ✓  (mega menu category)
opening-an-account      ✓  (mega menu category)
skip-navigation         ✓  (skip-nav link)
trading-and-investing   ✓  (mega menu category)
```

All 6 categories, region switch, theme toggle, GitHub link, footer FINRA/BrokerCheck,
skip-nav, and inline theme-mode script are present in the built output.

## Gate Fix Report — Task 4 (2026-09-01)

### C1 (Critical) — GitHub URL
- File: `apps/us/src/components/Header.astro` ~line 232
- Changed `https://github.com/longbridgeapp` → `https://github.com/longbridge/docs`
- Verified in `dist/index.html`: `grep -o "github.com/longbridge/docs"` ✓

### I1 (Important) — Region cookie max-age
- File: `apps/us/src/scripts/header.ts` (initRegion)
- Replaced `expires=<Date>.toUTCString()` with `max-age=31536000`
- Cookie: `document.cookie = 'region=' + code + ';path=/;max-age=31536000;SameSite=Lax'`

### I2 (Important) — Footer home variant
- `Footer.astro`: added `isHome?: boolean` prop + `class:list={["lb-footer", { "lb-footer--home": isHome }]}`
- `footer.css`: appended `.lb-footer--home { background: var(--lb-footer-bg); }`
- `BaseLayout.astro`: changed `<Footer />` → `<Footer isHome={isHome} />`

### I3 (Important) — Dark selector compound
- `header.css`: All `html[theme="dark"]` rules now also carry `, .theme-dark` (logo rules x6, theme-icon rules x2)
- `footer.css`: No `html[theme="dark"]` rules existed; no changes needed

### I4 (Important) — Hero-keyed transparent header
- `header.ts` initScroll: replaced `!header.dataset.home` guard with `document.querySelector('.hero')`; JS adds `header--transparent` class when hero present
- `header.css`: transparent rule changed to `.lb-header.header--transparent:not(.is-scrolled)` (background + border)
- `header.css`: logo visibility rules changed from `.lb-header--home:not(.is-scrolled)` to `.header--transparent:not(.is-scrolled)`

### m1 (Minor) — US region hardcode removed
- `header.ts` initRegion: `window.location.assign('/' + code + '/')` for all regions

### Verification
- `bun run check`: 0 errors, 0 warnings, 1 hint (unrelated deprecated `addListener` in theme-mode.js)
- `bunx astro build`: Clean, 1 page built
- GitHub URL confirmed in `dist/index.html`
