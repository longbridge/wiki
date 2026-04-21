<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  dimensions: string[]
  rows: Array<Record<string, string>>
  keys: string[]
}>()

const active = ref(0)
</script>

<template>
  <div class="lb-rate-table">
    <div class="lb-rate-table__tabs" role="tablist">
      <button
        v-for="(dim, i) in dimensions"
        :key="dim"
        :class="['lb-rate-table__tab', { 'is-active': active === i }]"
        role="tab"
        :aria-selected="active === i"
        @click="active = i"
      >{{ dim }}</button>
    </div>

    <div class="lb-rate-table__content">
      <table>
        <thead>
          <tr>
            <th>费用项目</th>
            <th>{{ dimensions[active] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.item">
            <td class="lb-rate-table__item">{{ row.item }}</td>
            <td>{{ row[keys[active]] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.lb-rate-table {
  border: 1px solid var(--lb-border);
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  margin: var(--lb-space-lg) 0;
}

.lb-rate-table__tabs {
  display: flex;
  border-bottom: 1px solid var(--lb-border);
  background: var(--lb-bg-soft);
}

.lb-rate-table__tab {
  flex: 1;
  padding: var(--lb-space-sm) var(--lb-space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--lb-text-soft);
  cursor: pointer;
  background: transparent;
  border: none;
  transition: var(--lb-transition);
}

.lb-rate-table__tab.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 600;
}

.lb-rate-table__content table {
  width: 100%;
  border-collapse: collapse;
}

.lb-rate-table__content td,
.lb-rate-table__content th {
  padding: 10px 16px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--lb-border-soft);
  text-align: left;
}

.lb-rate-table__content th {
  font-weight: 600;
  color: var(--lb-text-soft);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--lb-bg-soft);
}

.lb-rate-table__item { font-weight: 500; color: var(--lb-text); }
.lb-rate-table__content tr:last-child td { border-bottom: none; }
</style>
