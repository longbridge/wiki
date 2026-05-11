<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { data as _topicCountsRaw } from '../../../topic-counts.data'
import type { TopicKey, TopicCounts } from '../../../topic-counts.data'
import {
  Zap, User, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight,
  TrendingUp, Shield, Gift, ClipboardList,
} from 'lucide-vue-next'

const topicCounts = _topicCountsRaw as TopicCounts

const TOPICS: { key: TopicKey; icon: typeof Zap; label: string; path: string }[] = [
  { key: 'getting-started',          icon: Zap,             label: '新手入门',       path: '/getting-started/'        },
  { key: 'account',                  icon: User,            label: '开户与账户',     path: '/account/'                },
  { key: 'deposit',                  icon: ArrowDownCircle, label: '入金',           path: '/deposit/'                },
  { key: 'withdrawal',               icon: ArrowUpCircle,   label: '出金',           path: '/withdrawal/'             },
  { key: 'transfers-and-fx',         icon: ArrowLeftRight,  label: '资金划转与换汇', path: '/transfers-and-fx/'       },
  { key: 'stock-trading',            icon: TrendingUp,      label: '股票交易',       path: '/stock-trading/'          },
  { key: 'compliance-and-tax',       icon: Shield,          label: '合规与税务',     path: '/compliance-and-tax/'     },
  { key: 'rewards',                  icon: Gift,            label: '活动与奖励',     path: '/rewards/'                },
  { key: 'portfolio-and-statements', icon: ClipboardList,   label: '资产与账单',     path: '/portfolio-and-statements/' },
]

const layout = ref<'default' | 'featured-grid'>('default')

function syncLayout() {
  const saved = localStorage.getItem('__tweak_active')
  layout.value = (saved === 'featured-grid') ? 'featured-grid' : 'default'
}

onMounted(() => {
  syncLayout()
  window.addEventListener('__tweak_change', syncLayout)
})

onUnmounted(() => {
  window.removeEventListener('__tweak_change', syncLayout)
})

const featuredTopic = TOPICS[0]
const restTopics = TOPICS.slice(1)
</script>

<template>
  <!-- ── 布局：精选大卡 + 4 列小网格 ── -->
  <section v-if="layout === 'featured-grid'" id="topics-section" class="topics">
    <div class="topics-inner">
      <h2 class="topics-title">9 大专题，系统覆盖</h2>

      <!-- 首位精选大卡 -->
      <a :href="featuredTopic.path" class="featured-card" :aria-label="`${featuredTopic.label}，${topicCounts[featuredTopic.key]} 篇文档`">
        <span class="featured-icon-wrap">
          <component :is="featuredTopic.icon" :size="36" :stroke-width="1.5" />
        </span>
        <div class="featured-body">
          <div class="featured-badge">重点推荐</div>
          <h3 class="featured-name">{{ featuredTopic.label }}</h3>
          <p class="featured-count">{{ topicCounts[featuredTopic.key] }} 篇文档，从这里开始</p>
        </div>
        <span class="featured-arrow">→</span>
      </a>

      <!-- 其余 8 个，4 列小网格 -->
      <div class="small-grid">
        <a
          v-for="t in restTopics"
          :key="t.key"
          :href="t.path"
          class="small-card"
          :aria-label="`${t.label}，${topicCounts[t.key]} 篇文档`"
        >
          <span class="small-icon-wrap">
            <component :is="t.icon" :size="22" :stroke-width="1.5" />
          </span>
          <span class="small-name">{{ t.label }}</span>
          <span class="small-count">{{ topicCounts[t.key] }} 篇</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ── 布局：标准 3 列网格（default）── -->
  <section v-else id="topics-section" class="topics">
    <div class="topics-inner">
      <h2 class="topics-title">9 大专题，系统覆盖</h2>
      <div class="topics-grid">
        <a
          v-for="t in TOPICS"
          :key="t.key"
          :href="t.path"
          class="topic-card"
          :aria-label="`${t.label}，${topicCounts[t.key]} 篇文档`"
        >
          <span class="topic-icon-wrap">
            <component :is="t.icon" :size="24" :stroke-width="1.5" />
          </span>
          <h3 class="topic-name">{{ t.label }}</h3>
          <p class="topic-count">{{ topicCounts[t.key] }} 篇文档</p>
          <span class="topic-link">浏览文档 →</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── 公共 ── */
.topics {
  padding: 80px 24px;
}
.topics-inner {
  max-width: 960px;
  margin: 0 auto;
}
.topics-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 40px;
}

/* ── 标准网格 ── */
.topics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.topic-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 20px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.topic-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 184, 184, 0.12);
  transform: translateY(-2px);
}
.topic-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
.topic-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}
.topic-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0 0 auto;
}
.topic-link {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  margin-top: 4px;
}
.topic-card:hover .topic-link {
  color: var(--vp-c-brand-1);
}

/* ── 精选大卡布局 ── */
.featured-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px 32px;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none;
  margin-bottom: 16px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.featured-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 28px rgba(0, 184, 184, 0.14);
  transform: translateY(-2px);
}
.featured-icon-wrap {
  width: 68px;
  height: 68px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
.featured-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.featured-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #f59e0b;
  background: #f59e0b1a;
  border-radius: 4px;
  padding: 2px 8px;
  width: fit-content;
  letter-spacing: 0.03em;
}
.featured-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}
.featured-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0;
}
.featured-arrow {
  font-size: 1.4rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color 0.2s;
}
.featured-card:hover .featured-arrow {
  color: var(--vp-c-brand-1);
}
.small-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.small-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 18px 16px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.small-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(0, 184, 184, 0.1);
  transform: translateY(-2px);
}
.small-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
}
.small-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}
.small-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .topics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .small-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .featured-card {
    padding: 20px;
  }
  .featured-icon-wrap {
    width: 52px;
    height: 52px;
  }
}
@media (max-width: 480px) {
  .topics-grid {
    grid-template-columns: 1fr;
  }
  .small-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .featured-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .featured-arrow {
    display: none;
  }
}
</style>
