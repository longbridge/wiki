export interface NavTab {
  key: string
  label: string
  path: string
  categories: string[]
}

export const NAV_TABS: NavTab[] = [
  {
    key: 'getting-started',
    label: '快速开始',
    path: '/getting-started/',
    categories: [
      'getting-started', 'app-guide', 'account', 'troubleshooting',
      'deposit', 'withdrawal', 'transfers-and-fx',
    ],
  },
  {
    key: 'stock-trading',
    label: '股票投资',
    path: '/stock-trading/',
    categories: ['stock-trading', 'ipo', 'margin', 'portfolio-and-statements'],
  },
  {
    key: 'derivatives',
    label: '期权衍生品',
    path: '/derivatives/',
    categories: ['derivatives'],
  },
  {
    key: 'funds-and-wealth',
    label: '基金与ETF',
    path: '/funds-and-wealth/',
    categories: ['funds-and-wealth', 'rewards'],
  },
  {
    key: 'compliance-and-tax',
    label: '合规监管',
    path: '/compliance-and-tax/',
    categories: ['compliance-and-tax'],
  },
  {
    key: 'market-data',
    label: '量化与数据',
    path: '/market-data/',
    categories: ['market-data'],
  },
]
