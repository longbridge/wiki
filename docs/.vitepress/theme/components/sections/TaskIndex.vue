<script setup lang="ts">
import { ref } from 'vue'
import { categories } from '../../data/journey'
import CategoryTabs from './CategoryTabs.vue'
import TaskGrid from './TaskGrid.vue'

const activeCategory = ref('all')
</script>

<template>
  <div class="task-index">
    <div class="task-index__inner">
      <CategoryTabs
        :categories="categories"
        :active-category="activeCategory"
        @update:active-category="activeCategory = $event"
      />
      <TaskGrid :category-id="activeCategory" />
    </div>
  </div>
</template>

<style scoped>
.task-index {
  padding: 32px 48px 80px;
}

.task-index__inner {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .task-index {
    padding: 32px 24px 72px;
  }
}

@media (max-width: 767px) {
  .task-index {
    padding: 24px 16px 64px;
  }
}
</style>
