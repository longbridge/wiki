<template>
  <div class="hp">

    <!-- Hero -->
    <section class="hp-hero">
      <h1 class="hp-title">Longbridge Wiki</h1>
      <p class="hp-sub">覆盖账户管理、交易规则、资金操作与产品功能，为投资者提供完整的操作指引</p>
      <p class="hp-disclaimer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        内容持续更新，仅供参考，以 App 实际功能为准
      </p>
    </section>

    <!-- Categories -->
    <div class="hp-grid">
      <div v-for="cat in categories" :key="cat.link" class="hp-cat">
        <a :href="withBase(cat.link)" class="hp-cat-head">
          <span class="hp-cat-icon" v-html="cat.svg" aria-hidden="true"></span>
          <span class="hp-cat-title">{{ cat.title }}</span>
        </a>
        <ul class="hp-cat-links">
          <li v-for="link in cat.links" :key="link.link">
            <a :href="withBase(link.link)">{{ link.text }}</a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'


const S: Record<string, string> = {
  beginner:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  account:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"/></svg>`,
  deposit:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>`,
  withdraw:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V8"/><path d="m17 13-5-5-5 5"/><path d="M4 4h16"/></svg>`,
  exchange:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  transfer:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><polyline points="3.29,7 12,12 20.71,7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,
  market:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="18" y2="22"/><line x1="6" y1="2" x2="6" y2="22"/><rect x="14" y="6" width="8" height="9" rx="1"/><rect x="2" y="9" width="8" height="6" rx="1"/></svg>`,
  orders:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><polyline points="3,6 4,7 6,5"/><polyline points="3,12 4,13 6,11"/><polyline points="3,18 4,19 6,17"/></svg>`,
  derivatives: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>`,
  ipo:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  fund:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,7 13.5,15.5 8.5,10.5 1,18"/><polyline points="16,7 22,7 22,13"/></svg>`,
  margin:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  asset:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  corporate:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12,2 20,7 4,7"/></svg>`,
  quote:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>`,
  fee:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/></svg>`,
  reward:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,12 20,22 4,22 4,12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  support:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  product:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="9" height="9" rx="1.5"/><rect x="13" y="2" width="9" height="9" rx="1.5"/><rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/></svg>`,
  compliance:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>`,
}

const categories = [
  {
    svg: S.beginner,
    title: '新手入门',
    link: '/新手入门/',
    links: [
      { text: '完成首次入金', link: '/新手入门/完成首次入金' },
      { text: '买入第一只港股', link: '/新手入门/买入第一只港股' },
      { text: '设置股价提醒', link: '/新手入门/设置股价提醒' },
    ]
  },
  {
    svg: S.account,
    title: '账户相关',
    link: '/账户相关/',
    links: [
      { text: '开通香港综合账户', link: '/账户相关/开户/开通香港综合账户' },
      { text: '开通新加坡综合账户', link: '/账户相关/开户/开通新加坡综合账户' },
      { text: '登录注册', link: '/账户相关/登录注册/登录注册' },
      { text: '账户安全与常见问题', link: '/账户相关/账户安全/账户常见问题' },
    ]
  },
  {
    svg: S.deposit,
    title: '入金',
    link: '/入金/',
    links: [
      { text: '入金方式总览', link: '/入金/入金总览/入金方式总览' },
      { text: 'FPS 转数快', link: '/入金/香港综合账户入金/FPS转数快' },
      { text: 'eDDA', link: '/入金/香港综合账户入金/eDDA' },
      { text: 'PayNow（新加坡）', link: '/入金/新加坡综合账户入金/PayNow' },
    ]
  },
  {
    svg: S.market,
    title: '股票交易',
    link: '/股票交易/',
    links: [
      { text: '港股交易规则与结算', link: '/股票交易/交易时间与规则/港股交易规则与结算' },
      { text: '美股交易规则与结算', link: '/股票交易/交易时间与规则/美股交易规则与结算' },
      { text: '限价单与市价单', link: '/股票交易/订单类型/限价单与市价单' },
      { text: '附加订单（止盈止损）', link: '/股票交易/订单类型/附加订单' },
    ]
  },
  {
    svg: S.quote,
    title: '行情服务',
    link: '/行情服务/',
    links: [
      { text: '行情权限规则', link: '/行情服务/行情权限规则' },
      { text: '行情数据字段介绍', link: '/行情服务/行情数据字段介绍' },
      { text: '个股 F10 资料', link: '/行情服务/个股F10资料' },
      { text: '资金流向', link: '/行情服务/资金流向' },
    ]
  },
  {
    svg: S.product,
    title: 'App 功能',
    link: '/App功能/',
    links: [
      { text: 'LongbridgeAI 信息助手', link: '/App功能/行情与数据/LongbridgeAI信息助手' },
      { text: '图表交易', link: '/股票交易/桌面端工具/图表交易' },
      { text: '市场深度', link: '/股票交易/桌面端工具/市场深度' },
      { text: '桌面端快捷键', link: '/股票交易/桌面端工具/桌面端快捷键' },
    ]
  },
  {
    svg: S.derivatives,
    title: '衍生品',
    link: '/衍生品/',
    links: [
      { text: '期权基础', link: '/衍生品/美股期权/期权基础' },
      { text: '期权策略', link: '/衍生品/美股期权/期权策略' },
      { text: '窝轮', link: '/衍生品/港股窝轮与牛熊证/窝轮' },
      { text: '牛熊证', link: '/衍生品/港股窝轮与牛熊证/牛熊证' },
    ]
  },
  {
    svg: S.margin,
    title: '融资融券',
    link: '/融资融券/',
    links: [
      { text: '融资额度与保证金规则', link: '/融资融券/融资额度与保证金/融资额度与保证金规则' },
      { text: '追缴保证金规则', link: '/融资融券/融资额度与保证金/追缴保证金规则' },
      { text: '融资利息规则', link: '/融资融券/融资利息/融资利息规则' },
      { text: '账户风控状态', link: '/融资融券/风控管理/账户风控状态' },
    ]
  },
  {
    svg: S.fund,
    title: '基金与理财',
    link: '/基金与理财/',
    links: [
      { text: '香港余额通', link: '/基金与理财/余额通/香港余额通' },
      { text: '新加坡余额通', link: '/基金与理财/余额通/新加坡余额通' },
      { text: '基金买入与卖出规则', link: '/基金与理财/基金/基金买入与卖出规则' },
      { text: '基金定投', link: '/基金与理财/基金/基金定投' },
    ]
  },
  {
    svg: S.ipo,
    title: '新股认购',
    link: '/新股认购/',
    links: [
      { text: '新股申购', link: '/新股认购/新股申购' },
      { text: '暗盘交易', link: '/新股认购/暗盘交易' },
    ]
  },
  {
    svg: S.corporate,
    title: '公司行动',
    link: '/公司行动/',
    links: [
      { text: '派息与特殊派息', link: '/公司行动/派息与特殊派息' },
      { text: '拆合股', link: '/公司行动/拆合股' },
      { text: '供股权派发', link: '/公司行动/供股权派发' },
      { text: '送股与选股派息', link: '/公司行动/送股与选股派息' },
    ]
  },
  {
    svg: S.transfer,
    title: '股票转仓',
    link: '/股票转仓/',
    links: [
      { text: '股票转仓（香港）', link: '/股票转仓/香港市场转仓/股票转仓HK' },
      { text: '各券商转入指引', link: '/股票转仓/香港市场转仓/各券商转入指引' },
      { text: '股票转仓（新加坡）', link: '/股票转仓/新加坡市场转仓/股票转仓SG' },
      { text: '转仓常见问题', link: '/股票转仓/转仓常见问题/转仓常见问题' },
    ]
  },
  {
    svg: S.withdraw,
    title: '出金',
    link: '/出金/',
    links: [
      { text: '网银出金（香港）', link: '/出金/香港综合账户出金/网银出金' },
      { text: '电汇出金', link: '/出金/香港综合账户出金/电汇出金' },
      { text: '网银出金（新加坡）', link: '/出金/新加坡综合账户出金/网银出金' },
      { text: '资金退款', link: '/出金/退款/资金退款' },
    ]
  },
  {
    svg: S.asset,
    title: '资产与账单',
    link: '/资产与账单/',
    links: [
      { text: '资产页面释义', link: '/资产与账单/资产页面/资产页面释义' },
      { text: '盈亏页面释义', link: '/资产与账单/盈亏与成本/盈亏页面释义' },
      { text: '盈亏分析操作指南', link: '/资产与账单/盈亏分析/盈亏分析操作指南' },
      { text: '结单操作与字段解释', link: '/资产与账单/结单/结单操作与字段解释' },
    ]
  },
  {
    svg: S.exchange,
    title: '资金划转与换汇',
    link: '/资金划转与换汇/',
    links: [
      { text: '主子账户资金划转', link: '/资金划转与换汇/资金划转/主子账户资金划转' },
      { text: '跨账号划转', link: '/资金划转与换汇/资金划转/跨账号划转' },
      { text: '香港货币兑换', link: '/资金划转与换汇/货币兑换/香港货币兑换' },
      { text: '自动还款', link: '/资金划转与换汇/货币兑换/自动还款' },
    ]
  },
  {
    svg: S.reward,
    title: '营销活动与奖励',
    link: '/营销活动与奖励/',
    links: [
      { text: '奖励系统概览', link: '/营销活动与奖励/奖励系统/奖励系统概览' },
      { text: '任务中心概览', link: '/营销活动与奖励/任务中心/任务中心概览' },
      { text: '邀请活动', link: '/营销活动与奖励/活动类型/邀请活动' },
      { text: '兑换商城', link: '/营销活动与奖励/任务中心/兑换商城' },
    ]
  },
  {
    svg: S.compliance,
    title: '合规与政策',
    link: '/合规与政策/',
    links: [
      { text: '美股税表与股息税', link: '/合规与政策/税务合规/美股税表与股息税' },
      { text: 'FATCA', link: '/合规与政策/税务合规/FATCA' },
      { text: 'CRS 与 AEOI', link: '/合规与政策/税务合规/CRS与AEOI' },
      { text: 'FATF 与开户支持地区', link: '/合规与政策/平台政策/FATF与开户支持地区' },
    ]
  },
  {
    svg: S.support,
    title: '故障排查',
    link: '/故障排查/',
    links: [
      { text: '入金未到账怎么办', link: '/故障排查/入金未到账怎么办' },
      { text: '订单提交失败怎么办', link: '/故障排查/订单提交失败怎么办' },
      { text: 'App登录失败怎么办', link: '/故障排查/App登录失败怎么办' },
      { text: '期权行权异常怎么办', link: '/故障排查/期权行权异常怎么办' },
    ]
  },
]
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }
a { text-decoration: none; }
p, h1, ul { margin: 0; }

/* ── 容器 ───────────────────────────────────── */
.hp {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

/* ── Hero ───────────────────────────────────── */
.hp-hero {
  text-align: center;
  padding: 56px 0 48px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 40px;
}

.hp-title {
  font-size: clamp(1.9rem, 3.5vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
  line-height: 1.1;
  margin-bottom: 12px;
}

.hp-sub {
  font-size: 0.975rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  max-width: 500px;
  margin: 0 auto 14px;
}

.hp-disclaimer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.775rem;
  color: var(--vp-c-text-3);
  margin: 0;
}
.hp-disclaimer svg { width: 12px; height: 12px; flex-shrink: 0; }


/* ── 分类网格 ────────────────────────────────── */
.hp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 48px;
}

/* 每个分类 */
.hp-cat {
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 分类标题行 */
.hp-cat-head {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  color: inherit;
}
.hp-cat-head:hover .hp-cat-title {
  color: var(--vp-c-brand-1);
}
.hp-cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}
.hp-cat-icon :deep(svg) { width: 17px; height: 17px; }
.hp-cat-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color .12s;
}

/* 子链接列表 */
.hp-cat-links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.hp-cat-links li a {
  font-size: 0.815rem;
  color: var(--vp-c-brand-1);
  line-height: 1.45;
  display: block;
  transition: color .12s;
}
.hp-cat-links li a:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── 响应式 ─────────────────────────────────── */
@media (max-width: 960px) {
  .hp-grid { grid-template-columns: repeat(3, 1fr); column-gap: 32px; }
}
@media (max-width: 680px) {
  .hp-grid { grid-template-columns: repeat(2, 1fr); column-gap: 24px; }
  .hp { padding: 0 20px 56px; }
  .hp-hero { padding: 40px 0 36px; }
}
@media (max-width: 420px) {
  .hp-grid { grid-template-columns: 1fr; }
}
</style>
