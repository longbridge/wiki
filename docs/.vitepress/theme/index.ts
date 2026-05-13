import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import 'markstream-vue/index.css'
import './tailwind.css'
import Layout from './layouts/Layout.vue'
import HomeCards from './components/HomeCards.vue'
import Tabs from './components/Tabs.vue'
import TabItem from './components/TabItem.vue'
import LinkGraph from './components/LinkGraph.vue'
import HomeSupport from './components/HomeSupport.vue'
import HomeNavbar from './components/HomeNavbar.vue'
import { i18n } from '../i18n'

// Register Cmd/Ctrl+K interceptor BEFORE any VitePress component mounts,
// so our handler always wins the capture-phase race.
if (inBrowser) {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      e.stopImmediatePropagation()
      window.dispatchEvent(new CustomEvent('lb:search:toggle'))
    }
  }, { capture: true, passive: false })
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(i18n)
    app.component('HomeSupport', HomeSupport)
    app.component('HomeNavbar', HomeNavbar)
    app.component('HomeCards', HomeCards)
    app.component('Tabs', Tabs)
    app.component('TabItem', TabItem)
    app.component('LinkGraph', LinkGraph)
  },
} satisfies Theme
