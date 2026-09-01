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
