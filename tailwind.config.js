/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './docs/**/*.{md,vue,ts,js}',
    './docs/.vitepress/**/*.{vue,ts,js}',
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
        },
        vp: {
          text1: 'var(--vp-c-text-1)',
          text2: 'var(--vp-c-text-2)',
          text3: 'var(--vp-c-text-3)',
          divider: 'var(--vp-c-divider)',
          'default-soft': 'var(--vp-c-default-soft)',
          bg: 'var(--vp-c-bg)',
          'bg-alt': 'var(--vp-c-bg-alt)',
        },
      },
      borderRadius: {
        pill: '10px',
        card: '12px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
