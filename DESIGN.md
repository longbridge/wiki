---
version: "alpha"
name: "Longbridge UX 5.0"
description: "Professional financial trading platform design system. Clean, efficient, high-contrast visual identity optimized for data-dense financial information. Dual-theme (light/dark) with teal brand accent."

# ── COLORS ──────────────────────────────────────────────────────────────────
# Flat keys with -light / -dark suffix.
# Status and AI tokens are theme-invariant (no suffix).
colors:
  # Semantic alias required by design-md linter (maps to brand-light)
  primary: "#00B8B8"

  # Brand
  brand-light: "#00B8B8"
  brand-dark: "#00F0C4"
  brand-aux-light: "#E5F8F8"
  brand-aux-dark: "#09252A"

  # Text
  text-primary-light: "#0A0E19"
  text-primary-dark: "#FFFFFF"
  text-secondary-light: "#6C6E75"
  text-secondary-dark: "#9D9FA3"
  text-tertiary-light: "#A9ABAE"   # ⚠️ forbidden for body copy
  text-tertiary-dark: "#60626A"    # ⚠️ forbidden for body copy

  # Backgrounds
  bg-primary-light: "#FFFFFF"
  bg-primary-dark: "#0A0E19"
  bg-secondary-light: "#F3F5F6"
  bg-secondary-dark: "#232630"

  # Divider & Border
  divider-light: "#DDDDDF"
  divider-dark: "#3B3E47"
  border-light: "#E6E7E8"
  border-dark: "#2C3039"

  # Status (theme-invariant)
  status-up: "#00ADA2"
  status-down: "#FF3A75"
  status-error: "#F7415F"
  status-warning: "#FF9728"
  status-success: "#00CC92"
  status-info: "#2A99FE"

  # AI Module (always dark-palette, theme-invariant)
  ai-brand: "#00F0C4"
  ai-brand-aux: "#09252A"
  ai-bg-primary: "#0A0E19"
  ai-bg-secondary: "#232630"
  ai-text-primary: "#FFFFFF"
  ai-text-secondary: "#9D9FA3"
  ai-text-tertiary: "#60626A"
  ai-divider: "#3B3E47"
  ai-border: "#2C3039"

# ── TYPOGRAPHY ───────────────────────────────────────────────────────────────
# Font families (Inter / Cera Pro / SF Pro Display) are official UX 5.0.
# ⚠️ Font sizes and line heights recommended from Tailwind CSS default type scale.
typography:
  # Display / Marketing — Cera Pro
  display-xl:
    fontFamily: "Cera Pro"
    fontSize: "48px"     # Tailwind text-5xl
    lineHeight: "52px"   # Tailwind leading-none
    fontWeight: "700"
  display-lg:
    fontFamily: "Cera Pro"
    fontSize: "36px"     # Tailwind text-4xl
    lineHeight: "40px"   # Tailwind leading-10
    fontWeight: "700"
  display-md:
    fontFamily: "Cera Pro"
    fontSize: "30px"     # Tailwind text-3xl
    lineHeight: "36px"   # Tailwind leading-9
    fontWeight: "600"

  # Interface Headings — Inter
  heading-xl:
    fontFamily: "Inter"
    fontSize: "24px"     # Tailwind text-2xl
    lineHeight: "32px"   # Tailwind leading-8
    fontWeight: "600"
  heading-lg:
    fontFamily: "Inter"
    fontSize: "20px"     # Tailwind text-xl
    lineHeight: "28px"   # Tailwind leading-7
    fontWeight: "600"
  heading-md:
    fontFamily: "Inter"
    fontSize: "18px"     # Tailwind text-lg
    lineHeight: "28px"
    fontWeight: "600"

  # Body — Inter
  body-lg:
    fontFamily: "Inter"
    fontSize: "16px"     # Tailwind text-base
    lineHeight: "24px"   # Tailwind leading-6
    fontWeight: "400"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"     # Tailwind text-sm
    lineHeight: "20px"   # Tailwind leading-5
    fontWeight: "400"
  body-sm:
    fontFamily: "Inter"
    fontSize: "12px"     # Tailwind text-xs
    lineHeight: "16px"   # Tailwind leading-4
    fontWeight: "400"

  # Button Labels — Inter
  button-xl-label:
    fontFamily: "Inter"
    fontSize: "16px"
    lineHeight: "21px"
    fontWeight: "600"
  button-lg:
    fontFamily: "Inter"
    fontSize: "16px"
    lineHeight: "21px"
    fontWeight: "500"
  button-md:
    fontFamily: "Inter"
    fontSize: "14px"
    lineHeight: "18px"
    fontWeight: "500"

  # Financial Numbers — SF Pro Display
  number-lg:
    fontFamily: "SF Pro Display"
    fontSize: "24px"     # Tailwind text-2xl
    lineHeight: "32px"
    fontWeight: "600"
  number-md:
    fontFamily: "SF Pro Display"
    fontSize: "18px"     # Tailwind text-lg
    lineHeight: "28px"
    fontWeight: "500"
  number-sm:
    fontFamily: "SF Pro Display"
    fontSize: "14px"     # Tailwind text-sm
    lineHeight: "20px"
    fontWeight: "400"

# ── ROUNDED ──────────────────────────────────────────────────────────────────
# Official Longbridge UX 5.0 values.
rounded:
  sm: "6px"    # General cards, buttons, tabs, inputs, charts
  md: "12px"   # AI scenario cards — exclusive use
  lg: "18px"   # Sheet / drawer top corners only

# ── SPACING ───────────────────────────────────────────────────────────────────
# ⚠️ Recommended from Tailwind CSS default spacing scale (1 unit = 4 px).
spacing:
  "0":    "0px"
  "0.5":  "2px"
  "1":    "4px"
  "2":    "8px"
  "3":    "12px"   # SM button h-padding
  "4":    "16px"   # LG button h-padding, common section gap
  "5":    "20px"   # Card internal padding
  "6":    "24px"   # XL button h-padding, module gap
  "8":    "32px"
  "10":   "40px"
  "12":   "48px"
  "16":   "64px"
  "20":   "80px"
  "24":   "96px"

# ── SHADOWS ───────────────────────────────────────────────────────────────────
# Official Longbridge UX 5.0 values. Light and dark variants.
shadows:
  card-light:       "0px 2px 8px 0px rgba(0,0,0,0.08)"
  card-dark:        "0px 2px 8px 0px rgba(0,0,0,0.24)"
  collapsed-light:  "0px 1px 4px 0px rgba(0,0,0,0.06)"
  collapsed-dark:   "0px 1px 4px 0px rgba(0,0,0,0.18)"
  dropdown-light:   "0px 4px 12px 0px rgba(0,0,0,0.12)"
  dropdown-dark:    "0px 4px 12px 0px rgba(0,0,0,0.32)"

# ── Z-INDEX ───────────────────────────────────────────────────────────────────
# ⚠️ Recommended from Tailwind CSS default z-index scale + shadcn/ui convention.
# shadcn dialog default = z-50, used here for modal / toast layer.
zIndex:
  base:     0    # Tailwind z-0  — normal document flow
  dropdown: 10   # Tailwind z-10 — dropdowns, tooltips
  sticky:   20   # Tailwind z-20 — sticky headers
  fixed:    30   # Tailwind z-30 — fixed navigation
  overlay:  40   # Tailwind z-40 — modal backdrops
  modal:    50   # Tailwind z-50 / shadcn dialog — modals, sheets, toasts

# ── MOTION ────────────────────────────────────────────────────────────────────
# duration-max (500ms) and stagger-max (100ms) are official UX 5.0 constraints.
# ⚠️ Individual duration values recommended from Tailwind CSS default transition
# durations; easing-standard from Tailwind ease-in-out; easing-emphasized from
# Material Design expressive easing curve.
motion:
  duration-fast:      "150ms"   # Tailwind duration-150 — hover, micro-interactions
  duration-base:      "200ms"   # Tailwind duration-200 — standard (shadcn default)
  duration-slow:      "300ms"   # Tailwind duration-300 — modals, page transitions
  duration-max:       "500ms"   # Official UX 5.0 hard ceiling
  stagger-max:        "100ms"   # Official UX 5.0 per-step stagger ceiling
  easing-standard:    "cubic-bezier(0.4, 0, 0.2, 1)"   # Tailwind ease-in-out
  easing-emphasized:  "cubic-bezier(0.2, 0, 0, 1)"     # Material Design expressive

# ── COMPONENTS ────────────────────────────────────────────────────────────────
# Light-theme defaults. Dark-theme: replace -light color tokens with -dark.
# All button heights are official Longbridge UX 5.0 values.
components:

  # Primary (Emphasis) Buttons
  button-primary-xl:
    height: "52px"
    backgroundColor: "{colors.brand-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    fontSize: "16px"
    fontWeight: "600"
  button-primary-lg:
    height: "44px"
    backgroundColor: "{colors.brand-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    fontSize: "16px"
    fontWeight: "500"
  button-primary-md:
    height: "36px"
    backgroundColor: "{colors.brand-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    fontSize: "14px"
    fontWeight: "500"
  button-primary-sm:
    height: "28px"
    backgroundColor: "{colors.brand-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
    fontSize: "14px"
    fontWeight: "500"
  button-primary-pressed:
    overlay: "rgba(10,14,25,0.05)"
  button-primary-disabled:
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-tertiary-light}"
    opacity: "0.7"

  # Secondary (Outline) Buttons
  button-secondary-lg:
    height: "44px"
    backgroundColor: "transparent"
    textColor: "{colors.text-primary-light}"
    borderColor: "{colors.divider-light}"
    borderWidth: "1px"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    fontSize: "16px"
    fontWeight: "500"
  button-secondary-sm:
    height: "28px"
    backgroundColor: "transparent"
    textColor: "{colors.text-primary-light}"
    borderColor: "{colors.divider-light}"
    borderWidth: "1px"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
    fontSize: "14px"
    fontWeight: "500"
  button-secondary-pressed:
    overlay: "rgba(10,14,25,0.05)"
    borderColor: "#DBDCDE"
  button-secondary-disabled:
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-tertiary-light}"
    opacity: "0.7"

  # Tertiary (Filled Secondary) Buttons
  button-tertiary-lg:
    height: "44px"
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    fontSize: "16px"
    fontWeight: "500"
  button-tertiary-sm:
    height: "28px"
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
    fontSize: "14px"
    fontWeight: "500"
  button-tertiary-pressed:
    overlay: "rgba(10,14,25,0.05)"
  button-tertiary-disabled:
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-tertiary-light}"
    opacity: "0.7"

  # Ghost (Brand Outline) Buttons — SM size only
  button-ghost-sm:
    height: "28px"
    backgroundColor: "transparent"
    textColor: "{colors.brand-light}"
    borderColor: "{colors.brand-light}"
    borderWidth: "1px"
    rounded: "{rounded.sm}"
    padding: "5px 12px"
    fontSize: "14px"
    fontWeight: "500"
  button-ghost-sm-pressed:
    overlay: "rgba(10,14,25,0.05)"
  button-ghost-sm-disabled:
    backgroundColor: "{colors.bg-secondary-light}"
    textColor: "{colors.text-tertiary-light}"
    opacity: "0.7"

  # Switch
  switch:
    width: "32px"
    height: "32px"
    knobSize: "16px"
    trackRadius: "10px"
    knobRadius: "50%"
    onTrackColor: "rgba(0,184,184,0.25)"
    onKnobColor: "{colors.brand-light}"
    offTrackColor: "rgba(108,110,117,0.25)"
    offKnobColor: "{colors.text-secondary-light}"
    disabledOpacity: "0.5"
    transition: "200ms cubic-bezier(0.4,0,0.2,1)"

  # Checkbox
  checkbox:
    size: "20px"
    hitArea: "20px"
    checkedBackground: "{colors.brand-light}"
    checkedIconColor: "#FFFFFF"
    borderRadius: "1px"
    disabledCheckedBackground: "#A9ABAE"
    uncheckedOpacity: "0.3"

  # Radio
  radio:
    size: "20px"
    hitArea: "20px"
    selectedBorderColor: "{colors.brand-light}"
    selectedBorderWidth: "2px"
    selectedInnerDotColor: "{colors.brand-light}"
    borderRadius: "50%"
    unselectedOpacity: "0.3"
---

## Overview

**Longbridge UX 5.0** is the design system for Longbridge — a professional financial trading and investment platform serving retail and institutional investors across Hong Kong, Singapore, and global markets. The visual identity blends financial precision with modern clarity: high-contrast typography for data legibility, a teal brand accent for interactive elements, and a strict dual-theme (light / dark) that inverts cleanly across every surface.

The system is optimized for information density. Financial data — price tickers, P&L figures, portfolio summaries, order books — must be scannable at a glance. Decorative flourishes are suppressed in favor of clear hierarchy, consistent spacing, and purposeful color use.

### Core Design Principles

1. **Dual-theme symmetry**: Every color token uses a `-light` / `-dark` suffix. Light mode and dark mode are equal citizens — never build exclusively for one.
2. **Teal brand accent**: `{colors.brand-light}` (#00B8B8) in light mode, `{colors.brand-dark}` (#00F0C4) in dark mode. Used on interactive elements (buttons, links, active states, focus rings), never decoratively.
3. **AI module isolation**: The AI module always renders on a dark palette using the `ai-*` token set, regardless of the user's current light/dark preference. `ai-*` tokens are theme-invariant — never override them with `-light`/`-dark` variants.
4. **Status colors are theme-invariant**: `status-up`, `status-down`, `status-error`, `status-warning`, `status-success`, `status-info` are single keys with no suffix. They must not be adjusted per theme.
5. **No tertiary text in body copy**: `{colors.text-tertiary-light}` and `{colors.text-tertiary-dark}` exist only for placeholders and the most subordinate captions. Use `text-secondary-*` for secondary information; use `text-primary-*` for everything that matters.

### Token Naming Convention

Color tokens use a flat `{semantic-name}-{theme}` pattern:

- `brand-light` / `brand-dark` — primary accent color per theme
- `text-primary-light` / `text-primary-dark` — main text per theme
- `bg-primary-light` / `bg-primary-dark` — page background per theme

Status colors and AI tokens are **theme-invariant** (single key, no suffix). The `primary` key is a semantic alias for `brand-light`, required by the design-md linter.

---

## Colors

### Brand & Accent

- **Brand Light** (`{colors.brand-light}` — #00B8B8): The teal brand accent for light mode. Used on primary buttons, active tab indicators, focus rings, brand wordmark, and interactive link colors.
- **Brand Dark** (`{colors.brand-dark}` — #00F0C4): The lighter teal used in dark mode for the same elements. Luminosity is boosted to maintain contrast against dark backgrounds.
- **Brand Aux Light** (`{colors.brand-aux-light}` — #E5F8F8): A very light teal tint used for selected-row highlights, tag backgrounds, and brand-themed surface accents in light mode.
- **Brand Aux Dark** (`{colors.brand-aux-dark}` — #09252A): The deep teal complement for dark-mode brand-themed surfaces — often used as a soft highlight behind selected items in dark theme.

### Text

- **Text Primary** (`{colors.text-primary-light}` — #0A0E19 / `{colors.text-primary-dark}` — #FFFFFF): All primary content — headlines, prices, order quantities, body paragraphs.
- **Text Secondary** (`{colors.text-secondary-light}` — #6C6E75 / `{colors.text-secondary-dark}` — #9D9FA3): Labels, captions, metadata, secondary data columns. Do not use for the main data value in a cell.
- **Text Tertiary** (`{colors.text-tertiary-light}` — #A9ABAE / `{colors.text-tertiary-dark}` — #60626A): ⚠️ **Forbidden for body copy.** Reserved for input placeholder text and the lowest-hierarchy annotations. When in doubt, use secondary instead.

### Backgrounds

- **BG Primary** (`{colors.bg-primary-light}` — #FFFFFF / `{colors.bg-primary-dark}` — #0A0E19): The default page floor. Pure white in light, deep navy-black in dark.
- **BG Secondary** (`{colors.bg-secondary-light}` — #F3F5F6 / `{colors.bg-secondary-dark}` — #232630): Elevated card surfaces, sidebar backgrounds, section bands. One step above the primary background.

### Divider & Border

- **Divider** (`{colors.divider-light}` — #DDDDDF / `{colors.divider-dark}` — #3B3E47): Horizontal rule between rows, separators inside cards.
- **Border** (`{colors.border-light}` — #E6E7E8 / `{colors.border-dark}` — #2C3039): 1px strokes around cards, inputs, data tables. Slightly lighter than divider.

### Status (Theme-Invariant)

All status colors carry the same hex in both light and dark mode. Do not override with `-light`/`-dark` variants.

| Token | Value | Use |
|---|---|---|
| `{colors.status-up}` | #00ADA2 | Price up / positive P&L — teal-green |
| `{colors.status-down}` | #FF3A75 | Price down / negative P&L — rose |
| `{colors.status-error}` | #F7415F | Form error, system alert |
| `{colors.status-warning}` | #FF9728 | Warning callout, pending state |
| `{colors.status-success}` | #00CC92 | Order filled, deposit confirmed |
| `{colors.status-info}` | #2A99FE | Informational tooltip, news badge |

### AI Module (Theme-Invariant, Always Dark)

The AI module ignores the user's light/dark preference and always renders on a dark palette. Use only `ai-*` tokens within AI-designated surfaces.

| Token | Value | Role |
|---|---|---|
| `{colors.ai-brand}` | #00F0C4 | AI accent — same as brand-dark |
| `{colors.ai-brand-aux}` | #09252A | AI accent auxiliary background |
| `{colors.ai-bg-primary}` | #0A0E19 | AI surface base |
| `{colors.ai-bg-secondary}` | #232630 | AI card / elevated surface |
| `{colors.ai-text-primary}` | #FFFFFF | AI primary text |
| `{colors.ai-text-secondary}` | #9D9FA3 | AI secondary text |
| `{colors.ai-text-tertiary}` | #60626A | AI placeholder / low-hierarchy |
| `{colors.ai-divider}` | #3B3E47 | AI row separator |
| `{colors.ai-border}` | #2C3039 | AI card border |

---

## Typography

### Font Families

The system uses three families, each assigned to a distinct semantic role:

| Family | Role | Fallback |
|---|---|---|
| **Cera Pro** | Display / Marketing headlines | `Inter, -apple-system, sans-serif` |
| **Inter** | Interface headings, body copy, button labels | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| **SF Pro Display** | Financial numbers — prices, P&L, quantities | `Inter, -apple-system, sans-serif` |

**Cera Pro** anchors the brand voice on marketing and landing surfaces. Its geometric precision reads confidently at large display sizes.

**Inter** handles all interface text. Its optimized legibility at small sizes (12–16px) is essential for data-dense trading views.

**SF Pro Display** is used exclusively for financial numbers that need to be compared across rows — tabular figures, ticker prices, portfolio values. Its optically consistent digits prevent misreading when scanning rapidly.

### Hierarchy

| Token | Family | Size | Weight | Line Height | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | Cera Pro | 48px | 700 | 52px | Marketing hero headline |
| `{typography.display-lg}` | Cera Pro | 36px | 700 | 40px | Section header, product page H1 |
| `{typography.display-md}` | Cera Pro | 30px | 600 | 36px | Sub-section header |
| `{typography.heading-xl}` | Inter | 24px | 600 | 32px | Modal title, primary page heading |
| `{typography.heading-lg}` | Inter | 20px | 600 | 28px | Card title, panel heading |
| `{typography.heading-md}` | Inter | 18px | 600 | 28px | Section sub-heading, form group title |
| `{typography.body-lg}` | Inter | 16px | 400 | 24px | Primary body / form labels |
| `{typography.body-md}` | Inter | 14px | 400 | 20px | Default body text, table cells |
| `{typography.body-sm}` | Inter | 12px | 400 | 16px | Captions, timestamps, footnotes |
| `{typography.button-xl-label}` | Inter | 16px | 600 | 21px | XL primary button label |
| `{typography.button-lg}` | Inter | 16px | 500 | 21px | LG button label |
| `{typography.button-md}` | Inter | 14px | 500 | 18px | MD / SM button label |
| `{typography.number-lg}` | SF Pro Display | 24px | 600 | 32px | Hero price, portfolio total |
| `{typography.number-md}` | SF Pro Display | 18px | 500 | 28px | Watchlist price, position value |
| `{typography.number-sm}` | SF Pro Display | 14px | 400 | 20px | Table price cell, small ticker |

### Principles

- Display sizes use **Cera Pro weight 700 or 600** — never weight 400. The geometric boldness is the brand signal.
- Interface body stays **Inter weight 400** for paragraphs and **weight 500 or 600** for labels and headings.
- Financial numbers always use **SF Pro Display** — mixing Inter numbers in a price column creates optical inconsistency that slows scanning.
- Do not specify `letter-spacing` unless correcting a specific rendering issue. The system carries no global letter-spacing values.

### Note on Font Availability

Cera Pro is a licensed typeface. If unavailable, use **Inter Bold** as a substitute — it loses the geometric character but maintains legibility. SF Pro Display is a system font on Apple platforms; on other platforms fall back to **Inter** with `font-variant-numeric: tabular-nums` to preserve column alignment.

---

## Layout

### Spacing System

- **Base unit:** 4px (Tailwind convention).
- All spacing values derive from multiples of 4px. Half-unit (2px = `{spacing.0.5}`) is available for micro-adjustments in compact table rows.

| Token | Value | Key Use |
|---|---|---|
| `{spacing.0}` | 0px | Reset |
| `{spacing.0.5}` | 2px | Micro gap, icon-to-label offset |
| `{spacing.1}` | 4px | Inline icon margin, tight list gap |
| `{spacing.2}` | 8px | Row gap in dense data tables |
| `{spacing.3}` | 12px | SM button horizontal padding |
| `{spacing.4}` | 16px | LG button h-padding, section column gap |
| `{spacing.5}` | 20px | Card internal padding |
| `{spacing.6}` | 24px | XL button h-padding, module-to-module gap |
| `{spacing.8}` | 32px | Between major card groups |
| `{spacing.10}` | 40px | Large section vertical padding |
| `{spacing.12}` | 48px | Panel top padding |
| `{spacing.16}` | 64px | Page section top/bottom padding |
| `{spacing.20}` | 80px | — |
| `{spacing.24}` | 96px | Maximum section rhythm (marketing pages) |

### Grid & Container

- **Max content width:** 1440px centered for trading views; 1200px for marketing pages.
- **Trading layout:** Left sidebar (watchlist / navigation) + center main pane + optional right drawer. The pane sizes are fluid, not fixed-column.
- **Data tables:** Full-width within their container; column widths sized to content with sticky first column where row identity matters.
- **Card grids:** 3-up at desktop (≥1024px), 2-up at tablet (768–1023px), 1-up at mobile (<768px).

### Information Density

Financial views operate at higher density than general SaaS products. Acceptable minimum row height for data tables is 32px (`{spacing.8}`) with 8px (`{spacing.2}`) vertical cell padding. Hover states reveal inline actions to avoid permanent clutter.

---

## Elevation & Depth

Depth is expressed through background color contrast and controlled shadow use. The light/dark shadow scales are calibrated separately — dark mode surfaces cast slightly heavier shadows because the contrast between surface and shadow is lower.

### Shadow Scale

| Token | Light | Dark | Use |
|---|---|---|---|
| `{shadows.card-light}` / `{shadows.card-dark}` | `0px 2px 8px rgba(0,0,0,0.08)` | `0px 2px 8px rgba(0,0,0,0.24)` | Data cards, widget panels |
| `{shadows.collapsed-light}` / `{shadows.collapsed-dark}` | `0px 1px 4px rgba(0,0,0,0.06)` | `0px 1px 4px rgba(0,0,0,0.18)` | Collapsed/minimized panels |
| `{shadows.dropdown-light}` / `{shadows.dropdown-dark}` | `0px 4px 12px rgba(0,0,0,0.12)` | `0px 4px 12px rgba(0,0,0,0.32)` | Dropdowns, select menus, tooltips |

### Z-Index Stack

| Token | Value | Layer |
|---|---|---|
| `{zIndex.base}` | 0 | Normal document flow |
| `{zIndex.dropdown}` | 10 | Dropdowns, tooltips, popovers |
| `{zIndex.sticky}` | 20 | Sticky table headers, sticky nav bars |
| `{zIndex.fixed}` | 30 | Fixed navigation, persistent sidebars |
| `{zIndex.overlay}` | 40 | Modal backdrops, drawer backdrops |
| `{zIndex.modal}` | 50 | Modals, sheets, toasts (shadcn dialog default) |

### Elevation Philosophy

- **Color-block first**: Background color difference between `bg-primary` and `bg-secondary` conveys the first elevation step without shadows.
- **Shadows for floating elements**: Only dropdowns, tooltips, and modals use shadow. Cards sitting in normal flow use background color, not shadow.
- **No hover shadows**: Interactive cards signal hover through a background tint shift or border color change — not shadow growth.

---

## Shapes

Longbridge UX 5.0 uses only three border-radius values, each with a precise semantic assignment.

### Border Radius Scale

| Token | Value | Exclusive Use |
|---|---|---|
| `{rounded.sm}` | 6px | Buttons, inputs, tabs, dropdowns, data cards, charts, badges |
| `{rounded.md}` | 12px | **AI scenario cards only** — do not use for general UI |
| `{rounded.lg}` | 18px | **Sheet / drawer top corners only** |

**Do not introduce intermediate values** (e.g., 8px, 10px, 14px). The constraint is intentional — a uniform corner radius across all standard UI elements creates a coherent, disciplined visual rhythm appropriate for a financial product.

The AI card's 12px radius visually distinguishes the AI module from standard data surfaces at a glance, even before reading the content. The sheet 18px rounds only the top two corners (bottom corners are flush with the viewport edge).

---

## Motion

### Duration Tokens

All animation durations must stay at or below `{motion.duration-max}` (500ms). Per-element stagger increments must not exceed `{motion.stagger-max}` (100ms).

| Token | Value | Use |
|---|---|---|
| `{motion.duration-fast}` | 150ms | Hover micro-interactions, icon state changes |
| `{motion.duration-base}` | 200ms | Standard transitions — the shadcn default |
| `{motion.duration-slow}` | 300ms | Modals opening, page-level transitions |
| `{motion.duration-max}` | 500ms | **Official UX 5.0 hard ceiling** — never exceed |
| `{motion.stagger-max}` | 100ms | **Official UX 5.0 per-step stagger ceiling** |

### Easing

| Token | Value | Use |
|---|---|---|
| `{motion.easing-standard}` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default for all transitions (Tailwind ease-in-out) |
| `{motion.easing-emphasized}` | `cubic-bezier(0.2, 0, 0, 1)` | Sheets, drawers — expressive deceleration |

### Principles

- Real-time price tick animations must use `{motion.duration-fast}` (150ms) or less — slower ticks feel laggy on volatile data.
- Prefer opacity + transform over layout-affecting animations to avoid reflow on dense table views.
- Never animate background-color changes on rows in a live order book — the performance cost is too high.

---

## Components

### Primary Buttons

The primary button carries the teal brand color and signals the highest-priority action on a surface. Only one primary button should be visible in a single viewport region.

**`button-primary-xl`** — Height 52px. Used for modal main actions (e.g., "Confirm Order", "Deposit"). Padding 0 24px. Font 16px / 600.

**`button-primary-lg`** — Height 44px. Used for form submit actions at page level (e.g., "Place Order", "Continue"). Padding 10px 16px. Font 16px / 500.

**`button-primary-md`** — Height 36px. Used for in-context operations on list or table rows (e.g., "Buy", "Sell"). Padding 8px 16px. Font 14px / 500.

**`button-primary-sm`** — Height 28px. Used for secondary inline actions where space is constrained (e.g., within a watchlist row). Padding 5px 12px. Font 14px / 500.

**Pressed state** — All primary sizes: `overlay: rgba(10,14,25,0.05)` darkens the background on press. No separate pressed-color token needed.

**Disabled state** — Background shifts to `{colors.bg-secondary-light}` / `{colors.bg-secondary-dark}`, text shifts to `{colors.text-tertiary-light}` / `{colors.text-tertiary-dark}`, opacity 0.7.

### Secondary Buttons (Outline)

Secondary buttons carry a transparent fill with a 1px divider-color border. Used alongside a primary button to offer a lower-emphasis alternative (e.g., "Cancel" next to "Confirm Order").

**`button-secondary-lg`** — Height 44px. Padding 10px 16px. Font 16px / 500.

**`button-secondary-sm`** — Height 28px. Padding 5px 12px. Font 14px / 500.

**Pressed state** — Border shifts to #DBDCDE plus `rgba(10,14,25,0.05)` overlay.

**Disabled state** — Same pattern as primary disabled.

### Tertiary Buttons (Filled Secondary)

Tertiary buttons use the secondary background color as their fill — no border. Used for low-emphasis actions that do not compete with a primary button (e.g., "Filter", "Export").

**`button-tertiary-lg`** — Height 44px. Background `{colors.bg-secondary-light}`. Padding 10px 16px. Font 16px / 500.

**`button-tertiary-sm`** — Height 28px. Background `{colors.bg-secondary-light}`. Padding 5px 12px. Font 14px / 500.

### Ghost Buttons (Brand Outline)

Ghost buttons have a transparent fill with a teal brand-color border and teal text. Available in SM size only. Used for secondary brand-emphasis actions (e.g., "Learn More", "View Details" on marketing-adjacent surfaces).

**`button-ghost-sm`** — Height 28px. Border `{colors.brand-light}`. Text `{colors.brand-light}`. Padding 5px 12px. Font 14px / 500.

### Form Controls

**`switch`** — Toggle between two states. Track 32px wide, knob 16px diameter. On-state: track `rgba(0,184,184,0.25)` + knob `{colors.brand-light}`. Off-state: track `rgba(108,110,117,0.25)` + knob `{colors.text-secondary-light}`. Transition `200ms cubic-bezier(0.4,0,0.2,1)`.

**`checkbox`** — 20px hit area. Checked: background `{colors.brand-light}`, white check icon, `border-radius: 1px` (nearly square). Unchecked: opacity 0.3. Disabled checked: background #A9ABAE.

**`radio`** — 20px hit area. Selected: 2px border `{colors.brand-light}` + inner dot `{colors.brand-light}`. Unselected: opacity 0.3. Always fully circular.

---

## Do's and Don'ts

### Do

- **Match every -light token with a -dark counterpart.** If you add a new surface color, provide both variants before shipping. Asymmetric theming is a regression.
- **Use `{colors.brand-light}` / `{colors.brand-dark}` for interactive affordances only** — buttons, active states, focus rings, interactive links. Never use teal as a decorative background on arbitrary cards.
- **Use `ai-*` tokens exclusively within AI-designated surfaces.** Do not use `bg-secondary-dark` on an AI card — use `ai-bg-secondary` instead, even if they currently resolve to the same hex.
- **Use `text-secondary-*` for metadata and supporting text.** Reserve `text-primary-*` for the actual data value (price, name, quantity) the user came to read.
- **Apply `{motion.easing-emphasized}` for sheets and drawers** — deceleration reads as the surface sliding into place, not popping.
- **Stick to `{rounded.sm}` (6px) for all standard UI.** Only use `{rounded.md}` (12px) for AI scenario cards and `{rounded.lg}` (18px) for sheet top corners.
- **Use SF Pro Display for all financial numbers in comparison contexts** — watchlists, order books, P&L columns. Consistent digit width prevents misread when scanning.

### Don't

- **Don't use `text-tertiary-*` for body copy or data values.** It's reserved for placeholder text and the lowest-priority annotations. The contrast ratio is insufficient for any content the user needs to read.
- **Don't mix `-light` and `-dark` tokens in the same theme context.** Never write `bg-secondary-dark` on a light-mode page to achieve a "darker look" — use `bg-secondary-light` and adjust the value system-wide if needed.
- **Don't override the AI module with the current theme.** AI surfaces must remain on the dark palette regardless of the user's preference. Do not apply `bg-primary-light` inside an AI card.
- **Don't use status colors for brand decoration.** `status-up` (teal-green) must not substitute for `brand-light` — they exist for semantic roles (price direction) and will confuse users who rely on those colors for trading signals.
- **Don't animate live data rows at every tick.** Animate the delta indicator, not the row background — animating full rows on an active order book causes paint thrashing.
- **Don't exceed `{motion.duration-max}` (500ms) for any transition.** Financial users expect a snappy interface; long animations signal a slow product.
- **Don't introduce new border-radius values.** If a design calls for 8px or 10px, use `{rounded.sm}` (6px) and raise the discrepancy with the design lead.

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Bottom-tab navigation; sidebar collapses to sheet; data tables scroll horizontally; watchlist shows 2-column layout; buttons full-width in modal footers |
| Tablet | 768–1023px | Split-panel layout with collapsible sidebar; 2-up card grids; chart area expands to full width on tap |
| Desktop | 1024–1440px | Full three-pane layout: sidebar + main + optional detail drawer; 3-up card grids; all table columns visible |
| Wide | ≥1440px | Same as desktop, content max-width capped at 1440px; wider gutter breathing room |

### Touch Targets

- All buttons (`button-primary-*`, `button-secondary-*`, `button-tertiary-*`) have a minimum touch target of 44 × 44px via padding extension, even when the visual height is 28px (sm size).
- `{component.switch}` — 32px visual, at least 44px touch target via invisible padding wrapper.
- `{component.checkbox}` and `{component.radio}` — 20px visual, 44px touch target.
- Table row tap area: full row width, minimum 44px height on mobile.

### Collapsing Strategy

- **Sidebar** collapses to an icon rail at tablet, to a bottom sheet at mobile.
- **Data tables** on mobile: sticky first column (instrument name / symbol), remaining columns scroll horizontally. Do not truncate numeric columns — scroll is preferred over data loss.
- **Charts** expand to full available width at all breakpoints; time-axis labels reduce density at smaller widths.
- **Order entry forms** collapse to a bottom sheet on mobile, triggered by a sticky "Buy / Sell" bar at the screen bottom.

### Density Adaptation

Mobile views relax the data density — row height increases from 32px to 44px for thumb-friendliness. Desktop views may reduce to 28px rows in compact mode for power users.

---

## Iteration Guide

1. **Color tokens always need a -light and -dark pair.** The only exceptions are `status-*` and `ai-*` tokens, which are theme-invariant by design. If you add a new semantic color, provide both variants.

2. **Don't inline hex values — always use token references.** Write `{colors.brand-light}`, not `#00B8B8`. This ensures theme switching works without manual find-replace.

3. **Component variants** (`-pressed`, `-disabled`) live as separate entries in `components:`. Never describe hover state — Longbridge components document Default and Pressed/Active states only.

4. **AI module additions** use only `ai-*` tokens in their definitions. If the AI team introduces a new AI component, all color references inside it must pull from `{colors.ai-*}` exclusively.

5. **Button sizes are fixed.** The four heights (52 / 44 / 36 / 28px) are official. Do not create intermediate sizes (e.g., 40px) — if a layout requires a different height, flag it for system review.

6. **Financial number styles use SF Pro Display.** Any new component displaying a price, quantity, percentage, or monetary value should reference `{typography.number-*}` rather than `{typography.body-*}`.

7. **Test both themes before shipping any component.** Light-only testing is a known source of dark-mode regressions. The dual-theme constraint is non-negotiable.

8. **Shadows follow the light/dark naming pattern.** Always add both `{shadows.*-light}` and `{shadows.*-dark}` when defining a new elevation level.

---

## Known Gaps

- **Cera Pro** is a licensed commercial typeface not available as a public web font. The official Longbridge product uses a licensed distribution. In development or prototyping environments, substitute with **Inter** at the corresponding weight — the geometric character is lost but legibility is maintained.

- **SF Pro Display** is a system font available on Apple platforms (macOS, iOS). On Windows and Android, the typeface falls back to **Inter**. To preserve column alignment of financial numbers across platforms, apply `font-variant-numeric: tabular-nums` on the fallback font.

- **⚠️ Tailwind-recommended values**: The following token values are sourced from Tailwind CSS defaults rather than explicit Longbridge UX 5.0 specifications. They may change if official specifications are issued:
  - `typography.*` — font sizes and line heights (Tailwind text-scale)
  - `spacing.*` — all spacing values (Tailwind spacing scale)
  - `motion.duration-*` (except `duration-max` and `stagger-max`, which are official)
  - `motion.easing-standard` (Tailwind ease-in-out)
  - `zIndex.*` (Tailwind z-index scale)

- **Monospace / Code token not declared.** The system does not define a `code` or `mono` typography token. If a component requires monospace text (e.g., a transaction hash, API key display), use the platform system mono font and raise a token request.

- **Dark-mode status color contrast** is not formally audited in this version. `status-down` (#FF3A75) and `status-up` (#00ADA2) should pass AA contrast on `bg-primary-dark` (#0A0E19) — verify before use on smaller text sizes.

- **Animation specifications** for live data streaming (tick flash, price change highlight, orderbook depth animation) are out of scope in this document. These belong in the component-specific motion spec.

- **Form validation states** beyond disabled are not extracted in this version. Error, warning, and success input states require a dedicated form token set.
