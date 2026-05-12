<template>
  <div v-if="breadcrumbItems.length > 1" class="py-3 mb-4 border-b border-vp-divider">
    <nav class="flex items-center" aria-label="面包屑导航">
      <ol class="flex items-center m-0 p-0 list-none">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="flex items-center text-sm"
        >
          <a
            v-if="item.link && index !== breadcrumbItems.length - 1"
            :href="item.link"
            class="text-vp-text2 no-underline transition-colors duration-300 hover:text-vp-text1"
          >
            {{ item.text }}
          </a>
          <span
            v-else
            :class="index === breadcrumbItems.length - 1 ? 'text-vp-text1 font-medium' : 'text-vp-text2'"
          >{{ item.text }}</span>
          <span v-if="index < breadcrumbItems.length - 1" class="mx-2 text-vp-text3" aria-hidden="true"> / </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumb } from '../../composables/useBreadcrumb'

const { breadcrumbItems } = useBreadcrumb()
</script>
