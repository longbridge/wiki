<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import DocBackground from '../components/DocBackground.vue'

const { frontmatter } = useData()
const isDocPage = computed(() => {
  const layout = frontmatter.value.layout
  return !layout || layout === 'doc'
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <DocBackground v-if="isDocPage" />
    </template>
    <template #doc-top>
      <Breadcrumb />
    </template>
  </DefaultTheme.Layout>
</template>
