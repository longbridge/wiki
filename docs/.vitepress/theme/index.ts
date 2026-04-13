import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './vars.css'
import './sidebar.css'
import HomeCards from './components/HomeCards.vue'
import HomeCardsA from './components/HomeCards_A.vue'
import HomeCardsB from './components/HomeCards_B.vue'
import HomeCardsC from './components/HomeCards_C.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeCards', HomeCards)
    app.component('HomeCardsA', HomeCardsA)
    app.component('HomeCardsB', HomeCardsB)
    app.component('HomeCardsC', HomeCardsC)
  },
} satisfies Theme
