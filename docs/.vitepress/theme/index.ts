import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './vars.css'
import './sidebar.css'
import './search.css'
import Layout from './layouts/Layout.vue'
import HomeCards from './components/HomeCards.vue'
import HomeCardsA from './components/HomeCards_A.vue'
import HomeCardsB from './components/HomeCards_B.vue'
import HomeCardsC from './components/HomeCards_C.vue'
import Tabs from './components/Tabs.vue'
import TabItem from './components/TabItem.vue'
import LinkGraph from './components/LinkGraph.vue'
import HomeSupport from './components/HomeSupport.vue'
import HomeNavbar from './components/HomeNavbar.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeSupport', HomeSupport)
    app.component('HomeNavbar', HomeNavbar)
    app.component('HomeCards', HomeCards)
    app.component('HomeCardsA', HomeCardsA)
    app.component('HomeCardsB', HomeCardsB)
    app.component('HomeCardsC', HomeCardsC)
    app.component('Tabs', Tabs)
    app.component('TabItem', TabItem)
    app.component('LinkGraph', LinkGraph)
  },
} satisfies Theme
