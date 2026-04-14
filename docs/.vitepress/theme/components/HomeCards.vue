<template>
  <div class="home">

    <!-- ── Hero ── -->
    <section class="hero">
      <HomeBackground />
      <div class="hero-text">
        <p class="hero-eyebrow">账户 · 资金 · 交易 · 产品功能</p>
        <h1 class="hero-h1"><span class="shimmer-text">Longbridge Wiki</span></h1>
        <p class="hero-sub">
          账户开设、资金进出、交易规则——每一步操作都有说明
        </p>
        <!-- 新用户专属入口 -->
        <div class="hero-onboard">
          <div class="onboard-label">第一次使用长桥？</div>
          <a :href="withBase('/getting-started/')"  class="btn-primary">从新手指引开始 →</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <!-- 知识库搜索结果界面：问题 → 答案 -->
        <svg viewBox="0 0 380 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Browser frame -->
          <rect x="52" y="30" width="276" height="242" rx="16" class="c-bg" stroke="#c4f0ea" stroke-width="1.5"/>
          <!-- Title bar -->
          <rect x="52" y="30" width="276" height="40" rx="16" class="c-sf"/>
          <rect x="52" y="57" width="276" height="13" class="c-sf"/>
          <circle cx="76" cy="50" r="6" fill="#FF2720"/>
          <circle cx="94" cy="50" r="6" fill="#FFC800"/>
          <circle cx="112" cy="50" r="6" fill="#26e2c5"/>
          <!-- Search bar -->
          <rect x="72" y="86" width="236" height="34" rx="9" class="c-alt" stroke="#c4f0ea" stroke-width="1"/>
          <circle cx="91" cy="103" r="7" fill="none" stroke="#7cccbe" stroke-width="1.5"/>
          <line x1="96" y1="108" x2="101" y2="113" stroke="#7cccbe" stroke-width="1.5" stroke-linecap="round"/>
          <!-- query text -->
          <rect x="108" y="99" width="78" height="7" rx="3.5" fill="#7cccbe" opacity="0.45"/>
          <!-- cursor blink -->
          <rect x="189" y="98" width="2" height="10" rx="1" fill="#00b8b8"/>
          <!-- separator -->
          <line x1="72" y1="134" x2="308" y2="134" stroke="#c4f0ea" stroke-width="1" opacity="0.5"/>
          <!-- Result 1 — 账户类 -->
          <rect x="72" y="142" width="236" height="44" rx="8" class="c-alt"/>
          <rect x="84" y="154" width="36" height="17" rx="8.5" fill="#00b8b8" opacity="0.13"/>
          <rect x="89" y="159" width="26" height="5" rx="2.5" fill="#00b8b8" opacity="0.72"/>
          <rect x="128" y="154" width="116" height="7" rx="3.5" fill="#7cccbe" opacity="0.5"/>
          <rect x="128" y="167" width="84" height="5" rx="2.5" class="c-sf"/>
          <path d="M293 163 l5 4 l-5 4" stroke="#7cccbe" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Result 2 — 资金类 -->
          <rect x="72" y="192" width="236" height="44" rx="8" class="c-bg"/>
          <rect x="84" y="204" width="36" height="17" rx="8.5" fill="#FFC800" opacity="0.13"/>
          <rect x="89" y="209" width="26" height="5" rx="2.5" fill="#FFC800" opacity="0.72"/>
          <rect x="128" y="204" width="100" height="7" rx="3.5" fill="#7cccbe" opacity="0.42"/>
          <rect x="128" y="217" width="70" height="5" rx="2.5" class="c-sf"/>
          <path d="M293 213 l5 4 l-5 4" stroke="#c4f0ea" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Result 3 — partial peek -->
          <rect x="72" y="242" width="236" height="24" rx="8" class="c-bg"/>
          <rect x="84" y="250" width="36" height="11" rx="5.5" fill="#7cccbe" opacity="0.1"/>
          <rect x="128" y="251" width="82" height="7" rx="3.5" class="c-sf"/>
          <!-- Checkmark answer badge top-right -->
          <circle cx="301" cy="60" r="24" fill="#c4f0ea" opacity="0.22"/>
          <circle cx="301" cy="60" r="17" fill="#26e2c5"/>
          <path d="M292 60 l6 6 l11-12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Article count pill -->
          <rect x="52" y="12" width="88" height="22" rx="11" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="62" y="21" width="68" height="5" rx="2.5" fill="#7cccbe" opacity="0.55"/>
          <!-- Yellow star accent -->
          <polygon points="342,52 345.5,62 356,62 347.5,68.5 350.5,79 342,72.5 333.5,79 336.5,68.5 328,62 338.5,62" fill="#FFC800"/>
        </svg>
      </div>
    </section>

    <!-- ── 统计数据 ── -->
    <section class="stats-band">
      <div class="stats-inner">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <template v-if="stat.isMarkets">
            <div class="stat-markets">
              <span v-for="m in markets" :key="m.code" class="flag-icon" v-html="flagSvgs[m.code]" />
            </div>
          </template>
          <span v-else class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ── 常见任务快速入口 ── -->
    <section class="tasks">
      <div class="tasks-inner">
        <div class="tasks-hd">
          <span class="tasks-label">常见任务</span>
          <p class="tasks-sub">直接跳转到你需要做的事情</p>
        </div>
        <ul class="tasks-grid">
          <li v-for="task in tasks" :key="task.path">
            <a :href="withBase(task.path)" class="task-link">
              <span class="task-q">{{ task.q }}</span>
              <svg class="task-arrow" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Feature sections ── -->

    <!-- 1. 账户与入门 -->
    <section class="feat">
      <div class="feat-text">
        <span class="feat-tag">入门与账户</span>
        <h2 class="feat-h2">开立账户，完成第一笔交易</h2>
        <div class="feat-bar"></div>
        <p class="feat-desc">
          跟着新手指引，你可以在 30 分钟内完成注册、通过 KYC 身份核验、完成入金并买入第一只股票。
        </p>
        <ul class="feat-links">
          <li><a :href="withBase('/getting-started/')" >如何完成开户与首笔交易</a></li>
          <li><a :href="withBase('/account/')" >香港 / 新加坡开户的要求是什么</a></li>
          <li><a :href="withBase('/account/')" >如何修改账户安全设置</a></li>
        </ul>
      </div>
      <div class="feat-visual" aria-hidden="true">
        <!-- 三步开户流程：注册 → KYC核验 → 首笔交易 -->
        <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="acct-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#c4f0ea"/>
              <stop offset="100%" stop-color="#c4f0ea" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <!-- Background card -->
          <rect x="36" y="26" width="268" height="228" rx="16" class="c-bg" stroke="url(#acct-grad)" stroke-width="1.5"/>
          <!-- Step 1: 注册/ID -->
          <circle cx="88" cy="90" r="28" class="c-sf" stroke="#c4f0ea" stroke-width="1.5"/>
          <!-- ID card icon -->
          <rect x="74" y="79" width="28" height="21" rx="4" class="c-bg" stroke="#7cccbe" stroke-width="1.5"/>
          <circle cx="83" cy="87" r="5" fill="#c4f0ea"/>
          <rect x="82" y="95" width="14" height="3" rx="1.5" class="c-sf"/>
          <!-- Step number badge -->
          <circle cx="108" cy="68" r="10" fill="#00b8b8"/>
          <rect x="104" y="65" width="8" height="6" rx="1.5" fill="white" opacity="0.9"/>
          <!-- Connector 1→2 -->
          <line x1="117" y1="90" x2="143" y2="90" stroke="#c4f0ea" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- Step 2: KYC 核验 (active/highlighted) -->
          <circle cx="170" cy="90" r="28" fill="#c4f0ea" opacity="0.18" stroke="#26e2c5" stroke-width="1.5"/>
          <!-- Face / person icon -->
          <circle cx="170" cy="84" r="11" fill="#7cccbe" opacity="0.42"/>
          <path d="M156 104 C156 93 184 93 184 104" fill="#c4f0ea" opacity="0.45"/>
          <!-- KYC verified tick -->
          <circle cx="190" cy="68" r="11" fill="#26e2c5"/>
          <path d="M184 68 l5 5 l8-9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Connector 2→3 -->
          <line x1="199" y1="90" x2="225" y2="90" stroke="#c4f0ea" stroke-width="1.5" stroke-dasharray="4 3"/>
          <!-- Step 3: 首笔交易 -->
          <circle cx="252" cy="90" r="28" class="c-sf" stroke="#c4f0ea" stroke-width="1.5"/>
          <!-- Mini upward chart -->
          <polyline points="239,101 247,93 256,97 265,80" stroke="#7cccbe" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="265" cy="80" r="4" class="c-bg" stroke="#26e2c5" stroke-width="2"/>
          <!-- Step label bars -->
          <rect x="70" y="130" width="36" height="5" rx="2.5" fill="#00b8b8" opacity="0.45"/>
          <rect x="152" y="130" width="36" height="5" rx="2.5" fill="#26e2c5" opacity="0.6"/>
          <rect x="234" y="130" width="36" height="5" rx="2.5" fill="#7cccbe" opacity="0.5"/>
          <!-- Result card: 账户已开立 -->
          <rect x="50" y="152" width="240" height="84" rx="12" class="c-alt" stroke="#c4f0ea" stroke-width="1"/>
          <!-- Avatar -->
          <circle cx="80" cy="186" r="22" class="c-bg" stroke="#c4f0ea" stroke-width="1"/>
          <circle cx="80" cy="180" r="12" fill="#7cccbe" opacity="0.42"/>
          <path d="M63 202 C63 190 97 190 97 202" class="c-sf"/>
          <!-- Info lines -->
          <rect x="110" y="163" width="76" height="7" rx="3.5" fill="#7cccbe" opacity="0.45"/>
          <rect x="110" y="176" width="140" height="5" rx="2.5" class="c-sf"/>
          <rect x="110" y="187" width="120" height="5" rx="2.5" class="c-sf"/>
          <!-- Approved badge -->
          <rect x="110" y="202" width="80" height="22" rx="11" fill="#26e2c5"/>
          <rect x="120" y="211" width="60" height="4" rx="2" fill="white" opacity="0.85"/>
          <!-- Account type chip -->
          <rect x="200" y="202" width="76" height="22" rx="8" class="c-bg" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="208" y="211" width="60" height="4" rx="2" fill="#c4f0ea"/>
          <!-- Yellow star accent -->
          <polygon points="310,52 313.5,62 324,62 315.5,68.5 318.5,79 310,72.5 301.5,79 304.5,68.5 296,62 306.5,62" fill="#FFC800"/>
        </svg>
      </div>
    </section>

    <!-- 2. 资金管理 (reverse) -->
    <section class="feat feat--reverse">
      <div class="feat-text">
        <span class="feat-tag">资金</span>
        <h2 class="feat-h2">入金、出金与换汇</h2>
        <div class="feat-bar"></div>
        <p class="feat-desc">
          需要存钱进来、把钱取出去，或在账户间转账换汇？这里有 eDDA、FPS、电汇等所有入金方式的操作步骤，以及出金到账时间和多币种兑换说明。
        </p>
        <ul class="feat-links">
          <li><a :href="withBase('/deposit/')" >如何从银行卡向账户入金</a></li>
          <li><a :href="withBase('/withdrawal/')" >出金到账需要多久，如何操作</a></li>
          <li><a :href="withBase('/transfers-and-fx/')" >如何进行账户间划转或外币换汇</a></li>
        </ul>
      </div>
      <div class="feat-visual" aria-hidden="true">
        <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fund-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#c4f0ea"/>
              <stop offset="100%" stop-color="#c4f0ea" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <!-- Left: bank card -->
          <rect x="18" y="78" width="112" height="80" rx="12" class="c-bg" stroke="#c4f0ea" stroke-width="1.5"/>
          <rect x="30" y="94" width="56" height="9" rx="4.5" fill="#7cccbe" opacity="0.65"/>
          <rect x="30" y="110" width="40" height="5" rx="2.5" class="c-sf"/>
          <rect x="30" y="121" width="50" height="5" rx="2.5" class="c-sf"/>
          <circle cx="112" cy="84" r="7" fill="#FFC800" opacity="0.75"/>
          <!-- Payment method chips below bank -->
          <rect x="18" y="170" width="42" height="18" rx="9" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="24" y="177" width="30" height="4" rx="2" fill="#7cccbe" opacity="0.6"/>
          <rect x="66" y="170" width="48" height="18" rx="9" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="72" y="177" width="36" height="4" rx="2" fill="#7cccbe" opacity="0.6"/>
          <rect x="18" y="194" width="52" height="18" rx="9" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="24" y="201" width="40" height="4" rx="2" fill="#7cccbe" opacity="0.6"/>
          <rect x="76" y="194" width="40" height="18" rx="9" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="82" y="201" width="28" height="4" rx="2" fill="#7cccbe" opacity="0.6"/>
          <!-- Right: LB account -->
          <rect x="210" y="78" width="112" height="80" rx="12" class="c-bg" stroke="#c4f0ea" stroke-width="1.5"/>
          <rect x="222" y="94" width="56" height="9" rx="4.5" fill="#7cccbe" opacity="0.65"/>
          <rect x="222" y="110" width="40" height="5" rx="2.5" class="c-sf"/>
          <rect x="222" y="121" width="50" height="5" rx="2.5" class="c-sf"/>
          <circle cx="210" cy="84" r="7" fill="#26e2c5"/>
          <!-- In arrow (bank → account, solid) -->
          <path d="M132 106 L212 106" stroke="#26e2c5" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M207 102 l5 4 l-5 4" stroke="#26e2c5" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Out arrow (account → bank, dashed) -->
          <path d="M212 128 L132 128" stroke="#7cccbe" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 3"/>
          <path d="M137 124 l-5 4 l5 4" stroke="#7cccbe" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Currency exchange badge top-center -->
          <rect x="118" y="42" width="104" height="28" rx="14" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <text x="170" y="60" text-anchor="middle" font-size="10" font-weight="700" fill="#00b8b8" font-family="system-ui, sans-serif">HKD · USD · SGD</text>
          <!-- FX rate card bottom-right -->
          <rect x="192" y="168" width="130" height="84" rx="10" class="c-alt" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="204" y="182" width="60" height="6" rx="3" fill="#7cccbe" opacity="0.45"/>
          <rect x="204" y="196" width="26" height="5" rx="2.5" fill="#c4f0ea" opacity="0.65"/>
          <path d="M234 198 L254 198" stroke="#c4f0ea" stroke-width="1" stroke-dasharray="2 2"/>
          <rect x="258" y="196" width="26" height="5" rx="2.5" fill="#7cccbe" opacity="0.55"/>
          <rect x="204" y="208" width="26" height="5" rx="2.5" fill="#7cccbe" opacity="0.55"/>
          <path d="M234 210 L254 210" stroke="#c4f0ea" stroke-width="1" stroke-dasharray="2 2"/>
          <rect x="258" y="208" width="26" height="5" rx="2.5" fill="#FFC800" opacity="0.72"/>
          <rect x="204" y="220" width="26" height="5" rx="2.5" fill="#FFC800" opacity="0.5"/>
          <path d="M234 222 L254 222" stroke="#c4f0ea" stroke-width="1" stroke-dasharray="2 2"/>
          <rect x="258" y="220" width="26" height="5" rx="2.5" fill="#c4f0ea"/>
          <rect x="204" y="234" width="60" height="13" rx="6.5" class="c-sf"/>
          <rect x="212" y="238" width="44" height="4" rx="2" fill="#c4f0ea" opacity="0.6"/>
        </svg>
      </div>
    </section>

    <!-- 3. 交易与投资 -->
    <section class="feat">
      <div class="feat-text">
        <span class="feat-tag">交易</span>
        <h2 class="feat-h2">港股、美股与衍生品交易</h2>
        <div class="feat-bar"></div>
        <p class="feat-desc">
          无论是买入第一只股票，还是参与 IPO 认购、使用期权策略或融资杠杆，这里涵盖各类市场和产品的完整操作步骤与核心规则。
        </p>
        <ul class="feat-links">
          <li><a :href="withBase('/stock-trading/')" >如何下单买卖港股 / 美股</a></li>
          <li><a :href="withBase('/derivatives/')" >如何交易期权、窝轮或牛熊证</a></li>
          <li><a :href="withBase('/ipo/')" >如何参与新股认购（IPO）</a></li>
          <li><a :href="withBase('/margin/')" >什么是 Margin Call，如何避免爆仓</a></li>
        </ul>
      </div>
      <div class="feat-visual" aria-hidden="true">
        <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="area-fill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#7cccbe" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#e6ebf0" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <!-- Chart frame -->
          <rect x="36" y="44" width="268" height="192" rx="12" class="c-bg c-bdr" stroke-width="1"/>
          <!-- Market tabs: 港股 / 美股 / 期权 -->
          <rect x="48" y="56" width="38" height="20" rx="10" fill="#00b8b8"/>
          <rect x="54" y="64" width="26" height="4" rx="2" fill="white" opacity="0.9"/>
          <rect x="92" y="56" width="38" height="20" rx="10" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="98" y="64" width="26" height="4" rx="2" fill="#7cccbe" opacity="0.65"/>
          <rect x="136" y="56" width="44" height="20" rx="10" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="142" y="64" width="32" height="4" rx="2" fill="#7cccbe" opacity="0.65"/>
          <!-- Gain chip top-right -->
          <rect x="260" y="55" width="36" height="20" rx="10" fill="#26e2c5"/>
          <rect x="265" y="63" width="26" height="4" rx="2" fill="white" opacity="0.9"/>
          <!-- Grid lines -->
          <line x1="48" y1="100" x2="292" y2="100" stroke="#86cfc3" stroke-width="0.5" opacity="0.3" stroke-dasharray="3"/>
          <line x1="48" y1="130" x2="292" y2="130" stroke="#86cfc3" stroke-width="0.5" opacity="0.3" stroke-dasharray="3"/>
          <line x1="48" y1="160" x2="292" y2="160" stroke="#86cfc3" stroke-width="0.5" opacity="0.3" stroke-dasharray="3"/>
          <line x1="48" y1="190" x2="292" y2="190" stroke="#86cfc3" stroke-width="0.5" opacity="0.3" stroke-dasharray="3"/>
          <!-- Area fill -->
          <path d="M56 196 L84 174 L116 156 L148 132 L180 112 L212 94 L244 78 L276 62 L276 212 L56 212 Z" fill="url(#area-fill)"/>
          <!-- Price line -->
          <polyline points="56,196 84,174 116,156 148,132 180,112 212,94 244,78 276,62" stroke="#7cccbe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <!-- Candlestick bodies at 4 points -->
          <rect x="81" y="168" width="6" height="12" rx="1" fill="#26e2c5" opacity="0.75"/>
          <line x1="84" y1="164" x2="84" y2="182" stroke="#26e2c5" stroke-width="1" opacity="0.5"/>
          <rect x="145" y="127" width="6" height="11" rx="1" fill="#FF2720" opacity="0.55"/>
          <line x1="148" y1="123" x2="148" y2="141" stroke="#FF2720" stroke-width="1" opacity="0.4"/>
          <rect x="209" y="89" width="6" height="11" rx="1" fill="#26e2c5" opacity="0.75"/>
          <line x1="212" y1="85" x2="212" y2="103" stroke="#26e2c5" stroke-width="1" opacity="0.5"/>
          <circle cx="276" cy="62" r="5" class="c-bg" stroke="#26e2c5" stroke-width="2"/>
          <!-- Bottom: IPO badge + 期权 chip -->
          <rect x="36" y="244" width="88" height="28" rx="10" fill="#FFC800" opacity="0.14" stroke="#FFC800" stroke-width="1"/>
          <rect x="50" y="255" width="60" height="5" rx="2.5" fill="#FFC800" opacity="0.8"/>
          <rect x="136" y="244" width="80" height="28" rx="10" class="c-sf" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="150" y="255" width="52" height="5" rx="2.5" fill="#7cccbe" opacity="0.65"/>
          <!-- Red dot accent top-right -->
          <circle cx="308" cy="62" r="8" fill="#FF2720" opacity="0.8"/>
        </svg>
      </div>
    </section>

    <!-- 4. 财富与合规 (reverse) -->
    <section class="feat feat--reverse">
      <div class="feat-text">
        <span class="feat-tag">财富 · 合规</span>
        <h2 class="feat-h2">理财、行情与税务合规</h2>
        <div class="feat-bar"></div>
        <p class="feat-desc">
          想让闲置资金产生收益、订阅深度行情，或在报税前搞清楚 CRS、FATCA 要求？这里有具体的操作方法和合规说明。
        </p>
        <ul class="feat-links">
          <li><a :href="withBase('/funds-and-wealth/')" >如何使用余额通或开始基金定投</a></li>
          <li><a :href="withBase('/market-data/')" >如何订阅深度行情或使用 AI 助手</a></li>
          <li><a :href="withBase('/compliance-and-tax/')" >CRS 和 FATCA 要求我做什么</a></li>
          <li><a :href="withBase('/rewards/')" >如何查询和使用活动奖励与卡券</a></li>
        </ul>
      </div>
      <div class="feat-visual" aria-hidden="true">
        <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wealth-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#c4f0ea"/>
              <stop offset="100%" stop-color="#c4f0ea" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <!-- Portfolio donut (余额通/基金定投) -->
          <circle cx="112" cy="116" r="62" class="c-bdr" fill="none" stroke-width="22"/>
          <!-- Main ~58% teal segment -->
          <circle cx="112" cy="116" r="62" fill="none" stroke="#00b8b8" stroke-width="22"
            stroke-dasharray="226 164" stroke-dashoffset="47"/>
          <!-- ~25% yellow segment -->
          <circle cx="112" cy="116" r="62" fill="none" stroke="#FFC800" stroke-width="22"
            stroke-dasharray="98 292" stroke-dashoffset="-179"/>
          <!-- ~17% light teal segment -->
          <circle cx="112" cy="116" r="62" fill="none" stroke="#7cccbe" stroke-width="22"
            stroke-dasharray="66 324" stroke-dashoffset="-277"/>
          <!-- Donut hole -->
          <circle cx="112" cy="116" r="46" class="c-bg"/>
          <text x="112" y="110" text-anchor="middle" font-size="15" font-weight="700" fill="#00b8b8" font-family="system-ui, sans-serif">5.2%</text>
          <text x="112" y="126" text-anchor="middle" font-size="9" fill="#7cccbe" font-family="system-ui, sans-serif">年化收益</text>
          <!-- Compliance shield (CRS/FATCA) top-right -->
          <path d="M226 44 L276 44 L276 82 C276 100 263 112 251 120 C239 112 226 100 226 82 Z" fill="#1a3832" stroke="#26e2c5" stroke-width="1.5"/>
          <path d="M241 80 l8 8 l14-15" stroke="#26e2c5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Tax/compliance document card -->
          <rect x="196" y="134" width="120" height="60" rx="10" class="c-bg" stroke="url(#wealth-grad)" stroke-width="1.5"/>
          <rect x="208" y="148" width="54" height="6" rx="3" fill="#7cccbe" opacity="0.55"/>
          <rect x="208" y="161" width="96" height="4" rx="2" class="c-sf"/>
          <rect x="208" y="171" width="80" height="4" rx="2" class="c-sf"/>
          <rect x="208" y="181" width="64" height="4" rx="2" class="c-sf"/>
          <!-- Market ticker strip (行情数据) at bottom -->
          <rect x="28" y="202" width="284" height="52" rx="10" class="c-alt" stroke="#c4f0ea" stroke-width="1"/>
          <rect x="40" y="214" width="38" height="6" rx="3" fill="#7cccbe" opacity="0.5"/>
          <rect x="86" y="214" width="28" height="6" rx="3" fill="#26e2c5" opacity="0.6"/>
          <rect x="122" y="214" width="34" height="6" rx="3" fill="#7cccbe" opacity="0.42"/>
          <rect x="164" y="214" width="30" height="6" rx="3" fill="#c4f0ea"/>
          <rect x="202" y="214" width="38" height="6" rx="3" fill="#7cccbe" opacity="0.48"/>
          <rect x="248" y="214" width="28" height="6" rx="3" fill="#26e2c5" opacity="0.5"/>
          <rect x="40" y="226" width="30" height="4" rx="2" fill="#26e2c5" opacity="0.45"/>
          <rect x="86" y="226" width="22" height="4" rx="2" fill="#FF2720" opacity="0.4"/>
          <rect x="122" y="226" width="26" height="4" rx="2" fill="#26e2c5" opacity="0.4"/>
          <rect x="164" y="226" width="22" height="4" rx="2" fill="#FF2720" opacity="0.38"/>
          <rect x="202" y="226" width="28" height="4" rx="2" fill="#26e2c5" opacity="0.42"/>
          <rect x="248" y="226" width="22" height="4" rx="2" fill="#FF2720" opacity="0.4"/>
          <!-- Yellow star accent -->
          <polygon points="36,52 39.5,62 50,62 41.5,68.5 44.5,79 36,72.5 27.5,79 30.5,68.5 22,62 32.5,62" fill="#FFC800"/>
        </svg>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import HomeBackground from './HomeBackground.vue'

const flagSvgs: Record<string, string> = {
  sg: `<svg width="28" height="19" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-label="新加坡"><rect width="24" height="8" fill="#EF3340"/><rect y="8" width="24" height="8" fill="#fff"/><circle cx="6" cy="4" r="3.2" fill="#fff"/><circle cx="7.5" cy="4" r="2.5" fill="#EF3340"/><polygon fill="#fff" points="0,-1 0.235,-0.324 0.951,-0.309 0.381,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.381,0.124 -0.951,-0.309 -0.235,-0.324" transform="translate(13.5,1.5) scale(0.62)"/><polygon fill="#fff" points="0,-1 0.235,-0.324 0.951,-0.309 0.381,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.381,0.124 -0.951,-0.309 -0.235,-0.324" transform="translate(15.2,3) scale(0.62)"/><polygon fill="#fff" points="0,-1 0.235,-0.324 0.951,-0.309 0.381,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.381,0.124 -0.951,-0.309 -0.235,-0.324" transform="translate(14.5,5.2) scale(0.62)"/><polygon fill="#fff" points="0,-1 0.235,-0.324 0.951,-0.309 0.381,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.381,0.124 -0.951,-0.309 -0.235,-0.324" transform="translate(12.5,5.2) scale(0.62)"/><polygon fill="#fff" points="0,-1 0.235,-0.324 0.951,-0.309 0.381,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.381,0.124 -0.951,-0.309 -0.235,-0.324" transform="translate(11.8,3) scale(0.62)"/></svg>`,
  hk: `<svg width="28" height="19" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-label="香港"><rect width="24" height="16" fill="#DE2910"/><g transform="translate(12,8)"><path d="M0,0 C0.8,-1.5 1,-4 0,-6.5 C-1,-4 -0.8,-1.5 0,0" fill="#fff" transform="rotate(18)"/><path d="M0,0 C0.8,-1.5 1,-4 0,-6.5 C-1,-4 -0.8,-1.5 0,0" fill="#fff" transform="rotate(90)"/><path d="M0,0 C0.8,-1.5 1,-4 0,-6.5 C-1,-4 -0.8,-1.5 0,0" fill="#fff" transform="rotate(162)"/><path d="M0,0 C0.8,-1.5 1,-4 0,-6.5 C-1,-4 -0.8,-1.5 0,0" fill="#fff" transform="rotate(234)"/><path d="M0,0 C0.8,-1.5 1,-4 0,-6.5 C-1,-4 -0.8,-1.5 0,0" fill="#fff" transform="rotate(306)"/></g></svg>`,
  us: `<svg width="28" height="19" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-label="美国"><rect width="24" height="16" fill="#B22234"/><rect y="1.23" width="24" height="1.23" fill="#fff"/><rect y="3.69" width="24" height="1.23" fill="#fff"/><rect y="6.15" width="24" height="1.23" fill="#fff"/><rect y="8.62" width="24" height="1.23" fill="#fff"/><rect y="11.08" width="24" height="1.23" fill="#fff"/><rect y="13.54" width="24" height="1.23" fill="#fff"/><rect width="9.6" height="8.62" fill="#3C3B6E"/><g fill="#fff"><circle cx="1.6" cy="1.43" r="0.5"/><circle cx="3.2" cy="1.43" r="0.5"/><circle cx="4.8" cy="1.43" r="0.5"/><circle cx="6.4" cy="1.43" r="0.5"/><circle cx="8" cy="1.43" r="0.5"/><circle cx="2.4" cy="2.87" r="0.5"/><circle cx="4" cy="2.87" r="0.5"/><circle cx="5.6" cy="2.87" r="0.5"/><circle cx="7.2" cy="2.87" r="0.5"/><circle cx="1.6" cy="4.31" r="0.5"/><circle cx="3.2" cy="4.31" r="0.5"/><circle cx="4.8" cy="4.31" r="0.5"/><circle cx="6.4" cy="4.31" r="0.5"/><circle cx="8" cy="4.31" r="0.5"/><circle cx="2.4" cy="5.74" r="0.5"/><circle cx="4" cy="5.74" r="0.5"/><circle cx="5.6" cy="5.74" r="0.5"/><circle cx="7.2" cy="5.74" r="0.5"/><circle cx="1.6" cy="7.18" r="0.5"/><circle cx="3.2" cy="7.18" r="0.5"/><circle cx="4.8" cy="7.18" r="0.5"/><circle cx="6.4" cy="7.18" r="0.5"/><circle cx="8" cy="7.18" r="0.5"/></g></svg>`,
}

const markets = [
  { code: 'sg', name: '新加坡' },
  { code: 'hk', name: '香港' },
  { code: 'us', name: '美国' },
]

const stats = [
  { value: '17',   label: '知识主题' },
  { value: '165+', label: '操作指南' },
  { value: '3',    label: '语言版本' },
  { isMarkets: true, label: '覆盖市场' },
]

const tasks = [
  { q: '如何从银行卡向账户入金？', path: '/deposit/' },
  { q: '出金需要多长时间，如何操作？', path: '/withdrawal/' },
  { q: '如何下单买卖港股 / 美股？', path: '/stock-trading/' },
  { q: '登录遇到问题或忘记密码？', path: '/troubleshooting/' },
  { q: '如何参与新股认购（IPO）？', path: '/ipo/' },
  { q: '什么是 Margin Call，如何应对？', path: '/margin/' },
  { q: '需要提交哪些税务申报材料？', path: '/compliance-and-tax/' },
  { q: '如何在账户间划转资金或换汇？', path: '/transfers-and-fx/' },
]
</script>

<style scoped>
/* ── Tokens ── */
.home {
  --brand: #00b8b8;
  --brand-soft: rgba(0, 184, 184, 0.08);
  --gutter: clamp(24px, 5vw, 80px);
  --section-gap: clamp(48px, 7vw, 96px);
  --max-w: min(1160px, 100%);
}

/* ── Shared section shell ── */
.hero,
.feat {
  display: grid;
  grid-template-columns: 1fr 38%;
  align-items: center;
  gap: clamp(32px, 5vw, 96px);
  padding: var(--section-gap) var(--gutter);
  max-width: var(--max-w);
  margin: 0 auto;
}

.hero {
  position: relative;
  overflow: hidden;
}

.hero-text,
.hero-visual {
  position: relative;
  z-index: 1;
}

.feat {
  border-top: 1px solid var(--vp-c-divider);
}

/* Reverse: swap column order visually */
.feat--reverse {
  grid-template-columns: 38% 1fr;
}

.feat--reverse .feat-text { order: 2; }
.feat--reverse .feat-visual { order: 1; }

/* ── Hero text ── */
.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
  margin: 0 0 20px;
}

.hero-h1 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0 0 20px;
}

.shimmer-text {
  background: linear-gradient(
    90deg,
    var(--vp-c-text-1) 0%,
    var(--vp-c-text-1) 30%,
    var(--vp-c-brand-1) 44%,
    #fff 50%,
    var(--vp-c-brand-1) 56%,
    var(--vp-c-text-1) 70%,
    var(--vp-c-text-1) 100%
  );
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: shimmer-sweep 4s ease-in-out infinite;
  display: inline-block;
}

@keyframes shimmer-sweep {
  0%   { background-position: 160% center; }
  100% { background-position: -160% center; }
}

/* ── Stats Band ── */
.stats-band {
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 28px 0;
}

.stats-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 24px;
  position: relative;
}

.stat-item + .stat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  width: 1px;
  background: var(--vp-c-divider);
}

.stat-value {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 500;
}

.stat-markets {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flag-icon {
  display: inline-flex;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(128, 128, 128, 0.25);
  flex-shrink: 0;
  line-height: 0;
}

.flag-icon svg {
  display: block;
  width: 28px;
  height: 19px;
}

@media (max-width: 640px) {
  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 0;
  }

  .stat-item:nth-child(odd) + .stat-item::before {
    display: none;
  }

  .stat-item:nth-child(even)::before {
    display: block !important;
  }
}

.hero-sub {
  font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
  color: var(--vp-c-text-2);
  line-height: 1.75;
  margin: 0 0 36px;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 11px 24px;
  background: var(--brand);
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.15s;
}

.btn-primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 11px 24px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}

.btn-ghost:hover {
  border-color: var(--brand);
  background: var(--brand-soft);
}

/* SVG visuals always fill their grid cell */
.hero-visual svg,
.feat-visual svg {
  width: 100%;
  height: auto;
  display: block;
}

/* ── Feature text ── */
.feat-tag {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
  background: var(--brand-soft);
  padding: 3px 10px;
  border-radius: 100px;
  margin-bottom: 16px;
}

.feat-h2 {
  font-size: clamp(1.375rem, 2.5vw, 1.875rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: var(--vp-c-text-1);
  margin: 0 0 14px;
}

.feat-bar {
  width: 28px;
  height: 3px;
  background: var(--brand);
  border-radius: 2px;
  margin-bottom: 18px;
}

.feat-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.75;
  margin: 0 0 24px;
}

.feat-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.feat-links li {
  border-top: 1px solid var(--vp-c-divider);
}

.feat-links li:last-child {
  border-bottom: 1px solid var(--vp-c-divider);
}

.feat-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.15s;
}

.feat-links a::after {
  content: '→';
  color: var(--vp-c-text-3);
  transition: color 0.15s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  margin-left: 8px;
}

.feat-links a:hover { color: var(--brand); }
.feat-links a:hover::after { color: var(--brand); transform: translateX(4px); }

/* ── Hero onboard box ── */
.hero-onboard {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--brand-soft);
  border: 1px solid rgba(0, 184, 184, 0.2);
  border-radius: 10px;
  flex-wrap: wrap;
}

.onboard-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* ── 常见任务 ── */
.tasks {
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tasks-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: clamp(36px, 5vw, 64px) var(--gutter);
}

.tasks-hd {
  margin-bottom: 24px;
}

.tasks-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
}

.tasks-sub {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 8px 0 0;
}

.tasks-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.task-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: background 0.15s;
}

.task-link:hover {
  background: var(--brand-soft);
}

.task-q {
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  transition: color 0.15s;
}

.task-link:hover .task-q {
  color: var(--brand);
}

.task-arrow {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

.task-link:hover .task-arrow {
  color: var(--brand);
  transform: translateX(3px);
}

/* ── Collapse to single column below 768px ── */
@media (max-width: 768px) {
  .hero,
  .feat,
  .feat--reverse {
    grid-template-columns: 1fr;
  }

  .feat--reverse .feat-text,
  .feat--reverse .feat-visual {
    order: unset;
  }

  .hero-visual,
  .feat-visual {
    max-width: 360px;
    margin: 0 auto;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .hero-onboard {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

/* ── SVG illustration dark-mode palette ── */
/* Card / panel backgrounds */
.c-bg  { fill: white; }
/* Soft tinted surfaces (#e8faf8) */
.c-sf  { fill: #e8faf8; }
/* Alternate light surfaces (#f2fdf9 / #f4fdfc) */
.c-alt { fill: #f2fdf9; }
/* Light border/track color (#EAEBEC) */
.c-bdr { stroke: #EAEBEC; }

html.dark .c-bg  { fill: #1b2b2b; }
html.dark .c-sf  { fill: #112020; }
html.dark .c-alt { fill: #0d1c1c; }
html.dark .c-bdr { stroke: #243232; }
</style>
