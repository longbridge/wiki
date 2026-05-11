<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import DocBackground from '../components/DocBackground.vue'
import HomeNavbar from '../components/HomeNavbar.vue'

const { frontmatter } = useData()

const isDocPage = computed(() => {
  const layout = frontmatter.value.layout
  return !layout || layout === 'doc'
})

const isHomePage = computed(() => frontmatter.value.layout === 'page')

// 首页时在 <html> 上添加 home-page-layout class，以便全局 CSS 隐藏默认 VPNav
function syncClass(val: boolean) {
  if (!inBrowser) return
  document.documentElement.classList.toggle('home-page-layout', val)
}
watch(isHomePage, syncClass, { immediate: true })
onMounted(() => syncClass(isHomePage.value))
onBeforeUnmount(() => {
  if (inBrowser) document.documentElement.classList.remove('home-page-layout')
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <HomeNavbar v-if="isHomePage" />
      <DocBackground v-if="isDocPage" />
    </template>
    <template #doc-top>
      <Breadcrumb />
    </template>
  </DefaultTheme.Layout>
</template>
