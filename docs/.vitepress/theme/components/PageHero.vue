<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, inBrowser } from 'vitepress'
import { useBreadcrumb } from '../composables/useBreadcrumb'

const { frontmatter, page } = useData()
const { breadcrumbItems } = useBreadcrumb()

const eyebrow = computed(() =>
  frontmatter.value.category ?? breadcrumbItems.value.at(-2)?.text ?? ''
)
const title = computed(() => frontmatter.value.title || page.value.title)
const lead = computed(() => frontmatter.value.description || '')

const copied = ref(false)

function copyLink() {
  if (!inBrowser || !navigator.clipboard) return
  navigator.clipboard.writeText(window.location.href).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {})
}
</script>

<template>
  <header class="lb-doc-hero" v-if="title">
    <div v-if="eyebrow" class="lb-eyebrow">{{ eyebrow }}</div>
    <div class="lb-title-row">
      <h1 class="lb-title">{{ title }}</h1>
      <button class="lb-copy-btn" @click="copyLink" :title="copied ? '已复制！' : '复制链接'">
        <svg v-if="!copied" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="5" y="5" width="8" height="9" rx="1.5"/>
          <path d="M3 11V3a1 1 0 0 1 1-1h8" stroke-linecap="round"/>
        </svg>
        <span v-else style="font-size:11px">✓</span>
      </button>
    </div>
    <p v-if="lead" class="lb-lead">{{ lead }}</p>
  </header>
</template>
