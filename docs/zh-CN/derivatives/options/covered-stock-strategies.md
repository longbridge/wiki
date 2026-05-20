---
layout: doc
sidebar: true
---

# Covered Stock 股票担保策略

Covered Stock 系列策略包括 Covered Call（备兑看涨）、Covered Put（备兑看跌）、Protective Call（保护性看涨）和 Protective Put（保护性看跌），通过期权与股票头寸的组合，在不同市场环境下管理风险并追求收益。

## Covered Call 备兑看涨期权

### 策略概述

Covered Call 是一种期权策略，通过持有标的资产并同时卖出该标的的看涨期权（Call），来对冲标的资产价格下跌的风险，同时获取额外的权利金收入。该策略适合在预期标的资产价格波动较小的情况下使用。

### 策略特点

![Covered Call 策略特点](https://pub.pbkrs.com/uploads/2026/31ca66a85014a1dac11ed8a2fbb78a6c)

### 策略构成

![Covered Call 策略构成](https://pub.pbkrs.com/uploads/2026/f5f1866d6f63c3fb9f4f0cbbeeefa552)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 股票上涨盈利；卖出看涨期权，收取权利金 |
| 下跌 | 通过权利金，对冲部分损失 |

### 案例解析

以虚构的上市公司 TECH 为例。TECH 当前股价为 $100，预期未来股价波动较小，决定采用 Covered Call 策略：

买入 100 股 TECH 股票，卖出 1 张行权价为 $105 的看涨期权（Call），权利金为 $3。

![Covered Call 盈亏图示](https://pub-canary.lbkrs.com/uploads/2025/7d6a800b4dd436babf364ea7d5949ca5)

![Covered Call 情景分析](https://assets.lbctrl.com/uploads/1_11834_mn5sah21sf0xuvb21u_.jpeg)

![Covered Call 盈亏详情](https://assets-canary.lbkrs.com/uploads/1_24651_m9v8eszsnvy86ejrz6_.jpeg)

---

## Covered Put 备兑看跌期权

### 策略概述

Covered Put 是一种期权策略，通过持有标的资产空头头寸并同时卖出该标的的看跌期权（Put），来对冲标的资产价格上涨的风险，同时获取额外的权利金收入。该策略适合在预期标的资产价格波动较小的情况下使用。

### 策略特点

![Covered Put 策略特点](https://pub.pbkrs.com/uploads/2026/7dc1a5d7dc677bbaf05a3fb9a02edc1d)

### 策略构成

![Covered Put 策略构成](https://pub.pbkrs.com/uploads/2026/6cb7ad6ac2c41b1c2d79455d650e7d38)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 通过权利金，对冲部分损失 |
| 下跌 | 股票下跌盈利；卖出看跌期权，收取权利金 |

### 案例解析

以虚构的上市公司 TECH 为例，假设做空或已持有 100 股 TECH 股票的空头头寸，当前股价为 $100，预期未来股价波动较小，决定采用 Covered Put 策略：

卖出 1 张行权价为 $95 的看跌期权（Put），权利金为 $2。

![Covered Put 盈亏图示](https://pub-canary.lbkrs.com/uploads/2025/22da1fc439bcfc182260dff511d5dc48)

![Covered Put 情景分析](https://pub-canary.lbkrs.com/uploads/2025/37f8f7b88af413e7578fa14c3de506a0)

![Covered Put 盈亏详情](https://assets-canary.lbkrs.com/uploads/1_24651_m9v8gkef064hy1v0fu0k_.jpeg)

---

## Protective Call 保护性看涨期权

### 策略概述

Protective Call 是一种期权策略，通过持有标的资产的空头头寸并同时买入该标的的看涨期权（Call），来对冲标的资产价格上涨的风险。该策略适合在预期标的资产价格可能上涨的情况下使用。

### 策略特点

![Protective Call 策略特点](https://pub-canary.lbkrs.com/uploads/2025/cad0c4868baee659307d3bf11ef5eb71)

### 策略构成

![Protective Call 策略构成](https://pub.pbkrs.com/uploads/2026/db35b1de4585c8bebc6d308b41b57889)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 看涨期权盈利 |
| 下跌 | 股票下跌盈利 |

### 案例解析

以虚构的上市公司 TECH 为例，假设做空或已持有 100 股 TECH 股票的空头头寸，当前股价为 $100，预期未来股价可能上涨，决定采用 Protective Call 策略：

买入 1 张行权价为 $105 的看涨期权（Call），权利金为 $4。

![Protective Call 盈亏图示](https://assets-canary.lbkrs.com/uploads/1_24651_m9v8i292ltnyi3a53bl_.jpeg)

![Protective Call 情景分析](https://assets-canary.lbkrs.com/uploads/1_24651_m9v8hq9k3wg52sbqoul_.jpeg)

![Protective Call 盈亏详情](https://pub-canary.lbkrs.com/uploads/2025/74054caa3aa7a52ccdb684ee62e3dc28)

---

## Protective Put 保护性看跌期权

### 策略概述

Protective Put 是一种期权策略，通过持有标的资产多头头寸并同时买入相同标的、相同到期日的看跌期权（Put），来对冲标的资产价格下跌的风险。该策略适合在预期标的资产价格可能下跌的情况下使用。

### 策略特点

![Protective Put 策略特点](https://pub-canary.lbkrs.com/uploads/2025/57ed9be4ced36a1f46a67759c407b96e)

### 策略构成

![Protective Put 策略构成](https://pub.pbkrs.com/uploads/2026/b1ed6d9e905df3ace17dae6022bce0c1)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 股票上涨盈利 |
| 下跌 | 看跌期权盈利 |

### 案例解析

以虚构的上市公司 TECH 为例，假设购买或已持有 100 股 TECH 股票，当前股价为 $100，预期未来股价可能下跌，决定采用 Protective Put 策略：

买入 1 张行权价为 $95 的看跌期权（Put），权利金为 $3（合约乘数为 100）。

![Protective Put 盈亏图示](https://pub-canary.lbkrs.com/uploads/2025/a91189c261f9b33708352a98493dec67)

![Protective Put 情景分析](https://assets-canary.lbkrs.com/uploads/1_24651_m9v8ihb0oef3bz48lll_.jpeg)

![Protective Put 盈亏详情](https://pub-canary.lbkrs.com/uploads/2025/e03dfbb5f7f6ca364f2000fd617b46f8)

---

*本文内容仅供参考，不构成任何投资建议。*

<!-- backlinks:start -->

## 引用此页面的文档

- [期权策略](/derivatives/options/options-strategies)
- [衍生品](/derivatives)

<!-- backlinks:end -->
