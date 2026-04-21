<script setup lang="ts">
defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger'
  title?: string
}>()
</script>

<template>
  <div class="callout" :class="`callout--${type ?? 'info'}`">
    <div v-if="title" class="callout__title">{{ title }}</div>
    <div class="callout__body"><slot /></div>
  </div>
</template>

<style scoped>
.callout {
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin: var(--space-lg) 0;
  border-left: 3px solid;
  background: var(--bg-soft);
}

.callout--info    { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.callout--tip     { border-color: #10b981;              background: rgba(16,185,129,.08); }
.callout--warning { border-color: #f59e0b;              background: rgba(245,158,11,.08); }
.callout--danger  { border-color: #ef4444;              background: rgba(239,68,68,.08); }

.callout__title {
  font-weight: 600;
  margin-bottom: var(--space-xs);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.callout--info    .callout__title { color: var(--vp-c-brand-1); }
.callout--tip     .callout__title { color: #10b981; }
.callout--warning .callout__title { color: #f59e0b; }
.callout--danger  .callout__title { color: #ef4444; }

.callout__body { color: var(--text); font-size: 0.95rem; line-height: 1.6; }
</style>
