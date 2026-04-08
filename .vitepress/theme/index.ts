import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'
import { useData } from 'vitepress'
import HomeCards from './HomeCards.vue'
import HomeLayout from './HomeLayout.vue'
import type { Theme } from 'vitepress'

const Layout = {
  setup() {
    const { frontmatter } = useData()
    return () =>
      frontmatter.value.layout === 'custom-home'
        ? h(HomeLayout)
        : h(DefaultTheme.Layout)
  },
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeCards', HomeCards)
  },
} satisfies Theme
