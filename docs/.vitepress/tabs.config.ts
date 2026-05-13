export interface NavTab {
  key: string
  label: string
  path: string
  categories: string[]
}

export const NAV_TABS: NavTab[] = [
  {
    key: 'getting-started',
    label: 'data.navTabs.getting-started',
    path: '/getting-started/',
    categories: [
      'getting-started', 'app-guide', 'account', 'troubleshooting',
      'deposit', 'withdrawal', 'transfers-and-fx',
    ],
  },
  {
    key: 'stock-trading',
    label: 'data.navTabs.stock-trading',
    path: '/stock-trading/',
    categories: ['stock-trading', 'ipo', 'margin', 'portfolio-and-statements'],
  },
  {
    key: 'derivatives',
    label: 'data.navTabs.derivatives',
    path: '/derivatives/',
    categories: ['derivatives'],
  },
  {
    key: 'funds-and-wealth',
    label: 'data.navTabs.funds-and-wealth',
    path: '/funds-and-wealth/',
    categories: ['funds-and-wealth', 'rewards'],
  },
  {
    key: 'compliance-and-tax',
    label: 'data.navTabs.compliance-and-tax',
    path: '/compliance-and-tax/',
    categories: ['compliance-and-tax'],
  },
  {
    key: 'market-data',
    label: 'data.navTabs.market-data',
    path: '/market-data/',
    categories: ['market-data'],
  },
]
