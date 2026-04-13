<template>
  <div class="home-c">
    <div class="banner">
      <div class="banner-inner">
        <h1 class="banner-title">长桥用户知识库</h1>
        <p class="banner-sub">搜索你遇到的问题，或选择一个分类开始浏览</p>
      </div>
    </div>

    <div class="content">
      <div class="grid">
        <a v-for="card in cards" :key="card.path" :href="card.path" class="tile">
          <div class="tile-inner">
            <div class="tile-top">
              <div class="tile-dot" :style="{ background: card.color }"></div>
              <span class="tile-category">{{ card.category }}</span>
            </div>
            <div class="tile-title">{{ card.title }}</div>
            <div class="tile-intro">{{ card.intro }}</div>
            <div class="tile-footer">
              <span class="tile-count">{{ card.count }} 篇文章</span>
              <svg class="tile-arrow" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  { title: '新手入门', intro: '快速上手，完成入金和第一笔交易', path: '/getting-started/', color: '#3B82F6', category: '入门', count: 5 },
  { title: '开户与账户', intro: '注册流程、账户类型与安全设置', path: '/account/', color: '#8B5CF6', category: '账户', count: 12 },
  { title: '入金', intro: '支持 eDDA、FPS、电汇等多种方式', path: '/deposit/', color: '#10B981', category: '资金', count: 18 },
  { title: '出金', intro: '出金操作、到账时间与退款说明', path: '/withdrawal/', color: '#F59E0B', category: '资金', count: 8 },
  { title: '资金划转与换汇', intro: '账户间划转与多币种兑换', path: '/transfers-and-fx/', color: '#EC4899', category: '资金', count: 10 },
  { title: '股票交易', intro: '港美股与新加坡市场完整指南', path: '/stock-trading/', color: '#EF4444', category: '交易', count: 35 },
  { title: '衍生品', intro: '期权、窝轮、牛熊证核心概念', path: '/derivatives/', color: '#06B6D4', category: '交易', count: 20 },
  { title: '新股认购', intro: 'IPO 申购、中签与暗盘交易', path: '/ipo/', color: '#F97316', category: '交易', count: 8 },
  { title: '融资融券', intro: '融资额度、保证金与风控管理', path: '/margin/', color: '#64748B', category: '交易', count: 12 },
  { title: '基金与理财', intro: '基金定投、余额通与结构化产品', path: '/funds-and-wealth/', color: '#14B8A6', category: '财富', count: 22 },
  { title: '行情数据', intro: '订阅权限、深度行情与 AI 助手', path: '/market-data/', color: '#6366F1', category: '数据', count: 10 },
  { title: '资产与账单', intro: '持仓总览、盈亏计算与结单', path: '/portfolio-and-statements/', color: '#84CC16', category: '资产', count: 8 },
  { title: '活动与奖励', intro: '任务中心、邀请活动与卡券权益', path: '/rewards/', color: '#F43F5E', category: '活动', count: 15 },
  { title: '合规与税务', intro: 'CRS、FATCA 与股息税说明', path: '/compliance-and-tax/', color: '#0EA5E9', category: '合规', count: 10 },
  { title: '故障排查', intro: '常见问题自助排查与解决方案', path: '/troubleshooting/', color: '#78716C', category: '支持', count: 12 },
]
</script>

<style scoped>
.home-c {
  --gap: 16px;
}

/* Banner */
.banner {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 64px 24px 56px;
}

.banner-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.banner-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.025em;
  margin: 0 0 12px;
}

.banner-sub {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Content */
.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap);
}

.tile {
  display: block;
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tile:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.tile-inner {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.tile-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.tile-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tile-category {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tile-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.tile-intro {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  flex: 1;
}

.tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.tile-count {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.tile-arrow {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  transition: color 0.15s, transform 0.15s;
}

.tile:hover .tile-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .banner-title {
    font-size: 1.75rem;
  }
  .content {
    padding: 24px 16px 60px;
  }
}
</style>
