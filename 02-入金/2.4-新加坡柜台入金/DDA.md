# DDA 直接付款授权

## 介绍

DDA（Direct Debit Authorisation，直接付款授权）是新加坡银行与长桥证券合作提供的授权转账服务。将银行账户与长桥证券账户绑定后，可直接从长桥 App 发起新元入金，资金从银行账户扣除并存入长桥账户。无需上传入金凭证。

注意：DDA 是新加坡柜台的授权扣款服务，与香港柜台的 eDDA（电子直接扣账授权，基于 FPS 转数快系统）是不同的服务。

官网操作指引：https://longbridge.com/sg/zh-CN/support/topics/Deposit/DDA

## 支持币种

<!--mcp:get_deposit_config(region="SG", method="DDA", field="currencies")-->
> 仅支持新加坡元（SGD）

## 到账时间

<!--mcp:get_deposit_config(region="SG", method="DDA", field="arrival_time")-->
> 预计实时到账

## 手续费

<!--mcp:get_fee_rate(product="deposit", method="DDA", region="SG")-->
> 免费

## DDA 授权流程

长桥 App - 资产 - 全部功能 - 存入资金 - SGD - DDA，按页面指引发起授权。

授权时需确认银行端的证件信息与长桥端一致，否则会导致授权失败。如信息不一致，可在 App 的 DDA 授权页面更新证件。

授权过程中需完整阅读条款并划到底端，才能点击「Submit」提交，中途点击取消会导致授权失败。

## 入金操作

授权成功后，在长桥 App 的 DDA 入金页面输入入金金额即可发起入金。无需上传入金凭证。

## 常见授权失败原因

- 1209（Refer to your payer/payee）：银行账户余额或额度不足
- 1100（Other reason）：曾在银行端删除过 DDA 绑定，需联系客服关闭旧记录后重新授权
- ID number verification failed：在长桥注册的身份证号与银行端不一致
- BA3002（Consent not given）：授权页面未完成条款阅读就点击了取消，需重新操作并完整阅读后提交

## 解除 DDA 授权

解除 DDA 授权需要在长桥 App 和银行端双向操作，才能彻底解除：

1. 在长桥 App 入金页面删除该银行账户
2. 在银行端操作解除 DDA 绑定

注意事项：
- 仅在长桥 App 删除不会自动解除银行端的授权
- 仅在银行端解除绑定，长桥 App 不会自动更新状态，继续提交入金会显示失败
- 因此两端都需要操作解除

## 注意事项

- DDA 不支持出金
- 银行端证件信息需与长桥开户信息一致
