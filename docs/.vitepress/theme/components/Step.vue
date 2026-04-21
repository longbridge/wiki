<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <li class="step">
    <div class="step__header">
      <span class="step__number"></span>
      <span class="step__title">{{ title }}</span>
    </div>
    <div class="step__body"><slot /></div>
  </li>
</template>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md) 0;
  position: relative;
}

.step__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.step__number {
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
  counter-increment: step-counter;
}

.step__number::before {
  content: counter(step-counter);
}

.step__title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text);
}

.step__body {
  padding-left: 32px;
  color: var(--text-soft);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
