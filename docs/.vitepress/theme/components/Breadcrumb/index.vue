<template>
  <div v-if="breadcrumbItems.length > 1" class="breadcrumb-container">
    <nav class="breadcrumb" aria-label="面包屑导航">
      <ol class="breadcrumb-list">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="breadcrumb-item"
          :class="{ 'is-current': index === breadcrumbItems.length - 1 }"
        >
          <a
            v-if="item.link && index !== breadcrumbItems.length - 1"
            :href="item.link"
            class="breadcrumb-link"
          >
            {{ item.text }}
          </a>
          <span v-else class="breadcrumb-text">{{ item.text }}</span>
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator" aria-hidden="true"> / </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumb } from '../../composables/useBreadcrumb'

const { breadcrumbItems } = useBreadcrumb()
</script>

<style scoped>
.breadcrumb-container {
  padding: 12px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.breadcrumb-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  transition: color 0.25s;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-dark);
}

.breadcrumb-text {
  color: var(--vp-c-text-2);
}

.breadcrumb-item.is-current .breadcrumb-text {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: var(--vp-c-text-3);
}
</style>
