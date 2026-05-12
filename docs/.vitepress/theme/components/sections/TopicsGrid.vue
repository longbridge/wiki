<script setup lang="ts">
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

const featuredTopic = TOPICS[0]
const restTopics = TOPICS.slice(1)
</script>

<template>
  <section id="topics-section" class="topics">
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
</template>
