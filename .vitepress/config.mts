import { defineConfig } from 'vitepress'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const docsRoot = join(__dirname, '../docs')

// 自定义排序表，key 为相对 docs/ 的路径，value 为有序名称列表
// 文件名不含 .md 后缀；目录直接写目录名
// 未在列表中的项追加到末尾（字母序）
const ORDER: Record<string, string[]> = {
  // 顶层分类
  '': [
    '新手入门',
    '开户与账户',
    '入金',
    '出金',
    '资金划转与换汇',
    '股票交易',
    '衍生品',
    '新股认购',
    '融资融券',
    '基金与理财',
    '行情数据',
    '资产与账单',
    '活动与奖励',
    '合规与税务',
    '故障排查',
  ],

  // 开户与账户（原账户相关 + App功能/账户与设置，R5 合并）
  '开户与账户': ['如何下载长桥App', '登录注册', '开通香港综合账户', '开通新加坡综合账户', '模拟账户', '日内融账户', '虚拟资产账户', '专业投资者认证', '生物认证', '防诈骗提示', '账户常见问题', '账户切换', '我的', '我的费率', '我的卡券', '专享特权', '设置', '遗产处理', '标准账户停运与迁移'],

  // 入金
  '入金': ['入金总览', '银行账户', '香港综合账户入金', '新加坡综合账户入金', '标准账户入金', '汇款凭证'],
  '入金/入金总览': ['入金方式总览'],
  '入金/银行账户': ['银行卡绑定与审核', '银行代码'],
  '入金/香港综合账户入金': ['支持的银行与入金方式', 'FPS转数快', '网银转账入金', 'eDDA', '银证转账', 'ATM与柜台支票', '信用卡入金', '电汇入金'],
  '入金/新加坡综合账户入金': ['新加坡入金方式总览', 'PayNow', 'DDA', '网银与电汇入金', 'Wise'],
  '入金/标准账户入金': ['标准账户入金指南'],
  '入金/汇款凭证': ['MT103汇款回执'],

  // 股票交易
  '股票交易': ['交易时间与规则', '订单类型', '交易费用', '分红与公司行动', '股票转仓', '桌面端工具'],
  '股票交易/交易时间与规则': ['港股交易规则与结算', '美股交易规则与结算', '新加坡股票交易规则与结算', '美股卖空', '美股定投'],
  '股票交易/订单类型': ['限价单与市价单', '碎股单', 'FOK与IOC订单', '附加订单', '到价反弹订单', '网格交易'],
  '股票交易/交易费用': ['交易收费', '港股佣金计算示例', '美股佣金计算示例'],
  '股票交易/分红与公司行动': ['派息与特殊派息', '送股与选股派息', '供股', '拆合股', '公司行动对长期订单影响'],
  '股票交易/股票转仓': ['香港股票转仓', '新加坡股票转仓', '各券商转入指引', '主子账户股票划转', '实物股票', '转仓常见问题'],
  '股票交易/桌面端工具': ['图表交易', '市场深度', '自定义布局', '桌面端快捷键'],

  // 行情数据（原行情服务 + App功能/行情与数据，R2 合并）
  '行情数据': ['市场行情', '行情套餐', '行情权限规则', '行情数据字段介绍', 'ETF行情与全景', '个股F10资料', '个股财务分析', '个股公告与讨论', '资金流向', '发现', '动态', '搜索', '自选', '股单', 'LongbridgeAI信息助手', '行情商店'],


  // 衍生品
  '衍生品': ['港股窝轮与牛熊证', '美股期权'],
  '衍生品/港股窝轮与牛熊证': ['窝轮', '牛熊证'],
  '衍生品/美股期权': ['期权基础', '期权买方', '期权卖方', '期权策略', '期权延长时段交易', '期权行情字段介绍', '期权链', '期权计算器'],

  // 融资融券
  '融资融券': ['融资额度与保证金', '融资利息', '风控管理', '融资常见问题'],
  '融资融券/融资额度与保证金': ['融资额度与保证金规则', '货币保证金', '追缴保证金规则'],
  '融资融券/融资利息': ['融资利息规则'],
  '融资融券/风控管理': ['账户风控状态'],
  '融资融券/融资常见问题': ['融资常见问题'],

  // 基金与理财
  '基金与理财': ['余额通', '基金', '闲钱理财', '结构化产品'],
  '基金与理财/余额通': ['香港余额通', '新加坡余额通', '余额通交易规则', '余额通常见问题'],
  '基金与理财/基金': ['基金基础与类型', '基金买入与卖出规则', '基金定投', '基金收费规则', '货币基金交易规则', '基金常见问题'],

  // 新股认购
  '新股认购': ['新股申购', '暗盘交易'],

  // 出金
  '出金': ['香港综合账户出金', '新加坡综合账户出金', '标准账户出金', '退款'],
  '出金/香港综合账户出金': ['网银出金', '电汇出金'],
  '出金/新加坡综合账户出金': ['网银出金'],
  '出金/标准账户出金': ['标准账户出金指南'],
  '出金/退款': ['资金退款'],

  // 资产与账单（扁平结构，R3 合并 App功能/资产与持仓/）
  '资产与账单': ['资产概览', '资产页面释义', '资产设置', '全部功能', '现金', '现金页面释义', '基金', '财富', '存入资金', '加密货币', '盈亏页面释义', '持仓成本与盈亏计算', '盈亏分析操作指南', '结单操作与字段解释'],

  // 资金划转与换汇
  '资金划转与换汇': ['资金划转', '货币兑换'],
  '资金划转与换汇/资金划转': ['主子账户资金划转', '跨账号划转'],
  '资金划转与换汇/货币兑换': ['香港货币兑换', '新加坡货币兑换', '自动还款'],

  // 活动与奖励（原营销活动与奖励 + App功能/活动与奖励，R4 合并）
  '活动与奖励': ['奖励系统概览', '卡券系统', '权益与产品', '实物奖品', '活动资格说明', '邀请活动', '开户礼包与激活奖励', '资产保留奖励', '抽奖活动', '秒杀活动', '交易挑战', '交易排名', '交易红包', '助力活动', '任务中心概览', '每日签到', '猜涨跌', '任务包', '任务币', '任务条件说明', '道具系统', '兑换商城', '邀请关系', '邀请中心', '奖励记录', 'LBCafe'],

  // 合规与税务（原合规与政策，R6 重命名；N1 N2 文件重命名）
  '合规与税务': ['哪些国家和地区可以开户', '平台隐私政策', '美股税表与股息税', 'FATCA', '税务信息交换说明'],

  // 故障排查
  '故障排查': ['APP网络连接排查', '收不到短信验证码', '恒生银行可疑账号澄清', '入金未到账怎么办', 'App登录失败怎么办', 'DDA授权失败怎么办', '订单提交失败怎么办', '期权行权异常怎么办'],
}

function sortEntries(entries: string[], orderKey: string): string[] {
  const order = ORDER[orderKey]
  if (!order) return entries.sort()

  const indexMap = new Map(order.map((name, i) => [name, i]))
  return entries.slice().sort((a, b) => {
    const nameA = a.replace(/\.md$/, '')
    const nameB = b.replace(/\.md$/, '')
    const ia = indexMap.has(nameA) ? indexMap.get(nameA)! : Infinity
    const ib = indexMap.has(nameB) ? indexMap.get(nameB)! : Infinity
    if (ia !== ib) return ia - ib
    return nameA.localeCompare(nameB)
  })
}

function getSidebarItems(dir: string, base: string, orderKey: string) {
  const entries = sortEntries(readdirSync(dir), orderKey)
  const items: any[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const childOrderKey = orderKey ? `${orderKey}/${entry}` : entry
      const children = getSidebarItems(fullPath, `${base}/${entry}`, childOrderKey)
      if (children.length > 0) {
        items.push({
          text: entry,
          collapsed: true,
          items: children,
        })
      }
    } else if (entry.endsWith('.md') && !['readme.md', 'index.md'].includes(entry.toLowerCase())) {
      const name = entry.replace(/\.md$/, '')
      items.push({
        text: name,
        link: `${base}/${name}`,
      })
    }
  }

  return items
}

function buildSidebar() {
  const topDirs = sortEntries(
    readdirSync(docsRoot).filter(e => statSync(join(docsRoot, e)).isDirectory() && !e.startsWith('.')),
    ''
  )

  return topDirs.map(dir => ({
    text: dir,
    collapsed: true,
    items: getSidebarItems(join(docsRoot, dir), `/${dir}`, dir),
  }))
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Longbridge Wiki',
  description: 'Longbridge Securities Knowledge Base',
  base: '/wiki/',
  appearance: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap' }],
  ],
  srcDir: './docs',
  srcExclude: ['**/node_modules/**'],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
    ],
    sidebar: buildSidebar(),
    search: {
      provider: 'local',
    },
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
