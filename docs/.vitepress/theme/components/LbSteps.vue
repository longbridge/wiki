<template>
  <ol class="lb-steps">
    <slot />
  </ol>
</template>

<style scoped>
.lb-steps {
  list-style: none;
  padding: 0 0 0 var(--lb-space-lg);
  margin: var(--lb-space-lg) 0;
  counter-reset: lb-step-counter;
  border-left: 2px solid var(--lb-border);
}
</style>
