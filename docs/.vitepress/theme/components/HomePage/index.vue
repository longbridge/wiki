<script setup lang="ts">
import AskBox from './AskBox.vue'
import TaskEntry from './TaskEntry.vue'
import DomainGrid from './DomainGrid.vue'
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero__bg" aria-hidden="true" />
      <div class="home-hero__content">
        <p class="home-hero__eyebrow">长桥帮助中心</p>
        <h1 class="home-hero__title">找到你需要的答案</h1>
        <p class="home-hero__sub">账户、资金、交易、合规——每个问题都有答案</p>
        <AskBox />
      </div>
    </section>

    <section class="home-section">
      <div class="home-inner">
        <TaskEntry />
      </div>
    </section>

    <div class="home-divider" />

    <section class="home-section">
      <div class="home-inner">
        <DomainGrid />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.home-hero {
  position: relative;
  overflow: hidden;
  padding: var(--lb-space-3xl) var(--lb-space-xl) var(--lb-space-2xl);
  text-align: center;
}

.home-hero__bg {
  position: absolute;
  inset: 0;
  background: var(--lb-grad-hero);
  z-index: 0;
}

.home-hero__content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--lb-space-md);
}

.home-hero__eyebrow {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin: 0;
}

.home-hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--lb-text);
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.02em;
}

.home-hero__sub {
  font-size: 1.05rem;
  color: var(--lb-text-soft);
  margin: 0;
  max-width: 480px;
}

.home-section {
  padding: var(--lb-space-2xl) var(--lb-space-xl);
}

.home-inner {
  max-width: 960px;
  margin: 0 auto;
}

.home-divider {
  height: 1px;
  background: var(--lb-border-soft);
  margin: 0 var(--lb-space-xl);
}

@media (max-width: 768px) {
  .home-hero {
    padding: var(--lb-space-2xl) var(--lb-space-md) var(--lb-space-xl);
  }

  .home-section {
    padding: var(--lb-space-xl) var(--lb-space-md);
  }

  .home-divider {
    margin: 0 var(--lb-space-md);
  }
}
</style>
