<template>
  <div class="home-b">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-badge">Knowledge Base</div>
        <h1 class="hero-title">长桥<br>用户知识库</h1>
        <p class="hero-desc">从开户入门到高阶交易，覆盖所有你需要了解的内容</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">15</span>
            <span class="stat-label">知识分类</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">200+</span>
            <span class="stat-label">帮助文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">4</span>
            <span class="stat-label">市场覆盖</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Category sections -->
    <div class="sections">
      <div v-for="group in groups" :key="group.label" class="section">
        <div class="section-header">
          <span class="section-line"></span>
          <h2 class="section-label">{{ group.label }}</h2>
        </div>
        <div class="section-list">
          <a v-for="card in group.items" :key="card.path" :href="card.path" class="item">
            <div class="item-left">
              <span class="item-num">{{ String(card.index).padStart(2, '0') }}</span>
              <div>
                <div class="item-title">{{ card.title }}</div>
                <div class="item-intro">{{ card.intro }}</div>
              </div>
            </div>
            <svg class="item-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const groups = [
  {
    label: '入门与账户',
    items: [
      { index: 1, title: '新手入门', intro: '快速上手，完成入金和第一笔交易', path: '/新手入门/' },
      { index: 2, title: '开户与账户', intro: '注册、开户流程、账户安全设置', path: '/开户与账户/' },
    ],
  },
  {
    label: '资金管理',
    items: [
      { index: 3, title: '入金', intro: 'eDDA、FPS、电汇等各地区入金方式', path: '/入金/' },
      { index: 4, title: '出金', intro: '出金流程、到账时间与退款说明', path: '/出金/' },
      { index: 5, title: '资金划转与换汇', intro: '账户间划转、多币种货币兑换', path: '/资金划转与换汇/' },
    ],
  },
  {
    label: '交易产品',
    items: [
      { index: 6, title: '股票交易', intro: '港美股、新加坡市场规则与订单类型', path: '/股票交易/' },
      { index: 7, title: '衍生品', intro: '期权基础、策略与港股窝轮牛熊证', path: '/衍生品/' },
      { index: 8, title: '新股认购', intro: 'IPO 申购流程、中签与暗盘交易', path: '/新股认购/' },
      { index: 9, title: '融资融券', intro: '融资额度、保证金与 Margin Call', path: '/融资融券/' },
    ],
  },
  {
    label: '财富与资产',
    items: [
      { index: 10, title: '基金与理财', intro: '基金定投、余额通与结构化产品', path: '/基金与理财/' },
      { index: 11, title: '行情数据', intro: '行情订阅、深度资料与 AI 助手', path: '/行情数据/' },
      { index: 12, title: '资产与账单', intro: '持仓总览、盈亏计算与结单下载', path: '/资产与账单/' },
    ],
  },
  {
    label: '其他',
    items: [
      { index: 13, title: '活动与奖励', intro: '任务中心、邀请奖励与卡券使用', path: '/活动与奖励/' },
      { index: 14, title: '合规与税务', intro: 'CRS、FATCA、股息税与税表', path: '/合规与税务/' },
      { index: 15, title: '故障排查', intro: '登录、入金、订单等常见问题排查', path: '/故障排查/' },
    ],
  },
]
</script>

<style scoped>
.home-b {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* Hero */
.hero {
  padding: 72px 0 56px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 56px;
}

.hero-inner {
  max-width: 560px;
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
}

.hero-desc {
  font-size: 1.0625rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 36px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--vp-c-divider);
}

/* Sections */
.sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-line {
  display: block;
  width: 3px;
  height: 18px;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
}

.section-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: var(--vp-c-bg);
  text-decoration: none;
  gap: 16px;
  transition: background 0.15s;
}

.item:hover {
  background: var(--vp-c-bg-soft);
}

.item-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.item-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  padding-top: 2px;
  flex-shrink: 0;
  font-family: monospace;
}

.item-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.item-intro {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.item-arrow {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

.item:hover .item-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .section-list {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 2.25rem;
  }
  .home-b {
    padding: 0 16px 60px;
  }
}
</style>
