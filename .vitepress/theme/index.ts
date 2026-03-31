import DefaultTheme from 'vitepress/theme'
import HomeCards from './HomeCards.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeCards', HomeCards)
  },
} satisfies Theme
