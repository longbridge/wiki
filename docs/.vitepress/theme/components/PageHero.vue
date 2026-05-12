<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useBreadcrumb } from '../composables/useBreadcrumb'

const { frontmatter, page } = useData()
const { breadcrumbItems } = useBreadcrumb()

const eyebrow = computed(() =>
  frontmatter.value.category ?? breadcrumbItems.value.at(-2)?.text ?? ''
)
const title = computed(() => frontmatter.value.title || page.value.title)
const lead = computed(() => frontmatter.value.description || '')
</script>

<template>
  <header class="lb-doc-hero" v-if="title">
    <div v-if="eyebrow" class="lb-eyebrow">{{ eyebrow }}</div>
    <h1 class="lb-title">{{ title }}</h1>
    <p v-if="lead" class="lb-lead">{{ lead }}</p>
  </header>
</template>
