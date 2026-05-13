export interface UserPathStep {
  id: string
  num: string
  title: string
  subtitle: string
  path: string
  durationLabel: string
}

export const newUserSteps: UserPathStep[] = [
  {
    id: 'download-app',
    num: '01',
    title: '下载 App',
    subtitle: '支持 iOS 与 Android',
    path: '/zh-CN/app-guide/',
    durationLabel: '~2 分钟',
  },
  {
    id: 'register',
    num: '02',
    title: '注册账号',
    subtitle: '手机号或邮箱注册，完成基本资料',
    path: '/zh-CN/account/opening/open-account',
    durationLabel: '~3 分钟',
  },
  {
    id: 'kyc',
    num: '03',
    title: '完成开户',
    subtitle: '提交证件，通过 KYC 身份核验',
    path: '/zh-CN/account/opening/open-account',
    durationLabel: '~10 分钟',
  },
  {
    id: 'deposit',
    num: '04',
    title: '首次入金',
    subtitle: '选择 FPS、eDDA 或银行转账',
    path: '/zh-CN/deposit/how-to-choose-deposit-method',
    durationLabel: '~5 分钟',
  },
  {
    id: 'buy-stock',
    num: '05',
    title: '买入第一只股票',
    subtitle: '下市价单或限价单，完成首笔交易',
    path: '/zh-CN/stock-trading/trading-hours-and-rules/hk-trading-rules',
    durationLabel: '~3 分钟',
  },
]
