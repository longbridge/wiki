<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from '../components/Breadcrumb/index.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-top>
      <Breadcrumb />
    </template>
  </DefaultTheme.Layout>
</template>
