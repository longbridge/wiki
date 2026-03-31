import { readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

const docsRoot = join(import.meta.dirname, '../docs')

// 各分类的描述信息
const categoryMeta: Record<string, { title: string; intro: string }> = {
  '账户管理': {
    title: '账户管理',
    intro:
      '本章节涵盖长桥账户的全生命周期管理，包括香港与新加坡综合账户的开户流程、销户与迁移、账户认证（专业投资者认证）、APP 下载、账户安全设置，以及遗产处理等特殊场景。',
  },
  '入金': {
    title: '入金',
    intro:
      '本章节介绍长桥支持的各地区入金方式，涵盖香港（eDDA、FPS 转数快、银证转账、网银转账、电汇、ATM 支票）、新加坡（DDA、PayNow、Wise、电汇）、长桥标准账户等柜台入金操作，以及汇款凭证获取方法。',
  },
  '出金': {
    title: '出金',
    intro:
      '本章节说明长桥各地区的出金操作流程，包括香港（网银出金、电汇出金）、新加坡、长桥标准账户的出金方式，预计到账时间，以及资金退款申请说明。',
  },
  '资金划转与换汇': {
    title: '资金划转与换汇',
    intro:
      '本章节介绍账户间资金划转与多币种货币兑换，包括主子账户资金划转、跨账号划转，以及香港、新加坡的货币兑换操作与自动还款规则。',
  },
  '股票转仓': {
    title: '股票转仓',
    intro:
      '本章节涵盖港股、新加坡市场的股票转入转出操作，提供各主要券商的转仓指引，以及主子账户股票划转、实物股票处理和转仓问题排查说明。',
  },
  '交易市场与规则': {
    title: '交易市场与规则',
    intro:
      '本章节详细介绍长桥支持的各交易市场规则，包括港股、美股、新加坡市场的交易时段、交收规则、卖空机制与股票定投等操作说明。',
  },
  '订单类型': {
    title: '订单类型',
    intro:
      '本章节介绍长桥支持的各类订单类型，包括普通限价单与市价单、碎股单，条件订单（到价反弹、附加订单），以及策略订单（网格交易）的使用方法。',
  },
  '衍生品': {
    title: '衍生品',
    intro:
      '本章节涵盖衍生品相关知识与操作，包括美股期权基础、买方与卖方策略、期权行情字段介绍、延长时段交易，以及港股窝轮与牛熊证的核心概念。',
  },
  '新股认购IPO': {
    title: '新股认购 / IPO',
    intro:
      '本章节介绍长桥的新股认购（IPO）服务，涵盖新股申购的完整流程、中签规则、资金冻结与扣款说明，以及暗盘交易的参与方式。',
  },
  '基金与理财': {
    title: '基金与理财',
    intro:
      '本章节介绍长桥基金产品与理财服务，包括基金类型与基础知识、买入卖出规则、收费说明，以及余额通（香港、新加坡）的产品规则与常见问题。',
  },
  '融资融券': {
    title: '融资融券',
    intro:
      '本章节涵盖长桥融资融券服务，包括融资额度与保证金计算、货币保证金规则、追缴保证金（Margin Call）机制、融资利息计算，以及风控管理与常见问题解答。',
  },
  '资产与账单': {
    title: '资产与账单',
    intro:
      '本章节介绍资产页面各字段含义、成本与盈亏计算规则、盈亏分析功能，以及如何查询与下载结单（月结单、年结单）。',
  },
  '公司行动': {
    title: '公司行动',
    intro:
      '本章节说明长桥对各类公司行动的处理规则，包括现金分红、特殊派息、股票股利（送股）、供股（配股）、选股派息、拆股与合股的操作流程与注意事项。',
  },
  '行情服务': {
    title: '行情服务',
    intro:
      '本章节介绍长桥行情服务的订阅权限、各市场行情数据字段释义（买卖盘、成交量、涨跌幅等），以及个股 F10 基本资料的查看方式。',
  },
  '交易费用': {
    title: '交易费用',
    intro:
      '本章节说明长桥各市场的交易费用结构，包括港股、美股的佣金标准、平台费、监管费、印花税等组成部分，并提供详细的佣金计算示例。',
  },
  '营销活动与奖励': {
    title: '营销活动与奖励',
    intro:
      '本章节全面介绍长桥的营销活动体系，包括任务中心（签到、猜涨跌、任务包、兑换商城）、各类活动类型（邀请、抽奖、秒杀、交易挑战等）、奖励系统（卡券、权益、实物奖品），以及各类奖励的使用指南。',
  },
  '故障排查': {
    title: '故障排查',
    intro:
      '本章节提供常见问题的自助排查指引，包括 APP 网络连接异常处理、短信验证码接收问题，以及银行账户相关异常情况说明。',
  },
  '产品功能': {
    title: '产品功能',
    intro:
      '本章节介绍长桥客户端的特色功能，包括 AI 信息助手（Longbridge AI）的使用方式，以及桌面端的快捷键操作、图表交易、市场深度、组件布局与拼接等功能。',
  },
  '合规与政策': {
    title: '合规与政策',
    intro:
      '本章节涵盖长桥的合规与政策说明，包括 CRS 与 AEOI 国际税务信息交换、FATCA 美国税务合规、美股税表与股息税，以及平台支持的开户地区与隐私政策。',
  },
}

function getEntries(dir: string): { name: string; isDir: boolean }[] {
  return readdirSync(dir)
    .sort()
    .map(name => ({ name, isDir: statSync(join(dir, name)).isDirectory() }))
}

function buildNavSection(dir: string, urlBase: string, depth = 0): string {
  const entries = getEntries(dir)
  const lines: string[] = []

  for (const { name, isDir } of entries) {
    if (name.toLowerCase() === 'index.md' || name.toLowerCase() === 'readme.md') continue

    if (isDir) {
      const sectionTitle = name
      const prefix = depth === 0 ? '### ' : '#### '
      lines.push(`${prefix}${sectionTitle}`)
      lines.push('')
      lines.push(buildNavSection(join(dir, name), `${urlBase}/${name}`, depth + 1))
    } else if (name.endsWith('.md')) {
      const label = name.replace(/\.md$/, '')
      lines.push(`- [${label}](${urlBase}/${label})`)
    }
  }

  return lines.join('\n')
}

// 扫描所有顶级目录
const topDirs = readdirSync(docsRoot)
  .filter(e => statSync(join(docsRoot, e)).isDirectory() && !e.startsWith('.'))
  .sort()

for (const dir of topDirs) {
  const meta = categoryMeta[dir]
  if (!meta) {
    console.warn(`No meta for ${dir}, skipping`)
    continue
  }

  const dirPath = join(docsRoot, dir)
  const urlBase = `/${dir}`
  const nav = buildNavSection(dirPath, urlBase)

  const content = `---
layout: doc
sidebar: true
---

# ${meta.title}

${meta.intro}

## 本章导航

${nav}
`

  const outPath = join(dirPath, 'index.md')
  writeFileSync(outPath, content, 'utf-8')
  console.log(`✓ ${outPath}`)
}

console.log('\n全部分类索引已生成！')
