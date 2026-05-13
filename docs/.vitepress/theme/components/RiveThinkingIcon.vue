<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import { useRiveThemeIcon } from '../composables/useRiveThemeIcon'

const props = defineProps<{ size?: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const { isDark } = useData()
useRiveThemeIcon(canvas, isDark)
</script>

<template>
  <canvas
    ref="canvas"
    class="ai-thinking-rive"
    :width="(props.size ?? 16) * 2"
    :height="(props.size ?? 16) * 2"
    :style="{ width: `${props.size ?? 16}px`, height: `${props.size ?? 16}px` }"
    aria-hidden="true"
  />
</template>
