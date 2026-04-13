<template>
  <div class="home-wrap">
    <div class="home-hero">
      <h1 class="hero-title">长桥知识库</h1>
      <p class="hero-sub">账户、交易、资金、产品 —— 一站式解答</p>
    </div>
    <div class="cards-grid">
      <a v-for="card in cards" :key="card.path" :href="card.path" class="card">
        <div class="card-accent" :style="{ background: card.color }"></div>
        <div class="card-body">
          <div class="card-icon-wrap" :style="{ background: card.color + '15' }">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ color: card.color }">
              <path :d="card.icon" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-intro">{{ card.intro }}</p>
          <span class="card-link">查看详情 →</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  {
    title: '新手入门',
    intro: '快速上手长桥，完成入金、买入第一只港股，设置股价提醒。',
    path: '/新手入门/',
    color: '#3B82F6',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    title: '开户与账户',
    intro: 'App 下载、账户注册、香港与新加坡开户流程、账户安全设置。',
    path: '/开户与账户/',
    color: '#8B5CF6',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    title: '入金',
    intro: '香港、新加坡各地区入金方式，eDDA、FPS、电汇、ATM 等。',
    path: '/入金/',
    color: '#10B981',
    icon: 'M12 4v16m8-8H4',
  },
  {
    title: '出金',
    intro: '各地区出金操作流程、预计到账时间、资金退款申请说明。',
    path: '/出金/',
    color: '#F59E0B',
    icon: 'M12 20V4M4 12l8 8 8-8',
  },
  {
    title: '资金划转与换汇',
    intro: '账户间资金划转、多币种货币兑换、自动还款规则。',
    path: '/资金划转与换汇/',
    color: '#EC4899',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  },
  {
    title: '股票交易',
    intro: '港股/美股/新加坡市场交易时段、订单类型、交易费用、公司行动。',
    path: '/股票交易/',
    color: '#EF4444',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  {
    title: '衍生品',
    intro: '期权开通、美股期权基础、港股窝轮与牛熊证核心概念。',
    path: '/衍生品/',
    color: '#06B6D4',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: '新股认购',
    intro: 'IPO 申购流程、中签规则、资金冻结与扣款、暗盘交易。',
    path: '/新股认购/',
    color: '#F97316',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
  {
    title: '融资融券',
    intro: '融资额度、保证金计算、Margin Call 机制、融资利息。',
    path: '/融资融券/',
    color: '#64748B',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  },
  {
    title: '基金与理财',
    intro: '基金买卖规则、定投、余额通、闲钱理财、结构化产品。',
    path: '/基金与理财/',
    color: '#14B8A6',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: '行情数据',
    intro: '市场行情浏览、订阅权限、个股深度资料、资金流向、AI 助手。',
    path: '/行情数据/',
    color: '#6366F1',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: '资产与账单',
    intro: '资产总览、持仓查看、现金与基金、盈亏成本计算、结单下载。',
    path: '/资产与账单/',
    color: '#84CC16',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: '活动与奖励',
    intro: '任务中心、邀请活动、抽奖、卡券权益、实物奖品使用指南。',
    path: '/活动与奖励/',
    color: '#F43F5E',
    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
  },
  {
    title: '合规与税务',
    intro: '支持开户国家、CRS 国际税务交换、FATCA、股息税与税表。',
    path: '/合规与税务/',
    color: '#0EA5E9',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: '故障排查',
    intro: '登录、入金、出金、订单提交、DDA 授权等常见问题自助排查。',
    path: '/故障排查/',
    color: '#78716C',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
]
</script>

<style scoped>
.home-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.home-hero {
  text-align: center;
  margin-bottom: 56px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.hero-sub {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
  border-color: transparent;
}

.card-accent {
  height: 4px;
  width: 100%;
  flex-shrink: 0;
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  width: 22px;
  height: 22px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.card-intro {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.card-link {
  font-size: 0.8125rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin-top: 4px;
}

@media (max-width: 960px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-title {
    font-size: 2rem;
  }
}

@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .home-wrap {
    padding: 32px 16px 48px;
  }
  .hero-title {
    font-size: 1.75rem;
  }
}
</style>
