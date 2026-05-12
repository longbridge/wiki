export interface FeaturedAsk {
  q: string
  initialPrompt: string
}

export const hotSearchTags: FeaturedAsk[] = [
  { q: '港股交易', initialPrompt: '港股交易规则和常见手续费是什么？' },
  { q: 'FPS 入金', initialPrompt: 'FPS 转数快如何入金到长桥？' },
  { q: '期权开通', initialPrompt: '长桥期权功能怎么开通？有什么条件要求？' },
  { q: 'W-8BEN', initialPrompt: '美股 W-8BEN 表格怎么填写和提交？' },
  { q: '融资融券', initialPrompt: '长桥融资融券保证金规则和风控机制是什么？' },
  { q: '活钱通', initialPrompt: '活钱通是什么，购买和赎回流程怎么操作？' },
]

export const featuredAsks: FeaturedAsk[] = [
  { q: '港股交易手续费明细', initialPrompt: '港股交易手续费有哪些？包括佣金、印花税、平台费等' },
  { q: 'CAT 综合审计追踪费', initialPrompt: 'CAT 综合审计追踪费是什么？长桥怎么收取？' },
  { q: '第一笔入金选哪种方式', initialPrompt: '我刚开户，第一笔入金推荐用哪种方式？FPS、eDDA 还是电汇有什么区别' },
  { q: '期权开通条件', initialPrompt: '长桥期权功能怎么开通？有什么条件要求？' },
  { q: '美股盘前盘后下单规则', initialPrompt: '美股盘前和盘后可以下单吗？有什么限制和注意事项？' },
  { q: '活钱通赎回时效', initialPrompt: '活钱通赎回多久到账？T+0 还是 T+1？' },
  { q: '融资保证金不足怎么办', initialPrompt: '长桥融资时收到保证金不足提示，怎么处理？Margin Call 是什么？' },
  { q: '出金到香港银行卡', initialPrompt: '怎么把长桥账户的资金出金到香港银行卡？需要多久？' },
  { q: '股票转入需要什么材料', initialPrompt: '如何把其他券商的股票转入长桥？需要准备什么材料？' },
  { q: 'FATCA / CRS 是什么', initialPrompt: 'FATCA 和 CRS 是什么？长桥会收集哪些信息？对我有什么影响？' },
  { q: '公司行动：以股代息', initialPrompt: '长桥收到以股代息怎么选择？现金股息和股票股息的区别是什么？' },
  { q: '下单失败排查', initialPrompt: '下单时提示失败，常见原因有哪些？怎么排查解决？' },
]
