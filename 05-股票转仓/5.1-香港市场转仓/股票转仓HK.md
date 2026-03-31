# 股票转仓（HK）

## 介绍

股票转仓（又称转户）是将在一家券商持有的股票转移到另一家券商证券账户的过程，支持转入和转出。仅支持本人同名账户间转仓。

转入指引：https://support.longbridgehk.com/topics/1qawjoc/6d9vi8?locale=zh-CN
转出指引：https://support.longbridgehk.com/topics/1qawjoc/1nc4c4a?locale=zh-CN

## 支持品类

<!--mcp:get_transfer_config(type="stock_transfer", region="HK", field="supported_types")-->
> 香港市场：股票、ETF
>
> 美国市场：股票、ETF

## 收费标准

<!--mcp:get_fee_rate(product="stock_transfer", region="HK")-->
> 转入：长桥不收费，转出券商可能收费，请与对方券商确认。
>
> 转出港股：每支股票 500 港元 / 次
>
> 转出美股：每支股票 150 美元 / 次
>
> 转出前请确保账户内有足够的手续费。

## 处理时间

<!--mcp:get_transfer_config(type="stock_transfer", region="HK", field="processing_time")-->
> 转入：转仓指示确认后 3-5 个工作日
>
> 转出：一般预计 5-10 个工作日（以双方券商实际处理时间为准）

---

## 转入股票

### 转入券商信息

<!--mcp:get_broker_info(region="HK", direction="in")-->
> **转入港股：**
> - 接收券商名称：长桥证券（香港）有限公司 Long Bridge HK Limited
> - CCASS 代码：B02195
> - 接收账户：您的长桥证券账户号码
> - 联系人：交收部
> - 联系电话：(+852) 3585 8944 / (+852) 3585 8915
> - 联系邮箱：settlement@longbridge.hk
>
> **转入美股：**
> - 接收券商名称：Long Bridge HK Limited
> - DTC 代码：DTC 0534
> - 接收账户：您的长桥证券账户号码
> - 联系人：Settlement Team
> - 联系电话：(+852) 3585 8944 / (+852) 3585 8915
> - 联系邮箱：settlement@longbridge.hk

注意：若转出券商对接收账户格式有限制，可直接填写「U11928885」。

### 转入操作流程

1. 长桥 App - 资产 - 存入股票 - 提交转入申请（或资产 - 全部功能 - 转入股票）
2. 选择转出券商名称，填写转出券商信息，添加需要转出的股票代码及数量
3. 确认无误后点击「确认提交」，转仓指引会发送至开户注册邮箱
4. 按邮件指引下载转仓申请表，打印后手写签名，按指引发邮件至转出券商申请转出
5. 等待双方券商确认后操作转移股票

### 转入成本价说明

每股成本价为选填项：
- 未填写：成本价按实际转仓成功当日收盘价计算
- 已填写：转仓成功后盈亏按填写的成本价计算
- 填写后无法修改，如有疑问请联系客服

### 各券商转仓指引

各券商转入长桥的详细操作指引请参考 [各券商转入指引](各券商转入指引.md)，涵盖富途、华盛、老虎、盈透、雪盈、中银国际、华泰国际、恒星、盈立、哈富、荷马、佳兆业、Computershare 共 14 家券商。

---

## 转出股票

### 长桥转出方信息

<!--mcp:get_broker_info(region="HK", direction="out")-->
> **转出港股：**
> - 转出券商：长桥证券（香港）有限公司 Long Bridge HK Limited
> - CCASS 代码：B02195
> - 联系人：交收部
> - 联系电话：(+852) 3585 8944 / (+852) 3585 8915
> - 联系邮箱：settlement@longbridge.hk
>
> **转出美股：**
> - 转出券商名称：Long Bridge HK Limited
> - DTC 代码：DTC 0534
> - 联系人：Settlement Team
> - 联系电话：(+852) 3585 8944 / (+852) 3585 8915
> - 联系邮箱：settlement@longbridge.hk

### 转出操作流程

1. 长桥 App - 资产 - 全部功能 - 转出股票 - 提交转出申请
2. 填写接收券商信息、账户姓名和接收券商账户号码
3. 填写股票信息，确认后提交转出申请
4. 可在转出记录中查看处理进度

### Interactive Brokers（盈透）转仓说明

经由 Interactive Brokers 转仓时，需在 IB 端提交申请后联系长桥客服提供 IB 方转仓订单编号（Reference Number）。在 IB 填写接收账户时，请填写长桥 H 开头的证券账号，不要填写 UID。

---

## 注意事项

- 仅支持本人同名账户间转仓
- 只有「待提交」状态的申请才能修改，「执行中」状态需重新提交
- 取消转仓申请需双方券商同时取消
- 持仓股票需结算完成才可提交转出
- 转仓过程中如遇股票派息，长桥收到股息后会入账至客户长桥账户
- 如无法在 App 内操作，可通过邮件申请，转仓表格：https://pub.lbkrs.com/files/202602/rdnfx1shWbkNDAwD/___20260206.pdf
