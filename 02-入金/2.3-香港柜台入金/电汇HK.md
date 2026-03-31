# 电汇（HK）

## 介绍

电汇仅支持跨境银行卡（非香港银行卡）转账入金，通过手机银行或网上银行将资金转账至长桥收款银行账户，转账完成后需上传汇款凭证。

官网操作指引：https://support.longbridgehk.com/topics/depositfunds/hk-telegraphictransfer?locale=zh-CN

## 支持币种

<!--mcp:get_deposit_config(region="HK", method="telegraphic_transfer", field="currencies")-->
> 港元（HKD）、美元（USD）

## 到账时间

<!--mcp:get_deposit_config(region="HK", method="telegraphic_transfer", field="arrival_time")-->
> 预计 2-5 个交易日到账，具体时间取决于银行操作。

## 手续费

<!--mcp:get_fee_rate(product="deposit", method="telegraphic_transfer", region="HK")-->
> 长桥不收取费用。
>
> 国际电汇入金到香港工银亚洲的收费为 60 HKD（或等值外币）。
>
> 中转银行有可能额外收费或多次收费，手续费较高，请以实际到账金额为准。

工银亚洲收费详情：https://www.icbcasia.com/SiteCollectionDocuments/ICBC/Resources/ICBC/haiwai/Asia/download/EN/2014/ServiceCharges_Eng.pdf

## 收款银行信息

<!--mcp:get_receiving_account(region="HK", method="telegraphic_transfer")-->
> 中国工商银行（亚洲）有限公司 Industrial and Commercial Bank of China (Asia) Limited
>
> - 收款人名称：Long Bridge HK Limited
> - 港元收款账号：861520160012
> - 美元收款账号：861530198867
> - 银行编号：072
> - SWIFT 代码：UBHKHKHHXXX
> - 银行地址：33/F, ICBC Tower, 3 Garden Road, Central, Hong Kong

## 操作流程

1. 获取收款信息（见上方收款银行信息）
2. 通过手机银行或网上银行，将资金从跨境银行卡转账至长桥收款银行账户
3. 完成汇款后保留汇款凭证截图
4. 长桥 App - 资产 - 存入资金，选择存入币种及银行信息，选择电汇，上传汇款凭证

注意：完成转账后请立即上传凭证，否则会影响入金进度。

## 支持的国家和地区

电汇仅支持 FATF 成员国家/地区的跨境银行转账。

FATF 成员国列表：https://www.fatf-gafi.org/en/countries/fatf.html

请勿使用非 FATF 成员国家/地区银行卡转账至长桥账户，入金会被退回且退回手续费需自行承担。

## 注意事项

- 暂不接受中国大陆银行发行的银行卡转账。如使用内地银行卡转账，款项将退回，产生的银行手续费不退还，由用户自行承担
- 转账银行账户名必须与证券账户名同名，不可使用他人账户转账
- 需在所属银行登记有效手机号码、电邮地址及最新签发证件等信息
- 银行通知「已汇出」不等于长桥已收到款项，资金到达后需结算与审批
- 香港公众假期不处理汇款业务，请预留时间
- 不接受直接存入现金
