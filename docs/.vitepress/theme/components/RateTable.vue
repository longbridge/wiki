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
  <div class="rate-table">
    <div class="rate-table__tabs" role="tablist">
      <button
        v-for="(dim, i) in dimensions"
        :key="dim"
        :class="['rate-table__tab', { 'is-active': active === i }]"
        role="tab"
        :aria-selected="active === i"
        @click="active = i"
      >{{ dim }}</button>
    </div>

    <div class="rate-table__content">
      <table>
        <thead>
          <tr>
            <th>费用项目</th>
            <th>{{ dimensions[active] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.item">
            <td class="rate-table__item">{{ row.item }}</td>
            <td>{{ row[keys[active]] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.rate-table {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: var(--space-lg) 0;
}

.rate-table__tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--bg-soft);
}

.rate-table__tab {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-soft);
  cursor: pointer;
  background: transparent;
  border: none;
  transition: var(--transition);
}

.rate-table__tab.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 600;
}

.rate-table__content table {
  width: 100%;
  border-collapse: collapse;
}

.rate-table__content td,
.rate-table__content th {
  padding: 10px 16px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-soft);
  text-align: left;
}

.rate-table__content th {
  font-weight: 600;
  color: var(--text-soft);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--bg-soft);
}

.rate-table__item { font-weight: 500; color: var(--text); }
.rate-table__content tr:last-child td { border-bottom: none; }
</style>
