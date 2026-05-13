<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'radix-vue'
import { useI18n } from '../../../i18n/useI18n'

defineProps<{
  modelValue: string
  tabs: { value: string; label: string }[]
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <TabsList
      class="inline-flex items-center rounded-[10px] bg-vp-bg-soft p-[3px] gap-[2px]"
      :aria-label="t('market.switchAriaLabel')"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="
          relative px-4 py-1.5 text-[13px] font-medium rounded-[8px]
          text-vp-text2 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
          select-none cursor-pointer outline-none
          hover:text-vp-text1
          data-[state=active]:bg-vp-bg data-[state=active]:text-brand data-[state=active]:shadow-sm
        "
      >
        {{ t(tab.label) }}
      </TabsTrigger>
    </TabsList>
    <slot />
  </TabsRoot>
</template>
