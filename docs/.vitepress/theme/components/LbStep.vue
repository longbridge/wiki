<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <li class="lb-step">
    <div class="lb-step__header">
      <span class="lb-step__number"></span>
      <span class="lb-step__title">{{ title }}</span>
    </div>
    <div class="lb-step__body"><slot /></div>
  </li>
</template>

<style scoped>
.lb-step {
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-xs);
  padding: var(--lb-space-md) 0;
  position: relative;
}

.lb-step__header {
  display: flex;
  align-items: center;
  gap: var(--lb-space-sm);
}

.lb-step__number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  counter-increment: lb-step-counter;
}

.lb-step__number::before {
  content: counter(lb-step-counter);
}

.lb-step__title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--lb-text);
}

.lb-step__body {
  padding-left: 32px;
  color: var(--lb-text-soft);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
