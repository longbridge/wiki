<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'

const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))

const tradingItems = [
  { name: '交易市场与规则', en: 'Market & Rules',   link: '/交易市场与规则/' },
  { name: '订单类型',       en: 'Order Types',      link: '/订单类型/' },
  { name: '衍生品',         en: 'Derivatives',      link: '/衍生品/' },
  { name: '新股认购',       en: 'IPO',              link: '/新股认购/' },
  { name: '融资融券',       en: 'Margin Trading',   link: '/融资融券/' },
  { name: '基金与理财',     en: 'Fund & Wealth',    link: '/基金与理财/' },
  { name: '行情服务',       en: 'Market Data',      link: '/行情服务/' },
  { name: '交易费用',       en: 'Trading Fees',     link: '/交易费用/' },
  { name: '公司行动',       en: 'Corporate Action', link: '/公司行动/' },
]

const accountItems = [
  { name: '账户相关',       en: 'Account Setup',    link: '/账户相关/' },
  { name: '入金',           en: 'Deposit',          link: '/入金/' },
  { name: '出金',           en: 'Withdrawal',       link: '/出金/' },
  { name: '资金划转与换汇', en: 'Transfer & FX',    link: '/资金划转与换汇/' },
  { name: '股票转仓',       en: 'Stock Transfer',   link: '/股票转仓/' },
  { name: '资产与账单',     en: 'Assets & Bills',   link: '/资产与账单/' },
  { name: '营销活动与奖励', en: 'Promotions',       link: '/营销活动与奖励/' },
  { name: '故障排查',       en: 'Troubleshooting',  link: '/故障排查/' },
  { name: 'App 功能',       en: 'App Features',     link: '/App功能/' },
  { name: '合规与政策',     en: 'Compliance',       link: '/合规与政策/' },
]
</script>

<template>
  <div class="hp" :class="{ 'hp--in': visible }">

    <!-- 环境背景 -->
    <div class="hp-bg" aria-hidden="true">
      <div class="hp-orb hp-orb-a"></div>
      <div class="hp-orb hp-orb-b"></div>
      <div class="hp-grid"></div>
    </div>

    <!-- 毛玻璃导航栏 -->
    <nav class="hp-nav">
      <div class="hp-nav-w">
        <a :href="withBase('/')" class="hp-logo">
          <span class="hp-logo-pip"></span>
          Longbridge Wiki
        </a>
        <div class="hp-nav-r">
          <a :href="withBase('/交易市场与规则/')" class="hp-navlink">交易</a>
          <a :href="withBase('/账户相关/')" class="hp-navlink">账户</a>
          <a :href="withBase('/App功能/')" class="hp-navlink">产品</a>
        </div>
      </div>
    </nav>

    <!-- 英雄区 -->
    <section class="hp-hero">
      <div class="hp-hero-w">

        <!-- 左侧文案 -->
        <div class="hp-hero-l">
          <div class="hp-pill" style="--d:0s">
            <span class="hp-pip"></span>
            长桥证券 · 知识库
          </div>
          <h1 class="hp-h1" style="--d:0.08s">
            <span>证券业务</span>
            <span class="hp-h1-em">知识中心</span>
          </h1>
          <p class="hp-sub" style="--d:0.16s">
            覆盖账户管理、交易规则、资金操作与产品功能，为用户和 AI 客服提供精准的结构化业务指引。
          </p>
          <div class="hp-stats" style="--d:0.22s">
            <div class="hp-stat">
              <b>19</b>
              <span>知识类目</span>
            </div>
            <div class="hp-stat-rule"></div>
            <div class="hp-stat">
              <b>200+</b>
              <span>帮助文档</span>
            </div>
          </div>
          <div class="hp-ctas" style="--d:0.28s">
            <a :href="withBase('/交易市场与规则/')" class="hp-cta hp-cta-fill">
              开始浏览
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a :href="withBase('/账户相关/')" class="hp-cta hp-cta-ghost">账户管理</a>
          </div>
        </div>

        <!-- 右侧 YAML 终端 -->
        <div class="hp-hero-r" style="--d:0.18s">
          <div class="hp-term">
            <div class="hp-term-bar">
              <div class="hp-tdots">
                <i class="hp-td hp-td-r"></i>
                <i class="hp-td hp-td-y"></i>
                <i class="hp-td hp-td-g"></i>
              </div>
              <span class="hp-term-name">knowledge-base.yaml</span>
            </div>
            <div class="hp-term-body">
              <p class="hp-tline hp-tline-key">
                <span class="hp-tk">trading_system</span><span class="hp-tc">:</span>
              </p>
              <p
                v-for="(item, i) in tradingItems"
                :key="item.link"
                class="hp-tline hp-tline-item"
                :style="{ '--i': i }"
              >
                <span class="hp-td2">-</span>
                <a :href="withBase(item.link)" class="hp-tv">{{ item.name }}</a>
              </p>
              <p class="hp-tline hp-tline-gap"></p>
              <p class="hp-tline hp-tline-key">
                <span class="hp-tk hp-tk-b">account_service</span><span class="hp-tc">:</span>
              </p>
              <p
                v-for="(item, i) in accountItems"
                :key="item.link"
                class="hp-tline hp-tline-item"
                :style="{ '--i': tradingItems.length + i }"
              >
                <span class="hp-td2">-</span>
                <a :href="withBase(item.link)" class="hp-tv">{{ item.name }}</a>
              </p>
              <p class="hp-tline hp-tline-cursor">
                <span class="hp-cursor"></span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 知识卡片 Bento -->
    <section class="hp-kb">
      <div class="hp-kb-w">

        <!-- 交易核心 (3fr) -->
        <div class="hp-kcard hp-kcard-act">
          <header class="hp-khead">
            <span class="hp-ktag hp-ktag-em">Trading System</span>
            <h2 class="hp-kh2">交易核心</h2>
            <p class="hp-kdesc">{{ tradingItems.length }} 个业务模块 · 全市场交易规则与产品</p>
          </header>
          <div class="hp-kitems hp-kitems-3">
            <a
              v-for="item in tradingItems"
              :key="item.link"
              :href="withBase(item.link)"
              class="hp-ki"
            >
              <span class="hp-ki-n">{{ item.name }}</span>
              <span class="hp-ki-e">{{ item.en }}</span>
              <svg class="hp-ki-arr" width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
          <a :href="withBase('/交易市场与规则/')" class="hp-klink hp-klink-em">
            查看交易指南
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

        <!-- 账户服务 (2fr) -->
        <div class="hp-kcard hp-kcard-rew">
          <header class="hp-khead">
            <span class="hp-ktag hp-ktag-in">Account Service</span>
            <h2 class="hp-kh2">账户服务</h2>
            <p class="hp-kdesc">{{ accountItems.length }} 个核心模块 · 全链路账户与资金管理</p>
          </header>
          <div class="hp-kitems hp-kitems-2">
            <a
              v-for="item in accountItems"
              :key="item.link"
              :href="withBase(item.link)"
              class="hp-ki hp-ki-lg"
            >
              <span class="hp-ki-n">{{ item.name }}</span>
              <span class="hp-ki-e">{{ item.en }}</span>
              <svg class="hp-ki-arr" width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
          <a :href="withBase('/账户相关/')" class="hp-klink hp-klink-in">
            查看账户指南
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>

    <!-- 底部声明 -->
    <section class="hp-note">
      <div class="hp-note-w">
        <p>内容持续更新中，仅供参考，以 App 实际功能为准。</p>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="hp-ft">
      <div class="hp-ft-w">
        <span class="hp-ft-b">Longbridge Wiki</span>
        <span class="hp-ft-sep">·</span>
        <a :href="withBase('/交易市场与规则/')" class="hp-ft-l">交易市场</a>
        <a :href="withBase('/账户相关/')" class="hp-ft-l">账户管理</a>
        <a :href="withBase('/App功能/')" class="hp-ft-l">App 功能</a>
      </div>
    </footer>

  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }
a { color: inherit; }
p, h1, h2, blockquote { margin: 0; }

/* ── 根容器 ─────────────────────────────────── */
.hp {
  min-height: 100dvh;
  background: #07070c;
  color: #f0f0f3;
  font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1;
  overflow-x: hidden;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.hp--in { opacity: 1; }

/* ── 环境背景 ────────────────────────────────── */
.hp-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.hp-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
}
.hp-orb-a {
  width: 700px; height: 700px;
  background: radial-gradient(ellipse, #00B8B8, transparent 70%);
  top: -250px; right: 5%;
}
.hp-orb-b {
  width: 600px; height: 600px;
  background: radial-gradient(ellipse, #4f46e5, transparent 70%);
  bottom: 5%; left: -150px;
}
.hp-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
  background-size: 72px 72px;
}

/* ── 毛玻璃导航 ──────────────────────────────── */
.hp-nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 200;
  border-bottom: 1px solid rgba(255,255,255,0.055);
  background: rgba(7,7,12,0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.hp-nav-w {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 40px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hp-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 15px;
  font-weight: 700;
  color: #ececef;
  text-decoration: none;
  letter-spacing: -0.025em;
  transition: color .2s;
}
.hp-logo:hover { color: #fff; }
.hp-logo-pip {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #00B8B8;
  box-shadow: 0 0 10px rgba(0,184,184,.7);
  flex-shrink: 0;
}
.hp-nav-r { display: flex; gap: 28px; }
.hp-navlink {
  font-size: 13.5px;
  font-weight: 500;
  color: #6b6b7b;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: color .2s;
}
.hp-navlink:hover { color: #d4d4d8; }

/* ── 英雄区 ─────────────────────────────────── */
.hp-hero {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding-top: 58px;
}
.hp-hero-w {
  max-width: 1240px;
  margin: 0 auto;
  padding: 96px 40px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;
  width: 100%;
}

/* 弹性入场动画 */
.hp-pill, .hp-h1, .hp-sub, .hp-stats, .hp-ctas, .hp-hero-r {
  opacity: 0;
  transform: translateY(18px);
}
.hp--in .hp-pill,
.hp--in .hp-h1,
.hp--in .hp-sub,
.hp--in .hp-stats,
.hp--in .hp-ctas,
.hp--in .hp-hero-r {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity .65s cubic-bezier(.16,1,.3,1) var(--d, 0s),
    transform .65s cubic-bezier(.16,1,.3,1) var(--d, 0s);
}

/* 标签胶囊 */
.hp-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(0,184,184,.22);
  border-radius: 100px;
  padding: 5px 13px;
  font-size: 11.5px;
  font-weight: 500;
  color: #00B8B8;
  letter-spacing: .03em;
  margin-bottom: 26px;
}
.hp-pip {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #00B8B8;
  animation: hppip 2.2s ease-in-out infinite;
}
@keyframes hppip {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: .35; transform: scale(.75); }
}

/* 主标题 */
.hp-h1 {
  display: flex;
  flex-direction: column;
  font-size: clamp(44px, 5.5vw, 68px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.04;
  margin-bottom: 22px;
  color: #f0f0f3;
}
.hp-h1-em { color: #00B8B8; }

/* 副标题 */
.hp-sub {
  font-size: 15.5px;
  font-weight: 400;
  color: #636370;
  line-height: 1.65;
  max-width: 420px;
  margin-bottom: 32px;
}

/* 数据统计 */
.hp-stats {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 40px;
}
.hp-stat { display: flex; flex-direction: column; gap: 3px; }
.hp-stat b {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #e8e8ec;
  line-height: 1;
}
.hp-stat span {
  font-size: 11.5px;
  color: #636370;
  letter-spacing: .02em;
  font-weight: 400;
}
.hp-stat-rule {
  width: 1px; height: 30px;
  background: rgba(255,255,255,.08);
}

/* CTA 按钮 */
.hp-ctas { display: flex; align-items: center; gap: 12px; }
.hp-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: all .18s ease;
  user-select: none;
}
.hp-cta:active { transform: scale(.975); }
.hp-cta-fill { background: #00B8B8; color: #07070c; }
.hp-cta-fill:hover { background: #00A5A5; color: #07070c; }
.hp-cta-ghost {
  border: 1px solid rgba(255,255,255,.1);
  color: #909098;
  background: transparent;
}
.hp-cta-ghost:hover {
  border-color: rgba(255,255,255,.18);
  color: #d4d4d8;
  background: rgba(255,255,255,.04);
}

/* ── YAML 终端面板 ──────────────────────────── */
.hp-hero-r {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.hp-term {
  width: 100%;
  max-width: 460px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(15,15,22,.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 32px 72px -16px rgba(0,0,0,.7);
  overflow: hidden;
}
.hp-term-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(255,255,255,.055);
  background: rgba(255,255,255,.025);
}
.hp-tdots { display: flex; gap: 5px; }
.hp-td {
  width: 10px; height: 10px;
  border-radius: 50%;
  display: block;
  font-style: normal;
}
.hp-td-r { background: #ff5f57; }
.hp-td-y { background: #febc2e; }
.hp-td-g { background: #28c840; }
.hp-term-name {
  font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
  font-size: 11px;
  color: #4f4f5e;
}
.hp-term-body {
  padding: 18px 20px 16px;
  font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
  font-size: 12.5px;
  line-height: 1;
}
.hp-tline { padding: 2.5px 0; }
.hp-tline-key { margin-bottom: 2px; }
.hp-tline-gap { height: 8px; }
.hp-tline-cursor { margin-top: 4px; }
.hp-tk { color: #6366f1; font-weight: 600; }
.hp-tk-b { color: #818cf8; }
.hp-tc { color: #636370; }
.hp-tline-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-left: 8px;
  opacity: 0;
  transform: translateX(-6px);
}
.hp--in .hp-tline-item {
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity .4s ease calc(.45s + var(--i, 0) * 0.05s),
    transform .4s ease calc(.45s + var(--i, 0) * 0.05s);
}
.hp-td2 { color: #52525b; }
.hp-tv {
  color: #d4d4d8;
  text-decoration: none;
  transition: color .15s;
}
.hp-tv:hover { color: #00B8B8; }
.hp-cursor {
  display: inline-block;
  width: 7px; height: 14px;
  background: #00B8B8;
  border-radius: 1.5px;
  animation: hpcur 1.1s step-end infinite;
}
@keyframes hpcur {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Bento 知识卡片 ─────────────────────────── */
.hp-kb {
  position: relative;
  z-index: 1;
  padding-bottom: 100px;
}
.hp-kb-w {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
  align-items: start;
}
.hp-kcard {
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.065);
  background: rgba(255,255,255,.018);
  padding: 32px;
  transition: border-color .25s;
}
.hp-kcard-act:hover { border-color: rgba(0,184,184,.2); }
.hp-kcard-rew:hover { border-color: rgba(99,102,241,.2); }

.hp-khead { margin-bottom: 24px; }
.hp-ktag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 100px;
  margin-bottom: 10px;
}
.hp-ktag-em {
  background: rgba(0,184,184,.1);
  color: #00B8B8;
  border: 1px solid rgba(0,184,184,.18);
}
.hp-ktag-in {
  background: rgba(99,102,241,.1);
  color: #818cf8;
  border: 1px solid rgba(99,102,241,.18);
}
.hp-kh2 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.035em;
  color: #ececef;
  margin-bottom: 6px;
}
.hp-kdesc { font-size: 12.5px; color: #4e4e5e; }

.hp-kitems {
  display: grid;
  gap: 7px;
  margin-bottom: 24px;
}
.hp-kitems-3 { grid-template-columns: repeat(3, 1fr); }
.hp-kitems-2 { grid-template-columns: repeat(2, 1fr); }

.hp-ki {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 11px 13px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,.044);
  background: rgba(255,255,255,.012);
  text-decoration: none;
  transition: all .18s ease;
  position: relative;
  overflow: hidden;
}
.hp-ki:hover {
  background: rgba(255,255,255,.038);
  border-color: rgba(255,255,255,.09);
  transform: translateY(-1px);
}
.hp-kcard-act .hp-ki:hover {
  border-color: rgba(0,184,184,.22);
  background: rgba(16,185,129,.04);
}
.hp-kcard-rew .hp-ki:hover {
  border-color: rgba(99,102,241,.22);
  background: rgba(99,102,241,.04);
}
.hp-ki-lg { padding: 14px; }
.hp-ki-n {
  font-size: 12.5px;
  font-weight: 600;
  color: #ccccd5;
  letter-spacing: -0.01em;
}
.hp-ki-e { font-size: 10.5px; color: #4e4e5e; }
.hp-ki-arr {
  position: absolute;
  right: 9px; top: 50%;
  transform: translateY(-50%);
  color: #3f3f46;
  opacity: 0;
  transition: opacity .18s, right .18s;
}
.hp-ki:hover .hp-ki-arr { opacity: 1; right: 7px; }

.hp-klink {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 500;
  text-decoration: none;
  transition: gap .18s;
}
.hp-klink-em { color: #00B8B8; }
.hp-klink-in { color: #818cf8; }
.hp-klink:hover { gap: 9px; }

/* ── 底部声明 ─────────────────────────────── */
.hp-note {
  position: relative;
  z-index: 1;
  padding: 40px 40px 60px;
  border-top: 1px solid rgba(255,255,255,.04);
}
.hp-note-w {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}
.hp-note p {
  font-size: 12px;
  color: #3a3a4a;
  line-height: 1.6;
}

/* ── 页脚 ────────────────────────────────── */
.hp-ft {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255,255,255,.04);
  padding: 20px 40px;
}
.hp-ft-w {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12.5px;
  color: #3a3a44;
}
.hp-ft-b { font-weight: 600; color: #505060; }
.hp-ft-sep { color: #2a2a34; }
.hp-ft-l {
  color: #3a3a44;
  text-decoration: none;
  transition: color .18s;
}
.hp-ft-l:hover { color: #717180; }

/* ── 移动端 ──────────────────────────────── */
@media (max-width: 768px) {
  .hp-nav-w { padding: 0 20px; }
  .hp-hero-w {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 72px 20px 60px;
  }
  .hp-hero-r { justify-content: stretch; }
  .hp-term { max-width: 100%; }
  .hp-h1 { font-size: 42px; }
  .hp-sub { max-width: 100%; }
  .hp-kb-w {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
  .hp-kitems-3 { grid-template-columns: repeat(2, 1fr); }
  .hp-note { padding: 40px 20px 50px; }
  .hp-ft { padding: 20px; }
}
</style>
