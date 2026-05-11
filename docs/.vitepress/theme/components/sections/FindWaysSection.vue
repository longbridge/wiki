<script setup lang="ts">
</script>

<template>
  <section class="quick-topics">
    <div class="qt-inner">
      <h2 class="qt-title">你可能正在找</h2>
      <div class="qt-grid">
        <div class="qt-col">
          <span class="qt-cat">开户 &amp; 资金</span>
          <ul class="qt-list">
            <li><a href="/account/">港股、美股如何开户？</a></li>
            <li><a href="/deposit/">入金方式和到账时间</a></li>
            <li><a href="/withdrawal/">如何出金？手续费多少？</a></li>
            <li><a href="/transfers-and-fx/">资金划转与换汇说明</a></li>
          </ul>
          <a class="qt-more" href="/getting-started/">新手入门指南 →</a>
        </div>
        <div class="qt-col">
          <span class="qt-cat">交易 &amp; 持仓</span>
          <ul class="qt-list">
            <li><a href="/stock-trading/">如何买入第一只股票？</a></li>
            <li><a href="/stock-trading/">查看持仓盈亏明细</a></li>
            <li><a href="/stock-trading/">期权交易如何开通？</a></li>
            <li><a href="/portfolio-and-statements/">账单与对账单下载</a></li>
          </ul>
          <a class="qt-more" href="/stock-trading/">股票交易文档 →</a>
        </div>
        <div class="qt-col">
          <span class="qt-cat">合规 &amp; 税务</span>
          <ul class="qt-list">
            <li><a href="/compliance-and-tax/">W-8BEN 表格填写指南</a></li>
            <li><a href="/compliance-and-tax/">美股股息预扣税说明</a></li>
            <li><a href="/compliance-and-tax/">FATCA &amp; CRS 申报</a></li>
            <li><a href="/compliance-and-tax/">CAT 综合审计追踪费</a></li>
          </ul>
          <a class="qt-more" href="/compliance-and-tax/">合规与税务 →</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quick-topics {
  padding: 64px 24px;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.qt-inner {
  max-width: 900px;
  margin: 0 auto;
}

.qt-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 40px;
}

.qt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
}

.qt-col {
  padding: 0 32px;
  border-right: 1px solid var(--vp-c-divider);
}

.qt-col:first-child {
  padding-left: 0;
}

.qt-col:last-child {
  padding-right: 0;
  border-right: none;
}

.qt-cat {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

.qt-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.qt-list li {
  padding: 5px 0;
}

.qt-list a {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.15s;
}

.qt-list a:hover {
  color: var(--vp-c-brand-1);
}

.qt-more {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.qt-more:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .qt-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .qt-col {
    padding: 0;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
    padding-bottom: 32px;
  }

  .qt-col:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
