# PayNow

## 介绍

PayNow 是新加坡的实时电子转账服务，允许个人和企业之间通过手机号码、新加坡国民身份证/FIN 号码、UEN（统一实体编号）或二维码进行即时资金转账。

[官网操作指引](https://longbridge.com/sg/zh-CN/support/topics/Deposit/PayNow)

## 支持币种

<!--mcp:get_deposit_config(region="SG", method="PayNow", field="currencies")-->
> 仅支持新加坡元（SGD）

## 到账时间

<!--mcp:get_deposit_config(region="SG", method="PayNow", field="arrival_time")-->
> 实时到账，最快 5 分钟内。

## 手续费

<!--mcp:get_fee_rate(product="deposit", method="PayNow", region="SG")-->
> 免费

## 操作流程

1. 长桥 App - 资产 - 全部功能 - 存入资金 - SGD - PayNow，生成收款二维码
2. 使用手机银行扫描二维码完成付款

无需上传入金凭证。

## 注意事项

- 一个二维码只能扫一次。如重复扫码付款，资金不会丢失，但需要人工匹配，预计 3 个工作日左右到账
- 扫码付款时建议填写备注内容，未填写备注的入金需要人工匹配，到账时间会延长至 3 个工作日内
- 如长桥开户名与银行支付名不一致，需人工核实匹配，到账时间会比正常时效慢
- PayNow 不支持出金
