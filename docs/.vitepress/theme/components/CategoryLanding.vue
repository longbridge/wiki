<script setup lang="ts">
import { withBase } from 'vitepress'

interface Article {
  title: string
  desc?: string
  path: string
  icon?: string
}

defineProps<{
  title: string
  description?: string
  icon?: string
  articles: Article[]
  relatedLinks?: Array<{ label: string; path: string }>
}>()
</script>

<template>
  <div class="cat-landing">
    <div class="cat-landing__header">
      <div v-if="icon" class="cat-landing__icon">{{ icon }}</div>
      <div class="cat-landing__meta">
        <h1 class="cat-landing__title">{{ title }}</h1>
        <p v-if="description" class="cat-landing__desc">{{ description }}</p>
      </div>
    </div>

    <div class="cat-landing__articles">
      <a
        v-for="article in articles"
        :key="article.path"
        :href="withBase(article.path)"
        class="cat-landing__article"
      >
        <div class="cat-landing__article-icon">{{ article.icon ?? '📄' }}</div>
        <div class="cat-landing__article-content">
          <div class="cat-landing__article-title">{{ article.title }}</div>
          <div v-if="article.desc" class="cat-landing__article-desc">{{ article.desc }}</div>
        </div>
        <svg class="cat-landing__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <div v-if="relatedLinks?.length" class="cat-landing__related">
      <h3 class="cat-landing__related-title">相关内容</h3>
      <div class="cat-landing__related-links">
        <a
          v-for="link in relatedLinks"
          :key="link.path"
          :href="withBase(link.path)"
          class="cat-landing__related-link"
        >{{ link.label }} →</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-landing {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--lb-space-xl) var(--lb-space-lg);
}

.cat-landing__header {
  display: flex;
  align-items: flex-start;
  gap: var(--lb-space-lg);
  margin-bottom: var(--lb-space-xl);
  padding-bottom: var(--lb-space-xl);
  border-bottom: 1px solid var(--lb-border);
}

.cat-landing__icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.cat-landing__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--lb-text);
  margin: 0 0 var(--lb-space-xs);
}

.cat-landing__desc {
  font-size: 1rem;
  color: var(--lb-text-soft);
  margin: 0;
  line-height: 1.6;
}

.cat-landing__articles {
  display: flex;
  flex-direction: column;
  gap: var(--lb-space-sm);
  margin-bottom: var(--lb-space-xl);
}

.cat-landing__article {
  display: flex;
  align-items: center;
  gap: var(--lb-space-md);
  padding: var(--lb-space-md);
  background: var(--lb-card-bg);
  border: 1px solid var(--lb-card-border);
  border-radius: var(--lb-card-radius);
  text-decoration: none;
  color: var(--lb-text);
  transition: var(--lb-transition);
}

.cat-landing__article:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--lb-card-shadow-hover);
}

.cat-landing__article-icon { font-size: 1.25rem; flex-shrink: 0; }
.cat-landing__article-content { flex: 1; }
.cat-landing__article-title { font-weight: 500; }
.cat-landing__article-desc { font-size: 0.85rem; color: var(--lb-text-soft); margin-top: 2px; }

.cat-landing__arrow {
  width: 16px;
  height: 16px;
  color: var(--lb-text-mute);
  transition: var(--lb-transition);
}

.cat-landing__article:hover .cat-landing__arrow { color: var(--vp-c-brand-1); }

.cat-landing__related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--lb-text-soft);
  margin-bottom: var(--lb-space-sm);
}

.cat-landing__related-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--lb-space-sm);
}

.cat-landing__related-link {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: var(--lb-radius-full);
  background: var(--vp-c-brand-soft);
  transition: var(--lb-transition);
}

.cat-landing__related-link:hover { background: var(--vp-c-brand-1); color: white; }
</style>
