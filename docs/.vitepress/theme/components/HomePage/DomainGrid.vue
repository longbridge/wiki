<script setup lang="ts">
import { withBase } from 'vitepress'

interface Domain {
  id: string
  label: string
  desc: string
  path: string
  weight: 'primary' | 'secondary' | 'tertiary'
  icon: string
}

const domains: Domain[] = [
  {
    id: 'getting-started', label: '新手入门', weight: 'primary',
    desc: '注册、开户、首次交易全流程',
    path: '/getting-started/', icon: '⚡',
  },
  {
    id: 'account', label: '开户与账户', weight: 'primary',
    desc: '账户类型、开户流程、账户管理',
    path: '/account/', icon: '👤',
  },
  {
    id: 'deposit', label: '入金', weight: 'primary',
    desc: '入金方式、到账时间、最低金额',
    path: '/deposit/', icon: '💳',
  },
  {
    id: 'stock-trading', label: '股票交易', weight: 'primary',
    desc: '交易规则、订单类型、交易费用',
    path: '/stock-trading/', icon: '📈',
  },
  {
    id: 'withdrawal', label: '出金', weight: 'secondary',
    desc: '出金流程与到账时间',
    path: '/withdrawal/', icon: '🏦',
  },
  {
    id: 'transfers-and-fx', label: '资金划转与换汇', weight: 'secondary',
    desc: '账户间划转、货币兑换',
    path: '/transfers-and-fx/', icon: '🔄',
  },
  {
    id: 'derivatives', label: '衍生品', weight: 'secondary',
    desc: '期权、窝轮、牛熊证',
    path: '/derivatives/', icon: '📊',
  },
  {
    id: 'ipo', label: '新股认购', weight: 'secondary',
    desc: 'IPO 认购、中签、资金冻结',
    path: '/ipo/', icon: '⭐',
  },
  {
    id: 'margin', label: '融资融券', weight: 'secondary',
    desc: '保证金交易、融资利率',
    path: '/margin/', icon: '💹',
  },
  {
    id: 'funds-and-wealth', label: '基金与理财', weight: 'secondary',
    desc: '公募基金、余额通',
    path: '/funds-and-wealth/', icon: '🌱',
  },
  {
    id: 'market-data', label: '行情数据', weight: 'tertiary',
    desc: '实时行情、历史数据',
    path: '/market-data/', icon: '📡',
  },
  {
    id: 'portfolio-and-statements', label: '资产与账单', weight: 'tertiary',
    desc: '持仓、盈亏、账单导出',
    path: '/portfolio-and-statements/', icon: '📄',
  },
  {
    id: 'rewards', label: '活动与奖励', weight: 'tertiary',
    desc: '邀请返佣、任务中心',
    path: '/rewards/', icon: '🎁',
  },
  {
    id: 'compliance-and-tax', label: '合规与税务', weight: 'tertiary',
    desc: 'CRS、税务申报',
    path: '/compliance-and-tax/', icon: '🛡️',
  },
  {
    id: 'troubleshooting', label: '故障排查', weight: 'tertiary',
    desc: '常见错误、登录问题',
    path: '/troubleshooting/', icon: '🔧',
  },
  {
    id: 'app-guide', label: 'App 导览', weight: 'tertiary',
    desc: 'App 功能介绍',
    path: '/app-guide/', icon: '📱',
  },
]

const primaryDomains   = domains.filter(d => d.weight === 'primary')
const secondaryDomains = domains.filter(d => d.weight === 'secondary')
const tertiaryDomains  = domains.filter(d => d.weight === 'tertiary')
</script>

<template>
  <div class="domain-grid">
    <h2 class="domain-grid__title">深入了解</h2>
    <p class="domain-grid__sub">按主题浏览所有帮助内容</p>

    <div class="domain-grid__primary">
      <a
        v-for="d in primaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--primary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <div class="domain-card__content">
          <div class="domain-card__label">{{ d.label }}</div>
          <div class="domain-card__desc">{{ d.desc }}</div>
        </div>
        <svg class="domain-card__arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <div class="domain-grid__secondary">
      <a
        v-for="d in secondaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--secondary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <div class="domain-card__label">{{ d.label }}</div>
        <div class="domain-card__desc">{{ d.desc }}</div>
      </a>
    </div>

    <div class="domain-grid__tertiary">
      <a
        v-for="d in tertiaryDomains"
        :key="d.id"
        :href="withBase(d.path)"
        class="domain-card domain-card--tertiary"
      >
        <span class="domain-card__icon">{{ d.icon }}</span>
        <span class="domain-card__label">{{ d.label }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.domain-grid {
  text-align: center;
}

.domain-grid__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-xs);
}

.domain-grid__sub {
  font-size: 0.9rem;
  color: var(--text-mute);
  margin-bottom: var(--space-xl);
}

.domain-grid__primary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (max-width: 640px) {
  .domain-grid__primary { grid-template-columns: 1fr; }
}

.domain-grid__secondary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (max-width: 768px) {
  .domain-grid__secondary { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .domain-grid__secondary { grid-template-columns: 1fr; }
}

.domain-grid__tertiary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

.domain-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  text-decoration: none;
  color: var(--text);
  transition: var(--transition);
  box-shadow: var(--card-shadow);
  text-align: left;
}

.domain-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-2px);
}

.domain-card--primary {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.domain-card--primary .domain-card__icon { font-size: 2rem; flex-shrink: 0; }
.domain-card--primary .domain-card__content { flex: 1; }

.domain-card--primary .domain-card__label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.domain-card--primary .domain-card__desc {
  font-size: 0.85rem;
  color: var(--text-soft);
}

.domain-card__arrow {
  width: 18px;
  height: 18px;
  color: var(--text-mute);
  flex-shrink: 0;
  transition: var(--transition);
}

.domain-card:hover .domain-card__arrow { color: var(--vp-c-brand-1); }

.domain-card--secondary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs);
  padding: var(--space-md);
}

.domain-card--secondary .domain-card__icon { font-size: 1.5rem; }
.domain-card--secondary .domain-card__label { font-weight: 600; font-size: 0.9rem; }
.domain-card--secondary .domain-card__desc { font-size: 0.8rem; color: var(--text-soft); }

.domain-card--tertiary {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.domain-card--tertiary .domain-card__icon { font-size: 1rem; }
</style>
