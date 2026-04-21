<script setup lang="ts">
import { withBase } from 'vitepress'

const tasks = [
  { id: 'open-account',   label: '开户',   icon: '👤', path: '/account/opening/open-account' },
  { id: 'deposit',        label: '入金',   icon: '💰', path: '/deposit/' },
  { id: 'stock-trade',    label: '交易',   icon: '📈', path: '/stock-trading/' },
  { id: 'ipo',            label: '打新股', icon: '⭐', path: '/ipo/' },
  { id: 'tax',            label: '报税',   icon: '📋', path: '/compliance-and-tax/' },
  { id: 'withdrawal',     label: '出金',   icon: '🏦', path: '/withdrawal/' },
]
</script>

<template>
  <div class="task-entry">
    <h2 class="task-entry__title">我正在做…</h2>
    <p class="task-entry__sub">选择你现在要做的事，直接跳转到对应指引</p>
    <div class="task-entry__grid">
      <a
        v-for="task in tasks"
        :key="task.id"
        :href="withBase(task.path)"
        class="task-entry__card"
      >
        <span class="task-entry__icon">{{ task.icon }}</span>
        <span class="task-entry__label">{{ task.label }}</span>
        <svg class="task-entry__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.task-entry {
  text-align: center;
}

.task-entry__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lb-text);
  margin-bottom: var(--lb-space-xs);
}

.task-entry__sub {
  font-size: 0.9rem;
  color: var(--lb-text-mute);
  margin-bottom: var(--lb-space-lg);
}

.task-entry__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--lb-space-md);
  max-width: 720px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .task-entry__grid { grid-template-columns: repeat(2, 1fr); }
}

.task-entry__card {
  display: flex;
  align-items: center;
  gap: var(--lb-space-sm);
  padding: var(--lb-space-md);
  background: var(--lb-card-bg);
  border: 1px solid var(--lb-card-border);
  border-radius: var(--lb-card-radius);
  text-decoration: none;
  color: var(--lb-text);
  font-weight: 500;
  transition: var(--lb-transition);
  box-shadow: var(--lb-card-shadow);
}

.task-entry__card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lb-card-shadow-hover);
  transform: translateY(-2px);
}

.task-entry__icon { font-size: 1.25rem; }
.task-entry__label { flex: 1; text-align: left; }

.task-entry__arrow {
  width: 16px;
  height: 16px;
  color: var(--lb-text-mute);
  transition: var(--lb-transition);
}

.task-entry__card:hover .task-entry__arrow { color: var(--vp-c-brand-1); }
</style>
