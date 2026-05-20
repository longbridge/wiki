---
layout: doc
sidebar: true
---

# Strangle 宽跨式策略

Strangle 宽跨式策略包含 Long Strangle 买入宽跨式策略与 Short Strangle 卖出宽跨式策略，通过对期权的买卖操作适应不同的市场波动预期。与 Straddle（跨式策略）相比，Strangle 选择不同行权价的期权，以较低成本换取更宽的价格区间。

## Long Strangle 买入宽跨式策略

### 策略概述

Long Strangle 是一种期权策略，通过同时买入相同标的、相同到期日但**不同行权价**的看涨期权（Call）和看跌期权（Put），来捕捉标的资产价格的大幅波动。通常选择虚值期权（行权价高于现价的 Call + 行权价低于现价的 Put），以降低成本。

### 策略特点

![Long Strangle 策略特点](https://pub-canary.lbkrs.com/uploads/2025/94e8c60af532584f9c8946cce9114916)

### 策略构成

![Long Strangle 策略构成](https://pub-canary.lbkrs.com/uploads/2025/4af0ba72c47426b25dd04b17c82bb996)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 看涨期权盈利 |
| 下跌 | 看跌期权盈利 |

### 案例解析

以虚构的上市公司 TECH 为例，该公司近期因即将发布财报，市场对其股价走势存在较大分歧，预期股价可能出现大幅波动，但方向难以预测，决定采用 Long Strangle 策略：

买入 1 张行权价为 $110 的看涨期权（Call），期权金为 $3；同时买入 1 张行权价为 $90 的看跌期权（Put），期权金为 $2（合约乘数为 100）。

![Long Strangle 盈亏图示](https://pub-canary.lbkrs.com/uploads/2025/c31e30efea9bb991e30b38b4751c8aaa)

![Long Strangle 情景分析](https://pub-canary.lbkrs.com/uploads/2025/29c616a8f7161f21620ba8edbb27f1ad)

![Long Strangle 盈亏详情](https://pub-canary.lbkrs.com/uploads/2025/81d008d7ff21258e988e08479842cc2a)

---

## Short Strangle 卖出宽跨式策略

### 策略概述

Short Strangle 是一种期权策略，通过同时卖出相同标的、相同到期日但**不同行权价**的看涨期权（Call）和看跌期权（Put），来捕捉标的资产价格波动较小的场景。该策略适合在标的资产价格预期波动有限的情况下使用，通过收取期权金获取收益。

### 策略特点

![Short Strangle 策略特点](https://pub-canary.lbkrs.com/uploads/2025/e5c3d86e5c4f9bfb7b4617617c4a2c4d)

### 策略构成

![Short Strangle 策略构成](https://pub-canary.lbkrs.com/uploads/2025/b055669c6ff351d494deeffa91138800)

### 盈利来源

| 标的资产价格 | 盈利来源 |
|------------|---------|
| 上涨 | 看跌期权收取权利金 |
| 下跌 | 看涨期权收取权利金 |

### 案例解析

以虚构的上市公司 TECH 为例，该公司近期因市场环境稳定，股价波动较小，预期未来一段时间内股价将继续保持平稳，决定采用 Short Strangle 策略：

卖出 1 张行权价为 $110 的看涨期权（Call），期权金为 $3；同时卖出 1 张行权价为 $90 的看跌期权（Put），期权金为 $2（合约乘数为 100）。

![Short Strangle 盈亏图示](https://pub-canary.lbkrs.com/uploads/2025/3d28e109c04edc93b9254226560a7549)

![Short Strangle 情景分析](https://pub-canary.lbkrs.com/uploads/2025/055e80cfac6b323f5b67dc234900e543)

![Short Strangle 盈亏详情](https://pub-canary.lbkrs.com/uploads/2025/49cb7ac44d58b2f6e1036ef2b8f7737c)

---

*本文内容仅供参考，不构成任何投资建议。*

<!-- backlinks:start -->

## 引用此页面的文档

- [期权策略](/derivatives/options/options-strategies)
- [衍生品](/derivatives)

<!-- backlinks:end -->
