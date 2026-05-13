export interface CategoryItem {
  label: string
  path: string
}

export interface CategoryGroup {
  name: string
  items: CategoryItem[]
}

export const categoryGroups: CategoryGroup[] = [
  {
    name: 'data.categoryGroups.trading',
    items: [
      { label: 'data.categoryGroups.tradingItems.stock', path: '/zh-CN/stock-trading/' },
      { label: 'data.categoryGroups.tradingItems.options', path: '/zh-CN/derivatives/options/' },
      { label: 'data.categoryGroups.tradingItems.warrants', path: '/zh-CN/derivatives/warrants' },
      { label: 'data.categoryGroups.tradingItems.cbbc', path: '/zh-CN/derivatives/cbbc' },
      { label: 'data.categoryGroups.tradingItems.margin', path: '/zh-CN/margin/' },
      { label: 'data.categoryGroups.tradingItems.ipo', path: '/zh-CN/ipo/' },
    ],
  },
  {
    name: 'data.categoryGroups.finance',
    items: [
      { label: 'data.categoryGroups.financeItems.funds', path: '/zh-CN/funds-and-wealth/funds/' },
      { label: 'data.categoryGroups.financeItems.cashPlus', path: '/zh-CN/funds-and-wealth/cash-plus/' },
      { label: 'data.categoryGroups.financeItems.idle', path: '/zh-CN/funds-and-wealth/' },
      { label: 'data.categoryGroups.financeItems.structured', path: '/zh-CN/funds-and-wealth/' },
    ],
  },
  {
    name: 'data.categoryGroups.marketData',
    items: [
      { label: 'data.categoryGroups.marketDataItems.packages', path: '/zh-CN/market-data/' },
      { label: 'data.categoryGroups.marketDataItems.financial', path: '/zh-CN/market-data/' },
      { label: 'data.categoryGroups.marketDataItems.technical', path: '/zh-CN/market-data/' },
      { label: 'data.categoryGroups.marketDataItems.flow', path: '/zh-CN/market-data/' },
    ],
  },
  {
    name: 'data.categoryGroups.account',
    items: [
      { label: 'data.categoryGroups.accountItems.openAccount', path: '/zh-CN/account/' },
      { label: 'data.categoryGroups.accountItems.deposit', path: '/zh-CN/deposit/' },
      { label: 'data.categoryGroups.accountItems.withdrawal', path: '/zh-CN/withdrawal/' },
      { label: 'data.categoryGroups.accountItems.transfers', path: '/zh-CN/transfers-and-fx/' },
      { label: 'data.categoryGroups.accountItems.portfolio', path: '/zh-CN/portfolio-and-statements/' },
    ],
  },
  {
    name: 'data.categoryGroups.help',
    items: [
      { label: 'data.categoryGroups.helpItems.appGuide', path: '/zh-CN/app-guide/' },
      { label: 'data.categoryGroups.helpItems.compliance', path: '/zh-CN/compliance-and-tax/' },
      { label: 'data.categoryGroups.helpItems.troubleshooting', path: '/zh-CN/troubleshooting/' },
      { label: 'data.categoryGroups.helpItems.rewards', path: '/zh-CN/rewards/' },
    ],
  },
]
