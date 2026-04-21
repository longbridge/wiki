<script setup lang="ts">
defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger'
  title?: string
}>()
</script>

<template>
  <div class="lb-callout" :class="`lb-callout--${type ?? 'info'}`">
    <div v-if="title" class="lb-callout__title">{{ title }}</div>
    <div class="lb-callout__body"><slot /></div>
  </div>
</template>

<style scoped>
.lb-callout {
  border-radius: var(--lb-radius-md);
  padding: var(--lb-space-md);
  margin: var(--lb-space-lg) 0;
  border-left: 3px solid;
  background: var(--lb-bg-soft);
}

.lb-callout--info    { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.lb-callout--tip     { border-color: #10b981;              background: rgba(16,185,129,.08); }
.lb-callout--warning { border-color: #f59e0b;              background: rgba(245,158,11,.08); }
.lb-callout--danger  { border-color: #ef4444;              background: rgba(239,68,68,.08); }

.lb-callout__title {
  font-weight: 600;
  margin-bottom: var(--lb-space-xs);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lb-callout--info    .lb-callout__title { color: var(--vp-c-brand-1); }
.lb-callout--tip     .lb-callout__title { color: #10b981; }
.lb-callout--warning .lb-callout__title { color: #f59e0b; }
.lb-callout--danger  .lb-callout__title { color: #ef4444; }

.lb-callout__body { color: var(--lb-text); font-size: 0.95rem; line-height: 1.6; }
</style>
