<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Scheme {
  id: string
  name: string
  description: string
}

const SCHEMES: Scheme[] = [
  { id: 'default',       name: '标准网格', description: '3 列等宽卡片' },
  { id: 'featured-grid', name: '精选大卡', description: '首个主题大卡 + 4 列小网格' },
]

const active = ref('default')
const open = ref(false)

function switchScheme(id: string) {
  active.value = id
  localStorage.setItem('__tweak_active', id)
  window.dispatchEvent(new CustomEvent('__tweak_change', { detail: { id } }))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  active.value = localStorage.getItem('__tweak_active') ?? 'default'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="tweak-root">
    <button class="tweak-trigger" @click="open = !open" title="UI Tweaks (开发专用)">
      ✦
    </button>
    <Transition name="tweak-fade">
      <div v-if="open" class="tweak-panel">
        <div class="tweak-header">
          <span>UI TWEAKS</span>
          <span class="tweak-badge">DEV</span>
        </div>
        <div class="tweak-section-label">TopicsGrid 布局</div>
        <button
          v-for="scheme in SCHEMES"
          :key="scheme.id"
          class="tweak-scheme"
          :class="{ active: active === scheme.id }"
          @click="switchScheme(scheme.id)"
        >
          <span class="tweak-check">{{ active === scheme.id ? '✓' : '' }}</span>
          <span class="tweak-info">
            <span class="tweak-name">{{ scheme.name }}</span>
            <span class="tweak-desc">{{ scheme.description }}</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tweak-root {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}
.tweak-trigger {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #18181b;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tweak-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.tweak-panel {
  position: absolute;
  bottom: 52px;
  right: 0;
  background: #18181b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 12px;
}
.tweak-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 11px;
  color: #71717a;
  letter-spacing: 0.08em;
}
.tweak-badge {
  font-size: 9px;
  background: #6366f1;
  color: #fff;
  border-radius: 3px;
  padding: 1px 5px;
  letter-spacing: 0.05em;
}
.tweak-section-label {
  font-size: 10px;
  color: #52525b;
  margin-bottom: 6px;
  padding-left: 2px;
}
.tweak-scheme {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #a1a1aa;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.tweak-scheme:hover {
  background: rgba(255,255,255,0.05);
}
.tweak-scheme.active {
  border-color: #6366f1;
  background: rgba(99,102,241,0.12);
  color: #a5b4fc;
}
.tweak-check {
  width: 14px;
  font-size: 11px;
  color: #6366f1;
  flex-shrink: 0;
  padding-top: 1px;
}
.tweak-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tweak-name {
  font-size: 12px;
  font-weight: 600;
  color: inherit;
}
.tweak-desc {
  font-size: 10px;
  color: #52525b;
}
.tweak-scheme.active .tweak-desc {
  color: #818cf8;
}
.tweak-fade-enter-active,
.tweak-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.tweak-fade-enter-from,
.tweak-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
