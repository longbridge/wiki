# 网银 / 电汇（SG）

## 介绍

通过手机银行或网上银行将资金转账至长桥新加坡收款银行账户的入金方式。新加坡本地银行转账和跨境电汇均通过此方式操作，转账完成后需上传汇款凭证。

官网操作指引：https://longbridge.com/sg/zh-CN/support/topics/Deposit/internetbankingtransfer

## 支持币种

<!--mcp:get_deposit_config(region="SG", method="bank_transfer", field="currencies")-->
> 新加坡元（SGD）、美元（USD）、港元（HKD）

## 到账时间

<!--mcp:get_deposit_config(region="SG", method="bank_transfer", field="arrival_time")-->
> 预计 1-3 个交易日

## 手续费

<!--mcp:get_fee_rate(product="deposit", method="bank_transfer", region="SG")-->
> 长桥证券及其代理银行（DBS）不收取任何费用。
>
> 汇款银行和中转银行可能会收取费用（约 200 港元或 25 美元）。

## 收款银行信息

<!--mcp:get_receiving_account(region="SG", method="bank_transfer")-->
> **新加坡地区（FAST / 本地转账）：**
> - 收款人姓名：LONG BRIDGE SEC
> - 收款人账号：0725885663
> - 收款银行：DBS BANK LTD
> - SWIFT 代码：DBSSSGSGXXX
> - 附言（汇款备注）：填写证券账户号（如 SG10039100），**必填**，作为入账依据
> - 收款行地址：12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Singapore 018982
> - 费用承担方：共同 SHA
>
> **其他地区（国际电汇 SWIFT）：**
> 收款信息同上，字段「收款人开户行地址」在国际版显示为「收款人开户行地址/收款人地址」

**费用承担方说明：**
- SHA（共同）：各环节费用分别在汇款行、中间行、收款行各自扣除
- BEN（收款人）：所有费用在收款行扣除
- OUR（汇款人）：所有费用在汇款人汇款行扣除

## 操作流程

1. 长桥 App - 资产 - 存入资金，选择入金币种，查看收款银行信息
2. 在银行手机端或网页端完成转账操作
3. 保留汇款凭证截图
4. 返回长桥 App 上传汇款凭证

注意：完成转账后请立即上传凭证，否则会影响入金进度。

## 特殊情况说明

### iFAST Global Bank（奕丰环球银行）

iFAST 可以入金长桥，属于跨境电汇。由于 iFAST 银行后台使用第三方支付平台，收款行可能无法解析付款方姓名等信息，需要在长桥上传 iFAST 的开户证明以及汇款流水。

### IBAN（国际银行账户号码）

IBAN 是一种全球公认的跨国界银行账户识别系统，长度在 15-34 个字符之间。主要在欧洲、中东和加勒比地区使用。

海外银行卡可在银行账户处直接输入 IBAN Code。如不了解 IBAN，可查询银行结单获取。

### 银行代码

三位数银行代码主要用于香港地区。如海外银行卡没有银行代码，可直接填写 000。

### 中转行显示问题

跨境电汇的资金可能显示为中转行账户而非汇款账户，如遇此情况请联系客服协助处理。

## 注意事项

- 转账银行账户名必须与长桥证券账户名同名，不可使用他人或联名账户转账
- 银行通知「已汇出」不等于长桥已收到款项，资金到达后需结算与审批
- 节假日期间不处理汇款业务，请预留时间
- 不接受直接存入现金
