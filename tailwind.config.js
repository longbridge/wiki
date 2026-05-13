/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    // Only theme source files — Tailwind classes live here
    './docs/.vitepress/theme/**/*.{vue,ts}',
    // Exclude cache, dist, and other generated dirs automatically (no globs for them)
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--vp-c-brand-1)',
          1: 'var(--vp-c-brand-1)',
          2: 'var(--vp-c-brand-2)',
          3: 'var(--vp-c-brand-3)',
          soft: 'var(--vp-c-brand-soft)',
          aux: 'var(--vp-c-brand-aux)',
        },
        vp: {
          text1: 'var(--vp-c-text-1)',
          text2: 'var(--vp-c-text-2)',
          text3: 'var(--vp-c-text-3)',
          divider: 'var(--vp-c-divider)',
          border: 'var(--vp-c-border)',
          'default-soft': 'var(--vp-c-default-soft)',
          bg: 'var(--vp-c-bg)',
          'bg-alt': 'var(--vp-c-bg-alt)',
          'bg-soft': 'var(--vp-c-bg-soft)',
        },
        ai: {
          bg: 'var(--lb-ai-bg)',
          surface: 'var(--lb-ai-surface)',
          border: 'var(--lb-ai-border)',
          divider: 'var(--lb-ai-divider)',
          text1: 'var(--lb-ai-text-1)',
          text2: 'var(--lb-ai-text-2)',
          text3: 'var(--lb-ai-text-3)',
          accent: 'var(--lb-ai-accent)',
          'on-accent': 'var(--lb-ai-on-accent)',
        },
        status: {
          up: 'var(--lb-c-up)',
          down: 'var(--lb-c-down)',
          success: 'var(--lb-c-success)',
          warning: 'var(--lb-c-warning)',
          danger: 'var(--lb-c-danger)',
          info: 'var(--lb-c-info)',
        },
      },
      borderRadius: {
        pill: '12px',
        card: '12px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
