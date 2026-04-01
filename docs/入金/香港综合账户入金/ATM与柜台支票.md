# ATM / 柜台现金 / 支票入金

---

## 一、ATM / 柜台转账入金

### 介绍

通过香港银行 ATM 或银行柜台将资金转账至长桥收款银行账户的入金方式，转账完成后需上传汇款凭证。

[官网操作指引](https://support.longbridgehk.com/topics/depositfunds/hk-atm?locale=zh-CN)

### 支持币种

<!--mcp:get_deposit_config(region="HK", method="ATM", field="currencies")-->
> 港元（HKD）、美元（USD）

### 到账时间

<!--mcp:get_deposit_config(region="HK", method="ATM", field="arrival_time")-->
> 同行转账：预计 2 小时内到账
>
> 跨行转账：预计 1-3 个工作日到账

### 手续费

<!--mcp:get_fee_rate(product="deposit", method="ATM", region="HK")-->
> 长桥不收取费用，具体费用以银行实际收取为准。

### 收款银行信息

<!--mcp:get_receiving_account(region="HK", method="ATM")-->
> - 收款人名称：Long Bridge HK Limited
> - 港元收款账号：01287520564946
> - 美元收款账号：01287520564962
> - 收款银行：中国银行（香港）有限公司 Bank of China (Hong Kong) Limited
> - 银行编号：012
> - SWIFT 代码：BKCHHKHHXXX
> - 银行地址：2A Des Voeux Road Central, Hong Kong

### 操作流程

1. 获取收款信息（见上方收款银行信息）
2. 前往香港银行 ATM 或柜台，将资金转账至长桥收款银行账户
3. 保留汇款凭证截图（ATM 打印凭条或柜台回执）
4. 长桥 App - 资产 - 存入资金，选择存入币种及银行信息，选择 ATM / 柜台转账，上传汇款凭证

注意：完成转账后请立即上传凭证，否则会影响入金进度。

### 注意事项

- 仅适用于香港银行柜台及 ATM
- 转账银行账户名必须与证券账户名同名，不可使用他人账户转账
- 银行通知「已汇出」不等于长桥已收到款项，资金到达后需结算与审批
- 香港公众假期不处理汇款业务，请预留时间
- 不接受直接存入现金

---

## 二、支票转账入金

### 介绍

通过填写支票信息，经存支票机或银行柜台将资金转至长桥收款银行账户的入金方式。转账完成后需上传支票照片和转账凭证。

[官网操作指引](https://support.longbridgehk.com/topics/depositfunds/hk-cheque?locale=zh-CN)

### 支持币种

<!--mcp:get_deposit_config(region="HK", method="cheque", field="currencies")-->
> 港元（HKD）、美元（USD）

### 到账时间

<!--mcp:get_deposit_config(region="HK", method="cheque", field="arrival_time")-->
> 因银行需处理支票入账，一般需 2 个工作日，具体以银行为准。

### 手续费

<!--mcp:get_fee_rate(product="deposit", method="cheque", region="HK")-->
> 长桥不收取费用，具体费用以银行实际收取为准。

### 收款银行信息

收款银行信息与 ATM / 柜台转账相同（见上方）。

### 操作流程

1. 填写支票
   - 正面：收款人填写 **Long Bridge HK Limited**
   - 反面：填写 **长桥综合账户（您的长桥账户号码）**，如「长桥综合账户（H10057829）」
   - 填写完成后务必拍摄支票正面和反面照片
2. 将支票递交至银行柜台或存支票机
3. 保留转账凭证截图
4. 长桥 App - 资产 - 存入资金，选择存入币种及银行信息，选择支票转账，上传支票正面截图、反面截图和转账凭证截图

注意：完成转账后请立即上传所有凭证，否则会影响入金进度。

### 注意事项

- 仅支持香港银行支票，不支持香港银行本票
- 不建议支票转账至工商银行（亚洲）收款账户，因需额外时间核对客户资料，入账速度较慢
- 转账银行账户名必须与证券账户名同名，不可使用他人账户转账
- 银行通知「已汇出」不等于长桥已收到款项，资金到达后需结算与审批
- 香港公众假期不处理汇款业务，请预留时间
- 不接受直接存入现金
