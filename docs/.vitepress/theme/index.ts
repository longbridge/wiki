import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './vars.css'
import './sidebar.css'
import Layout from './layouts/Layout.vue'
import HomeCards from './components/HomeCards.vue'
import HomeCardsA from './components/HomeCards_A.vue'
import HomeCardsB from './components/HomeCards_B.vue'
import HomeCardsC from './components/HomeCards_C.vue'
import Tabs from './components/Tabs.vue'
import TabItem from './components/TabItem.vue'
import LinkGraph from './components/LinkGraph.vue'
import HomePage from './components/HomePage/index.vue'
import Callout from './components/Callout.vue'
import Steps from './components/Steps.vue'
import Step from './components/Step.vue'
import Video from './components/Video.vue'
import Screenshot from './components/Screenshot.vue'
import RateTable from './components/RateTable.vue'
import Calculator from './components/Calculator.vue'
import AppDeepLink from './components/AppDeepLink.vue'
import CategoryLanding from './components/CategoryLanding.vue'
import ArticleHeader from './components/ArticleHeader.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeCards', HomeCards)
    app.component('HomeCardsA', HomeCardsA)
    app.component('HomeCardsB', HomeCardsB)
    app.component('HomeCardsC', HomeCardsC)
    app.component('Tabs', Tabs)
    app.component('TabItem', TabItem)
    app.component('LinkGraph', LinkGraph)
    app.component('HomePage', HomePage)
    app.component('Callout', Callout)
    app.component('Steps', Steps)
    app.component('Step', Step)
    app.component('Video', Video)
    app.component('Screenshot', Screenshot)
    app.component('RateTable', RateTable)
    app.component('Calculator', Calculator)
    app.component('AppDeepLink', AppDeepLink)
    app.component('CategoryLanding', CategoryLanding)
    app.component('ArticleHeader', ArticleHeader)
  },
} satisfies Theme
