<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, inBrowser } from 'vitepress'

const route = useRoute()
const submitted = ref(false)

watch(() => route.path, () => {
  if (!inBrowser) return
  const stored = localStorage.getItem(`lb-feedback:${route.path}`)
  submitted.value = !!stored
}, { immediate: true })

function vote(type: 'up' | 'down') {
  if (!inBrowser) return
  localStorage.setItem(`lb-feedback:${route.path}`, type)
  submitted.value = true
}
</script>

<template>
  <div v-if="!submitted" class="lb-page-feedback">
    <span>这一页对你有帮助吗？</span>
    <button class="lb-pfb-btn" @click="vote('up')">👍 有用</button>
    <button class="lb-pfb-btn" @click="vote('down')">👎 待改进</button>
  </div>
  <div v-else class="lb-page-feedback lb-page-feedback--done">
    感谢你的反馈 ✓
  </div>
</template>
