<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--vp-c-text-1)] text-[var(--vp-c-bg)] hover:opacity-85 active:scale-[0.98]',
        brand:
          'bg-[var(--vp-c-brand-1)] text-white hover:brightness-110 active:scale-[0.97]',
        outline:
          'border border-[var(--vp-c-border)] bg-transparent text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-alt)] hover:border-[var(--vp-c-text-3)]',
        ghost:
          'bg-transparent text-[var(--vp-c-text-2)] hover:text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-alt)]',
        link:
          'bg-transparent text-[var(--vp-c-brand-1)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 rounded-[8px] px-3 text-[12px]',
        default: 'h-9 rounded-[10px] px-4 text-[14px]',
        lg: 'h-11 rounded-[12px] px-5 text-[14px]',
        search: 'h-9 rounded-[10px] px-5 text-[14px] font-semibold',
        pill: 'h-12 rounded-full px-8 text-[14px]',
        'pill-sm': 'h-[30px] rounded-full px-3 text-[13px]',
        icon: 'size-9 rounded-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const className = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <button :class="className" :disabled="disabled">
    <slot />
  </button>
</template>
