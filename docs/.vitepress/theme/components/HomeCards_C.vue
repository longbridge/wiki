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
const CATEGORY_COLORS = {
  blue:    'var(--lb-cat-blue)',
  cyan:    'var(--lb-cat-cyan)',
  teal:    'var(--lb-cat-teal)',
  green:   'var(--lb-cat-green)',
  lime:    'var(--lb-cat-lime)',
  yellow:  'var(--lb-cat-yellow)',
  amber:   'var(--lb-cat-amber)',
  orange:  'var(--lb-cat-orange)',
  red:     'var(--lb-cat-red)',
  pink:    'var(--lb-cat-pink)',
  fuchsia: 'var(--lb-cat-fuchsia)',
  purple:  'var(--lb-cat-purple)',
  violet:  'var(--lb-cat-violet)',
  indigo:  'var(--lb-cat-indigo)',
  slate:   'var(--lb-cat-slate)',
} as const

const cards = [
  { title: '新手入门', intro: '快速上手，完成入金和第一笔交易', path: '/getting-started/', color: CATEGORY_COLORS.blue, category: '入门', count: 5 },
  { title: '开户与账户', intro: '注册流程、账户类型与安全设置', path: '/account/', color: CATEGORY_COLORS.violet, category: '账户', count: 12 },
  { title: '入金', intro: '支持 eDDA、FPS、电汇等多种方式', path: '/deposit/', color: CATEGORY_COLORS.teal, category: '资金', count: 18 },
  { title: '出金', intro: '出金操作、到账时间与退款说明', path: '/withdrawal/', color: CATEGORY_COLORS.amber, category: '资金', count: 8 },
  { title: '资金划转与换汇', intro: '账户间划转与多币种兑换', path: '/transfers-and-fx/', color: CATEGORY_COLORS.pink, category: '资金', count: 10 },
  { title: '股票交易', intro: '港美股与新加坡市场完整指南', path: '/stock-trading/', color: CATEGORY_COLORS.red, category: '交易', count: 35 },
  { title: '衍生品', intro: '期权、窝轮、牛熊证核心概念', path: '/derivatives/', color: CATEGORY_COLORS.cyan, category: '交易', count: 20 },
  { title: '新股认购', intro: 'IPO 申购、中签与暗盘交易', path: '/ipo/', color: CATEGORY_COLORS.orange, category: '交易', count: 8 },
  { title: '融资融券', intro: '融资额度、保证金与风控管理', path: '/margin/', color: CATEGORY_COLORS.slate, category: '交易', count: 12 },
  { title: '基金与理财', intro: '基金定投、余额通与结构化产品', path: '/funds-and-wealth/', color: CATEGORY_COLORS.teal, category: '财富', count: 22 },
  { title: '行情数据', intro: '订阅权限、深度行情与 AI 助手', path: '/market-data/', color: CATEGORY_COLORS.indigo, category: '数据', count: 10 },
  { title: '资产与账单', intro: '持仓总览、盈亏计算与结单', path: '/portfolio-and-statements/', color: CATEGORY_COLORS.lime, category: '资产', count: 8 },
  { title: '活动与奖励', intro: '任务中心、邀请活动与卡券权益', path: '/rewards/', color: CATEGORY_COLORS.red, category: '活动', count: 15 },
  { title: '合规与税务', intro: 'CRS、FATCA 与股息税说明', path: '/compliance-and-tax/', color: CATEGORY_COLORS.cyan, category: '合规', count: 10 },
  { title: '故障排查', intro: '常见问题自助排查与解决方案', path: '/troubleshooting/', color: CATEGORY_COLORS.slate, category: '支持', count: 12 },
]
</script>
