<script setup lang="ts">
import { useBreadcrumb } from '../../composables/useBreadcrumb'
import { useI18n } from '../../../i18n/useI18n'
const { breadcrumbItems } = useBreadcrumb()
const { t } = useI18n()
</script>

<template>
  <div v-if="breadcrumbItems.length > 1" class="pb-2 mb-3">
    <nav class="flex items-center" :aria-label="t('common.breadcrumbAria')">
      <ol class="flex items-center m-0 p-0 list-none">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="flex items-center text-sm"
        >
          <a
            v-if="item.link && index !== breadcrumbItems.length - 1"
            :href="item.link"
            class="text-vp-text3 no-underline transition-colors duration-150 hover:text-vp-text2"
          >
            {{ item.text }}
          </a>
          <span
            v-else
            :class="index === breadcrumbItems.length - 1 ? 'text-vp-text2' : 'text-vp-text3'"
          >{{ item.text }}</span>
          <span v-if="index < breadcrumbItems.length - 1" class="mx-2 text-vp-text3" aria-hidden="true"> / </span>
        </li>
      </ol>
    </nav>
  </div>
</template>
