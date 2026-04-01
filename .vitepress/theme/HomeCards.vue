<template>
  <div class="home-container">
    <div class="home-hero">
      <h1 style="padding-bottom: 16px;">Longbridge Wiki</h1>
      <p>查找关于账户、交易、资金及产品功能的完整指引</p>
      <p class="home-disclaimer">⚠️ 本知识库持续建设中，内容仅供参考，实际功能以 App 为准</p>
    </div>

    <div class="home-grid">
      <a
        v-for="card in cards"
        :key="card.link"
        :href="withBase(card.link)"
        class="home-card"
      >
        <div class="card-icon">{{ card.icon }}</div>
        <div class="card-content">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

const cards = [
  {
    icon: '🏦',
    title: '账户相关',
    desc: '开户、销户、账户认证与安全设置',
    link: '/账户相关/',
  },
  {
    icon: '💰',
    title: '入金',
    desc: '银行转账、eDDA、FPS、电汇等入金方式',
    link: '/入金/',
  },
  {
    icon: '💸',
    title: '出金',
    desc: '提取资金、出金方式与到账时间',
    link: '/出金/',
  },
  {
    icon: '🔄',
    title: '资金划转与换汇',
    desc: '账户间资金划转、多币种货币兑换',
    link: '/资金划转与换汇/',
  },
  {
    icon: '📦',
    title: '股票转仓',
    desc: '转入转出操作、各券商转仓指引',
    link: '/股票转仓/',
  },
  {
    icon: '📈',
    title: '交易市场与规则',
    desc: '港股、美股、新加坡市场交易与交收规则',
    link: '/交易市场与规则/',
  },
  {
    icon: '📋',
    title: '订单类型',
    desc: '限价单、条件单、策略订单使用指南',
    link: '/订单类型/',
  },
  {
    icon: '📊',
    title: '衍生品',
    desc: '美股期权、港股窝轮与牛熊证',
    link: '/衍生品/',
  },
  {
    icon: '🎯',
    title: '新股认购',
    desc: '申购流程、中签规则、暗盘交易',
    link: '/新股认购/',
  },
  {
    icon: '💼',
    title: '基金与理财',
    desc: '基金买卖规则、余额通产品说明',
    link: '/基金与理财/',
  },
  {
    icon: '🏛️',
    title: '融资融券',
    desc: '融资额度、保证金计算与风控管理',
    link: '/融资融券/',
  },
  {
    icon: '📄',
    title: '资产与账单',
    desc: '资产页面释义、盈亏分析、结单查询',
    link: '/资产与账单/',
  },
  {
    icon: '🏢',
    title: '公司行动',
    desc: '派息、供股、送股、拆合股处理说明',
    link: '/公司行动/',
  },
  {
    icon: '📡',
    title: '行情服务',
    desc: '行情订阅权限、数据字段释义',
    link: '/行情服务/',
  },
  {
    icon: '💳',
    title: '交易费用',
    desc: '港股美股佣金、平台费与计算示例',
    link: '/交易费用/',
  },
  {
    icon: '🎁',
    title: '营销活动与奖励',
    desc: '任务中心、活动类型、卡券使用指南',
    link: '/营销活动与奖励/',
  },
  {
    icon: '🔧',
    title: '故障排查',
    desc: '网络连接、验证码接收、常见异常处理',
    link: '/故障排查/',
  },
  {
    icon: '⚙️',
    title: '产品功能',
    desc: 'AI 信息助手、桌面端快捷键与图表功能',
    link: '/产品功能/',
  },
  {
    icon: '⚖️',
    title: '合规与政策',
    desc: '税务合规、FATCA、平台隐私政策',
    link: '/合规与政策/',
  },
]
</script>

<style scoped>
.home-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: calc(var(--vp-nav-height) + 48px) 24px 80px;
}

.home-hero {
  text-align: center;
  margin-bottom: 48px;
}

.home-hero h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.home-hero p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

.home-disclaimer {
  font-size: 0.85rem !important;
  color: var(--vp-c-text-3) !important;
  margin-top: 12px;
  padding: 6px 14px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  display: inline-block;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.home-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.home-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-icon {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.card-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
