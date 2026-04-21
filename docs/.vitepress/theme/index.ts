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
import LbCallout from './components/LbCallout.vue'
import LbSteps from './components/LbSteps.vue'
import LbStep from './components/LbStep.vue'
import LbVideo from './components/LbVideo.vue'
import LbScreenshot from './components/LbScreenshot.vue'
import LbRateTable from './components/LbRateTable.vue'
import LbCalculator from './components/LbCalculator.vue'
import LbAppDeepLink from './components/LbAppDeepLink.vue'

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
    app.component('LbCallout', LbCallout)
    app.component('LbSteps', LbSteps)
    app.component('LbStep', LbStep)
    app.component('LbVideo', LbVideo)
    app.component('LbScreenshot', LbScreenshot)
    app.component('LbRateTable', LbRateTable)
    app.component('LbCalculator', LbCalculator)
    app.component('LbAppDeepLink', LbAppDeepLink)
  },
} satisfies Theme
