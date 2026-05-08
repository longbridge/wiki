import path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  outDir: 'doc_build',
  title: 'Longbridge Docs',
  description: 'Longbridge Docs',
  icon: 'https://assets.wbrks.com/assets/logo/logo1.png',
  logo: 'https://assets.wbrks.com/assets/logo/logo-without-title-lb.svg',
  logoText: 'Longbridge Docs',
  base: '/',
  lang: 'en',
  // 14 篇 markdown 内部含有大量未翻译的链接；M1 不阻塞 build
  markdown: {
    link: {
      checkDeadLinks: false,
    },
    // Rspress globalComponents：每个文件 = 一个组件（按文件名映射到默认导出）。
    // 这样 markdown 里 <HomeCards /> <Tabs> <TabItem> <LinkGraph> <ClientOnly> 全部可用，无需 import。
    globalComponents: [
      path.join(__dirname, 'theme/components/HomeCards.tsx'),
      path.join(__dirname, 'theme/components/Tabs.tsx'),
      path.join(__dirname, 'theme/components/TabItem.tsx'),
      path.join(__dirname, 'theme/components/LinkGraph.tsx'),
      path.join(__dirname, 'theme/components/ClientOnly.tsx'),
    ],
  },
  // 旧 VitePress 的 .vitepress 与 README 排除在内容路由外
  route: {
    exclude: ['**/.vitepress/**', '**/README.md'],
  },
  themeConfig: {
    enableContentAnimation: false,
    enableScrollToTop: true,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/longbridge/docs' },
    ],
    footer: {
      message: '© 2026 Longbridge. All rights reserved.',
    },
    locales: [
      {
        lang: 'en',
        label: 'English',
        title: 'Longbridge Docs',
        description: 'Longbridge Docs',
        outlineTitle: 'On this page',
        prevPageText: 'Previous',
        nextPageText: 'Next',
        searchPlaceholderText: 'Search docs',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Docs', link: '/docs/' },
          { text: 'Developers', link: 'https://open.longbridge.com' },
        ],
      },
      {
        lang: 'zh-CN',
        label: '简体中文',
        title: 'Longbridge Docs',
        description: '长桥文档中心',
        outlineTitle: '页面导航',
        prevPageText: '上一页',
        nextPageText: '下一页',
        searchPlaceholderText: '搜索文档',
        nav: [
          { text: '首页', link: '/zh-CN/' },
          { text: '文档', link: '/zh-CN/docs/' },
          { text: 'Developers', link: 'https://open.longbridge.com' },
        ],
      },
      {
        lang: 'zh-HK',
        label: '繁體中文',
        title: 'Longbridge Docs',
        description: '長橋文檔中心',
        outlineTitle: '頁面導航',
        prevPageText: '上一頁',
        nextPageText: '下一頁',
        searchPlaceholderText: '搜尋文檔',
        nav: [
          { text: '首頁', link: '/zh-HK/' },
          { text: 'Developers', link: 'https://open.longbridge.com' },
        ],
      },
    ],
  },
});
