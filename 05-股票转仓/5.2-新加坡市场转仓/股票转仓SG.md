# 股票转仓（SG）

## 介绍

股票转仓（又称转户）是将在一家券商持有的股票转移到另一家券商证券账户的过程，支持转入和转出。仅支持本人同名账户间转仓。

转入指引：https://longbridge.com/sg/zh-CN/support/topics/Sharetransfer/GuidanceOfShareTransferIn
转出指引：https://longbridge.com/sg/zh-CN/support/topics/Sharetransfer/sharetransferout

## 支持品类

<!--mcp:get_transfer_config(type="stock_transfer", region="SG", field="supported_types")-->
> 香港市场：股票、ETF
>
> 美国市场：股票、ETF
>
> 新加坡市场：股票

## 收费标准

<!--mcp:get_fee_rate(product="stock_transfer", region="SG")-->
> 转入长桥免费，转出券商可能收费，请与对方确认。
>
> 转出收费请参考长桥官网公布的标准。注：转出费用将由新加坡政府征收 9% 的商品及服务税（GST，如适用）。

## 转仓信息

转入券商信息：https://longbridge.com/sg/zh-CN/support/topics/stocktransfer/transferinstockdetails
转出券商信息：https://longbridge.com/sg/zh-CN/support/topics/stocktransfer/sharetransferout

---

## 转入股票

### 操作流程

1. 长桥 App - 资产 - 全部功能 - 存入股票 - 提交股票转入申请
2. 填写转出券商、股票代码和转入数量
3. 确认详细信息后提交，注册邮箱将收到具体指引
4. 联系转出券商告知转仓，确认后点击「已联系」

### 成本价说明

每股成本价为选填项：
- 未填写：成本价按实际转仓成功当日收盘价计算
- 已填写：转仓成功后盈亏按填写的成本价计算

### 转入注意事项

- 只有「待提交」状态才能修改申请，「执行中」状态需重新提交
- 取消转仓申请需双方券商同时取消

---

## 转出股票

### 操作流程

1. 长桥 App - 资产 - 全部功能 - 转出股票 - 提交股票转出申请
2. 填写接收券商信息和股票信息后提交
3. 通知接收券商通过长桥转出方信息中的邮件/电话与长桥确认指示与交割时间
4. 双方券商收到客户相同指示后操作完成转仓

### 转出 OTC 股票

App 内不支持转出 OTC 股票。如需转出：
1. 发送转出申请至 contact@longbridge.sg
2. 向接收券商提交股票转入指令

### 转出注意事项

- 仅支持同名转仓（NCBO），暂不支持变更受益人转仓
- 账户处于融资中或不足转仓手续费将无法发起转出
- 持仓股票需结算完成才可提交转出
- 转仓过程中如遇股票派息，长桥收到股息后会入账至客户长桥账户

---

## Interactive Brokers 转仓说明

经由 IB（盈透）转仓时，需在 IB 端提交申请后联系长桥客服提供 IB 方转仓订单编号（Reference Number）。在 IB 填写接收账户时，请填写长桥 SG 开头的证券账号，不要填写 UID。
