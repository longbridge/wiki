# US 站 VitePress → Astro 迁移设计 (Zendesk 视觉/交互对齐)

- 日期:2026-09-01
- 分支：`feat/us-astro-migration`
- 状态：已获 boss 批准的设计基线
- 配套执行计划：`specs/us-astro-migration/implementation-plan.md`

## 0. 一句话目标

把 `apps/us` 从 VitePress 2 重建为 **Astro 7 静态站**,页面结构、样式、交互 **1:1 对齐现有 Zendesk 帮助中心主题**(`/Users/tangyu/Downloads/Longbridge_us`,线上 https://longbridgeus.zendesk.com/hc/en-us),同时保留 docs 站的 region 切换、明暗切换、GitHub 功能;内容管道 (Zendesk 同步器) 与 URL 结构完全不变。

## 1. 范围与成功标准

### 1.1 范围内

- `apps/us`:VitePress 壳整体替换为 Astro 工程 (仅 `scripts/`、`docs/en/**` 内容、`.env*` 不动;例外：`scripts/zendesk/client.ts` 认证改可选，见 §11)。
- `.github/workflows/deploy.yml`:us 产物路径一行改动 + 自动同步触发器 (webhook `repository_dispatch` + 定时兜底，见 §11)。
- 根 `README.md`:us 段落描述更新。
- 语言：**仅 en**(zh-HK 生成物弃用，本就 gitignored)。

### 1.2 范围外 (明确不做)

- `apps/hk`、`apps/sg`、`packages/shared`:**零改动**(shared 只作只读参考)。
- AI 问答抽屉 (AiChatDrawer/Helora):不迁移 (boss 明确不保留)。
- LinkGraph / graph 页：不迁移 (US 数据为空)。
- Zendesk 的社区/工单/服务目录/用户中心模板：不迁移 (与帮助中心浏览无关)。
- Whale App 深度集成 (dsbridge 原生栏、FAB 菜单、链接拦截):**deferred follow-up**,见 §8.3。

### 1.3 成功标准 (验收口径)

1. `bun run dev:us` / `bun run build:us` 命令名不变且可用;`bun run sync:us` 产出契约完全不变 (认证改为可选，见 §11.3)。
2. 构建产物在 `/us/` base 下可静态部署，URL 与现网 docs 逐一对应：`/us/`、`/us/{cat}/overview`、`/us/{cat}/{sec}/overview`、`/us/{cat}/{sec}/{article}`。
3. **真实浏览器逐页对照** https://longbridgeus.zendesk.com/hc/en-us :首页 / 文章页 / 分类页 / 小节页 / 搜索弹窗的视觉与交互按 §5–§7 规格核对通过 (交互清单逐项打勾)。
4. 明暗切换、region 切换、GitHub 链接三项保留功能按 §8 规格工作。
5. `hk`/`sg` 构建不受影响 (`bun run build:hk` 仍通过)。

## 2. 架构决策记录 (已批准)

| # | 决策 | 理由 |
|---|---|---|
| D1 | 原地替换 `apps/us`,内容目录与同步器零改动 | 内容契约 (§3) 与 VitePress 解耦;分支即隔离 |
| D2 | 纯 Astro 组件 + vanilla TS + 移植 CSS,**零框架 island** | Zendesk 主题本质是 SSR HTML + vanilla JS + CSS,1:1 同构;运行时 API 数据全部转为构建期静态数据 |
| D3 | 搜索用 **Pagefind**,UI 复刻 Zendesk 搜索弹窗 | 静态站标准方案;弹窗交互 (⌘K/历史/高亮) 全保留 |
| D4 | 明暗切换接入主题包现成 `lb-theme-mode` 体系 + 新增手动 toggle;region 切换按 docs 现逻辑移植;GitHub = header 图标 + 文章页 edit 链接 | 见 §8 |
| D5 | Astro ^7.2,`base:'/us/'`,产物 `apps/us/dist`,`build.format:'file'` | URL 与 VitePress `cleanUrls` 产物形态一致 (`{path}.html` 无扩展名访问) |

## 3. 内容契约 (同步器产出，Astro 只读消费)

> 证据源：`apps/us/scripts/zendesk/writer.ts`、`fetch-zendesk.ts`。同步是**全量覆盖 + prune**,Astro 侧对内容目录只读。

### 3.1 目录结构

```
apps/us/docs/en/{category-slug}/{section-slug}/{article-slug}.md
apps/us/docs/en/{category-slug}/overview.md            # 分类索引页
apps/us/docs/en/{category-slug}/{section-slug}/overview.md  # 小节索引页
apps/us/docs/en/{category-slug}/_order.json            # section slug 有序数组
apps/us/docs/en/{category-slug}/{section-slug}/_order.json  # article slug 有序数组
```

6 个顶级分类：`account-and-security`、`campaigns`、`funding-your-account-withdrawals-and-transfer`、`longbridge-community`、`opening-an-account`、`trading-and-investing`。

### 3.2 文章 frontmatter(writer.ts:52-62)

| 字段 | 类型 | 备注 |
|---|---|---|
| `title` | string | |
| `zendesk_article_id` | number | |
| `zendesk_section_id` | number | |
| `zendesk_updated_at` / `zendesk_edited_at` | string(ISO) | catx 排序用 updated_at |
| `source_url` | string | Zendesk 原文链接 |
| `promoted` | boolean | **catx 卡片数据源**;列表页星标 |
| `position` | number | |
| `labels` | string[] | 可缺省 (空数组被丢弃) |

overview.md 的 frontmatter 不同：`layout: doc` / `sidebar: true` / `title` / `zendesk_category_id` 或 `zendesk_section_id`。**schema 必须兼容两种形态**(全部字段 optional 除 title)。

### 3.3 `_order.json`

纯 JSON 字符串数组 (无对象包裹)。分类目录内=section slug(按 Zendesk position ASC);小节目录内=article slug(按 `promoted DESC, position ASC`)。**导航顺序、"第一篇文章"解析、prev/next 都必须以它为准**;未列出的条目按字母序追加 (对齐 `create-docs-config.ts:461-468` 行为)。

### 3.4 内链与 HTML 残留

- 文章间内链是**根相对、无 `/us/`、无 locale、无 `.md`**:`/{cat}/{sec}/{art}`(fetch-zendesk.ts:163)。渲染期必须统一改写为 `/us/{path}`(rehype 插件，见计划 Task 2)。
- markdown 中存在 raw HTML 残留 (`<table class="wysiwyg-table-resized">`、`<span class="wysiwyg-font-size-medium">`,实例：`trading-and-investing/trading-basics/longbridge-securities-llc-fees-charges.md`)。Astro 默认透传 raw HTML,**不得开启任何 sanitize**。
- VitePress 原配置 `breaks:true`(软换行→`<br>`),Astro 侧用 `remark-breaks` 等价。
- 当前内容零图片;若未来出现则是 Zendesk 远程 URL，无需构建处理。
- `:::tip` 容器语法在 US 内容中不存在，**不移植**。

### 3.5 需一次性清理的遗留文件

`apps/us/docs/en/index.md`(旧 VitePress 首页壳) 与 `apps/us/docs/en/graph.md`(空图谱页):删除。同步器 prune 只处理深度≥3 的文件 (writer.ts:190),不会重建它们，删除安全。

## 4. 页面映射与路由

| Zendesk 模板 | Astro 路由 | 说明 |
|---|---|---|
| `home_page.hbs` | `/us/`(`src/pages/index.astro`) | hero + catx |
| `category_page.hbs` | `/us/{cat}/overview` | 由 overview.md 驱动 |
| `section_page.hbs` | `/us/{cat}/{sec}/overview` | 由 overview.md 驱动 |
| `article_page.hbs` | `/us/{cat}/{sec}/{article}` | 主力页面 |
| `error_page.hbs` | `/us/404.html` | 简化复刻 |
| `search_results.hbs` | 不建页面 | Zendesk 本身就重定向回首页弹窗;`/us/?q=xxx` 自动开弹窗 |
| `article_pages/lb_agreement.hbs` | **deferred** | 协议全宽变体;同步数据不含模板归属，待用 labels 识别后再做 |

**导航约定 (硬规则，继承既有约定)**:所有分类/小节入口 (mega 菜单"View all"、side-tree 分类头、面包屑中间项、catx tab 等) 一律链接到**该分类/小节按 `_order.json` 排序的第一篇文章**,永不指向 overview 页;overview 路由仅为历史 URL 兼容而生成。构建期直接算好直链 (替代 Zendesk 的运行时 breadcrumb 改写脚本 script.js:968-1020)。

## 5. 设计 Token(normative)

> 证据源：`style.css` 定制层 (4927 行起，"US docs style alignment")。**同一选择器多次出现时以文件末尾为准**——hero 现为亮薄荷而非类名暗示的深色。以下为最终生效值，执行者按此实现，存疑时回查 style.css 标注行号。

### 5.1 亮色 `:root`(style.css:6540-6580 + 8825-8969)

```css
:root {
  --background: #fff;
  --foreground: #0a0e19;
  --card: #fff;
  --muted: #f3f5f6;
  --muted-foreground: #6c6e75;
  --secondary: #f3f5f6;
  --secondary-foreground: #0a0e19;
  --border: #ddddDF;
  --input: #e6e7e8;
  --destructive: #f7415f;
  --accent-teal: #00b8b8;        /* 全站强调色，见下方"变量坑" */
  --accent-teal-hover: #00a5a5;
  --lb-footer-bg: #f8f9fa;
  --lb-font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  --lb-font-display: "SF Pro Display", "Source Han Sans CN", -apple-system, BlinkMacSystemFont, sans-serif;
  color-scheme: light;
}
```

### 5.2 暗色 (挂 `html[theme="dark"], .theme-dark`;style.css:6583-6620)

`--background: #0a0e19`、`--card: #232630`、`--foreground: #fff`、`--muted-foreground: #9d9fa3`、`--border: #3b3e47`、`--lb-footer-bg: #14181f`、暗色强调 `#00f0c4`(hero/App)、side-tree current `#22e5cf`、`color-scheme: dark`。另需 `@media (prefers-color-scheme: dark)` 下对 `html:not([theme="light"]):not(.theme-light)` 应用同一套 (系统跟随)。

### 5.3 ⚠️ 原主题变量坑 (必读)

原 style.css 里 `--primary`/`--accent`/`--link-foreground`/`--sidebar-*` **从未定义出可解析值**,实际生效全靠内联兜底 `var(--primary, #00b8b8)`。**Astro 版不复制这个坑**:统一用上面自定义的 `--accent-teal` 系列;凡 spec 里写"teal"即 `#00B8B8`(亮)/`#00F0C4`(暗 hero)/`#22E5CF`(暗 side-tree current)。

### 5.4 字体 / 字号 / 尺寸

- `@font-face`:SF Pro Display(400/500/600/700/900,lbkrs 外链，style.css:8817-8824)+ Source Han Sans CN。**body 与 h1-h6 用 `--lb-font-sans`(系统栈);仅 `.hero-title` 与 `.catx__title` 用 `--lb-font-display`**。Google Fonts Inter 不引入 (原主题已废弃)。
- body 15px/1.5;h1 32 / h2 22 / h3 18(600)/ h4 16。
- hero title 桌面 **80px/90px/700**,移动 28/34;hero sub 20/28(移动 14/20)。
- 文章 H1 **40px/1.2/-0.02em**(移动 28)。正文 line-height **1.7**。
- catx:title 28(display 字体)、tab 20(active 600)、卡 title 20/500、卡 sub 12.5。
- side-tree:分类 16/600、item 14。TOC title 11.5 大写、item 13。
- 圆角：按钮 6、输入/搜索 7、卡 8、搜索弹窗面板 16、mega 20、hot-tag 999。
- 容器：`.container` 1240;首页 hero-inner 与 catx 容器 1200;文章容器开 TOC 时 **1396**(`html.lb-has-toc`);header 内容 1160;footer 1160(首页 1200)。
- 断点:480 / 640 / 768 / 900 / 1024 / 1160。
- 关键阴影：卡 hover `0 6px 24px rgba(43,62,92,.14)`;搜索弹窗 `0 24px 64px rgba(0,0,0,.24)`;mega `0 4px 12px 6px rgba(0,0,0,.14)`。

## 6. 组件外观规格 (normative，逐项对照 style.css)

### 6.1 Header(style.css:623-648, 6259-6371, 9020-9036)

fixed top、z-100、min-height 56、桌面 padding 0 30px(≤1023:24,≤640:16)。三态：
1. 非首页：白底 + `#111` 文字 + `0 1px 0 rgba(0,0,0,.06)` 底影。
2. 首页顶部 (`.header--transparent`):透明底，亮薄荷 hero 下用深色文字 + `logo_light.png`。
3. 首页滚动 >60px(`.is-scrolled` 加在 header 与 `<html>`):白底深字，过渡动画。

内容：左 logo;桌面导航 `.lb-topnav`(Home / **All Topics mega 菜单** / 搜索放大镜钮);右侧:region 切换、明暗 toggle、GitHub 图标 (§8)。移动端：搜索钮 + 汉堡 (开分类抽屉)。**不做**:Ask AI 按钮 (见 §9 偏差)、登录头像、community/service 链接。

### 6.2 Home hero(style.css:8983-9018)

`.hero` 底色 **#C2FFF7**;`.hero-bg` 右侧插画 hero-bg3.png(桌面 `background-size:815px auto; background-position:calc(50% + 235px) -64px`);`::after` 左上 sun.png 光晕;`::before` 顶部 230px 黑→透渐变。标题 "Hi, how can we help?"("Hi," teal accent);sub 文案照抄;白底搜索输入 + 5 个 teal 实心 hot-tag(高 36、padding 0 14、白字、hover #00A5A5):Crypto / Options / Fees / Login / Buying Power。

### 6.3 catx 模块 (style.css:5264-5361, 8858-8916 + home_page.hbs:67-435)

标题 "You might want to know"。tab 行 (横滚、两侧 24px mask 渐隐、active 底部 32×3 teal 药丸 `::after`——**underline 元素方案已废弃，不移植**);卡片 grid 桌面 2 列 (≤1024:3,≤768:2,≤480:1)gap 20;卡:flex 横排 `[teal 图标 22×22][title+sub][灰箭头]`,min-height 92、padding 32px 20px、border 0.5px、radius 8;hover 升起 + teal 描边。数据 = **构建期** `promoted:true` 文章，按分类分组、组内 `zendesk_updated_at` 倒序，上限 12，超出进"Show N more"手风琴。图标启发式 (SECTION_RULES/CATEGORY_RULES 关键词→22 个内联 SVG) 从 home_page.hbs:89-170 移植为构建期函数。

### 6.4 文章页 (article_page.hbs + style.css:5558-5578, 6410-6443, 7508-7515, 8919-8925)

桌面容器变 grid `272px 1fr; column-gap:32px`,footer 移入容器内使侧栏纵跨 (构建期直接把 footer 放进 grid，替代 Zendesk 的 JS 搬移)。左侧 `.side-tree` sticky top 56:全分类树，分类头 (图标+label+chevron，展开态 teal)、section 缩进、当前文章 teal 高亮 + `rgba(0,184,184,.12)` 底 + scrollIntoView。正文:H1 40px;`.article-body` 1.7 行高;ul/ol `margin:8px 0 20px 20px`;table `width:max-content` 上限 100%、thead 灰底、偶数行微灰;code/blockquote 用 `--muted` + teal 左边;链接 teal。尾部："Was this article helpful?" 投票条 (§9 行为偏差)、related / recently-viewed 区块、GitHub edit 链接。面包屑:13px 灰、`>` 分隔、中间项省略号收缩、**构建期直链首篇文章**。

### 6.5 文章 TOC(script.js:1348-1429 + style.css:8318-8325)

桌面右侧 `position:fixed; top:96px`,JS 计算 left/width(文章右缘+32,宽 min(240, 空间 -48));右侧空间 <210px 或 App 内隐藏;显示时给 `<html>` 加 `.lb-has-toc`(容器加宽 1396)。数据源：`.article-body` 内 h1-h4 + **伪标题启发式**(无块级子元素、≤120 字、含 `span.wysiwyg-font-size-large/x-large/xx-large`、或整段为单个 `<strong>/<b>`)。点击平滑滚动 (scroll-margin = header 底 +20)+ replaceState;滚动 spy(`pageYOffset+130` 标记线) 切 `.is-active`(teal + 左 2px teal 边)。移动端：可拖拽 FAB(6px 阈值、贴边吸附、localStorage `lb_toc_fab`)+ 底部抽屉 (全分类树，当前 section 展开)。

### 6.6 分类/小节页 (category_page.hbs / section_page.hbs)

面包屑 + `page-header`(h1 + 可选描述);分类页 section-tree 桌面两列 (`flex:0 0 45%`),每 section:标题链接 + `.article-list`(16px、行 padding 15px 0、promoted 前置 teal 星 SVG);小节页：可选子小节列表 (上下 1px 边 + 右箭头)+ 文章列表。

### 6.7 搜索弹窗 (header.hbs:151-328 + style.css:6022-6023)

全屏 backdrop + 居中面板 (radius 16、大阴影):头部 放大镜 + input + 关闭;body 结果区。交互:⌘/Ctrl+K、header 搜索钮、hero 输入框 **focus 即开**(seed 当前值并 blur)、hot-tag 点击带词、`?q=` 落地自动开;250ms debounce;结果标题/摘要 `<mark>` 高亮;空 query 显示**最近搜索**(localStorage `lb_search_history_v1`,MRU 10 条、单删、Clear);ESC/backdrop 关闭;`<html>.lb-search-open` 锁滚动。数据层:Pagefind(替代 HC search API)。

### 6.8 Footer(footer.hbs + style.css:5825-5927, 8929-8972)

透明底 (首页 #F8F9FA);上行:tagline "Explore. Inspire. Trade."(16/500)+ meta "Member FINRA / SIPC · © 2026 …"(14 灰)| 右侧 logo(高 32,**需下载到本地**,原是 Zendesk theming_assets);1px 分隔线;两段 14px/1.7 合规免责声明 (含 FINRA BrokerCheck 链接),文案照抄 footer.hbs。≤640 纵向堆叠。

## 7. 交互清单 (验收 checklist 的母版)

构建期化 (无运行时 JS):mega 菜单内容、catx 卡片数据、side-tree 树与 current 高亮、面包屑首篇直链、related articles。
保留为客户端脚本 (从原主题逐条移植):

| # | 交互 | 源 | 页面 |
|---|---|---|---|
| I1 | header 滚动过渡 (60px 阈值，rAF 节流) | script.js:1023-1065 | 首页 |
| I2 | All Topics mega 开合 (点击+hover 200ms 延时、左列 hover 切面板、高度裁剪文章数) | script.js:1067-1253 | 全站桌面 |
| I3 | catx tab 切换/过滤/12 上限/Show more 手风琴/边缘渐隐 | home_page.hbs:246-433 + script.js:1431-1453 | 首页 |
| I4 | 搜索弹窗全部行为 (§6.7) | header.hbs:164-328 | 全站 |
| I5 | 分类抽屉开合 (委托点击、ESC、`html.lb-drawer-open`、链接点击即关、bfcache 还原关闭) | script.js:1277-1310, 1456-1485 | 移动全站 |
| I6 | side-tree 折叠展开 (chevron 旋转)、current scrollIntoView | header.hbs:403-512 | 文章页/抽屉 |
| I7 | 文章 TOC:定位/resize/spy/平滑滚动 (§6.5) | script.js:1348-1429 | 文章页桌面 |
| I8 | 移动 TOC FAB 拖拽吸附 + 抽屉开合 | article_page.hbs:294-528 | 文章页移动 |
| I9 | 表格内联宽度清洗 (width:max-content 生效) | script.js:959-966 | 文章页 |
| I10 | 明暗切换 (§8.1) | document_head.hbs:51-131 + 新增 toggle | 全站 |
| I11 | region 切换 (§8.2) | HomeNavbar.vue:98-110 移植 | 全站 |
| I12 | 移动端菜单 aria toggle + ESC | script.js:22-36 | 全站 |

**不移植**:Dropdown 键盘类 (用户菜单没了)、share 弹窗、表单/工单交互、admin 偏移、App hover 剥离 (改为 `.is-whale-app` 作用域 CSS)、面包屑运行时改写 (已构建期化)、instant search(Zendesk 平台能力)。

## 8. 保留功能规格

### 8.1 明暗切换

移植 `lb-theme-mode` 引导脚本 (document_head.hbs:51-131) 为 BaseLayout `<head>` 内联脚本 (防 FOUC),解析优先级**新增 localStorage 一层**:`?theme=` > UA `lbtheme/` > **localStorage `lb-theme-mode`** > `prefers-color-scheme` > `light`。写 `html[theme=…]` + `html.theme-light/.theme-dark`(body 同步);保留 `window.lbGetThemeMode/lbSetThemeMode/changeTheme('light-theme'|'dark-theme')` API 与 `lb:theme-change` 事件 (App 约定);监听系统主题变化 (query/UA/手动覆盖时不跟随)。header 加 Sun/Moon toggle 按钮，点击 `lbSetThemeMode` 并写 localStorage。默认浅色。

### 8.2 Region 切换

header 弹层列 HK / SG / US(参考 `HomeNavbar.vue:46-110` 逻辑，样式按 Zendesk header 语言重做):点击目标 region 写 cookie `region`(1 年，SameSite=Lax) 后 `window.location.assign('/{code}/')`(整页跳目标站首页);当前 region 只关菜单。dev 下跨站 404 属已知限制 (README 已记载)。

### 8.3 GitHub

- header 右侧 GitHub 图标 → `https://github.com/longbridge/docs`(新窗)。
- 文章页尾 "Edit this page on GitHub" → `https://github.com/longbridge/docs/edit/main/apps/us/docs/en/{cat}/{sec}/{article}.md`(内容路径未变，模板照搬即可用)。

### 8.4 Whale App 最小适配 (本期只做这些)

UA 含 `lbcommitid` → `<html class="is-whale-app">` + 禁缩放 viewport;主题跟随 UA/query(8.1 已含);`.is-whale-app` 下隐藏 web header 与 hover 效果 (作用域 CSS)。dsbridge 原生栏 / FAB 菜单 / 首页链接拦截 → **不做**,列为 follow-up，需产品确认 App 是否内嵌新站后再评估。

## 9. 与 Zendesk 站的有意偏差 (逐条向 boss 交底)

| 偏差 | 原因 |
|---|---|
| header 无 Ask AI 按钮 | 其目标 (Zendesk chat) 在静态站不存在;AI 抽屉已明确不保留。**如需占位请反馈** |
| header 无登录头像 / community / service catalog 入口 | 静态站无账号体系，社区不在范围 |
| 文章投票 "Was this article helpful?" UI 相同，但行为改为 localStorage 记录 (`lb_article_vote_{id}`),不显示票数 | 无 Zendesk votes API |
| recently viewed = 客户端 localStorage 列表;related = 构建期同 section 相邻文章 (≤4) | 无平台推荐 API，行为确定性更好 |
| 搜索数据层 Pagefind,dev server 下弹窗仅显示历史 + 提示 (索引在 build 后生成，`astro preview` 验证完整功能) | 静态索引 constraint |
| 无评论区 | 原主题 `show_article_comments=false`,本就没开 |
| `lb_agreement` 协议全宽模板 deferred | 同步数据不含模板归属信息 |

## 10. 风险与坑 (执行者必读)

1. **CSS 时间线陷阱**:style.css 定制层按日期追加，同一组件有多版规则;**永远以文件末尾为准**(hero 亮薄荷 #C2FFF7 在 8983 行起，早期深色 #070707 已废)。
2. **变量坑**:见 §5.3，不要照抄 `var(--primary)` 之类未定义变量。
3. **raw HTML 透传**:fees-charges 文章含 `<table>`/`<span>` 残留，渲染管线禁 sanitize;验收必查该页。
4. **CI 注释误导**:仓库内 GitLab/OSS/CDN 相关注释是历史目标态;现实部署以 `.github/workflows/deploy.yml`(GitHub Pages) 为准。`ASSETS_CDN_PREFIX` 当前未启用，Astro 版不实现 CDN 改写。
5. **线上站抓取限制**:WebFetch 被 Cloudflare 403;视觉对照必须用真实浏览器 (chrome-devtools MCP / Playwright)。
6. **内容目录只读**:除一次性删除 `docs/en/index.md`、`graph.md` 外，任何任务不得写 `apps/us/docs/en/**`(会被 sync 覆盖)。
7. **禁全量重检查**:验证一律 scoped(`astro check` 限 apps/us、`bun test` 限 apps/us);不跑仓库级全量 build 除非最终验收 (hk/sg 回归各跑一次 build 即可)。

## 11. 自动同步 (webhook 准实时 + 定时兜底)

> 已批准追加 (2026-09-01)。静态架构下的时效上限:Zendesk 发布 → 全站生效约 3-5 分钟。落地为 implementation-plan Task 14。

### 11.1 链路

```
Zendesk 文章 published/unpublished 事件
  → Zendesk Webhook(POST + Bearer=GitHub fine-grained PAT)
    → GitHub API repository_dispatch(event_type: zendesk-sync)
      → deploy.yml:sync → commit 回 main → build → deploy(单 workflow 内完成)
```

设计要点：
- **单 workflow**:改造现有 `deploy.yml`(新增 `repository_dispatch` + `schedule` 触发器与两个条件步骤),不建独立 sync workflow——`GITHUB_TOKEN` 的 push 不会再触发 workflow，内容提交回 main 不引发第二次构建，本次 run 自己接着 build，天然防循环。
- **防抖**:`concurrency: { group: deploy, cancel-in-progress: true }`,连续发布多篇只落最后一次构建。
- **定时兜底**:`cron: '17 */6 * * *'`(每 6 小时，错开整点),覆盖 webhook 丢失/Zendesk 事件故障。
- 忽略 webhook 载荷，全量 sync 幂等且内容量小 (en-us 约 60 篇，<10 个 API 请求)。

### 11.2 Zendesk 侧配置 (人工，一次性)

Admin Center → Apps and integrations → Webhooks → Create webhook:订阅 Article **published + unpublished** 事件 (unpublished 触发 prune 删稿;确切事件名以后台事件目录为准，执行时核实);Endpoint `https://api.github.com/repos/longbridge/docs/dispatches`,POST/JSON;Auth = Bearer(GitHub fine-grained PAT:**仅本 repo + 仅 Contents:write + 设过期**);Body 固定 `{"event_type":"zendesk-sync"}`;用 Test webhook 验证。

### 11.3 同步器认证改可选

实测 (2026-09-01) 本站 Help Center API 匿名可读 (HTTP 200,Cloudflare 只拦 HTML 页)。`scripts/zendesk/client.ts` 改为：环境变量存在则带 Basic Auth，缺省则匿名请求;**产出契约与 draft 过滤逻辑不变**。收益:CI 可不配 Zendesk 凭据;保留认证路径作为逃生通道 (GitHub Actions 机房 IP 被 Cloudflare 挑战、或帮助中心未来改为登录可见时，配上 Secrets 即恢复，零代码回滚)。

### 11.4 凭据清单

| 凭据 | 位置 | 必需性 |
|---|---|---|
| GitHub fine-grained PAT(仅 Contents:write) | Zendesk webhook Bearer 配置 | 必需 |
| Zendesk email/token | GitHub Secrets(`ZENDESK_*`,变量名以 `apps/us/.env.example` 为准) | 可选 (§11.3 后仅作逃生通道) |

全程 token 只存在于 GitHub Secrets / Zendesk webhook 配置 / 本地 `.env.local` 三处，不进代码不进 git。
