<template>
  <ol class="steps">
    <slot />
  </ol>
</template>

<style scoped>
.steps {
  list-style: none;
  padding: 0 0 0 var(--space-lg);
  margin: var(--space-lg) 0;
  counter-reset: step-counter;
  border-left: 2px solid var(--border);
}
</style>
