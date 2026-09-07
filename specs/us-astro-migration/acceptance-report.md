# US Astro 迁移 —— 验收报告

- 日期:2026-09-01
- 分支：`feat/us-astro-migration`
- 基线：`af1d612`(计划提交) → 当前 `f46f978`
- 配套：`design.md`(spec)、`implementation-plan.md`(14 任务)

## 0. 总览

`apps/us` 已从 VitePress 2 重建为 **Astro 7 静态站**,视觉/交互对齐 Zendesk 主题 (`/Users/tangyu/Downloads/Longbridge_us`)。所有实现任务完成并提交;`hk`/`sg` 未改动。

- **构建**:三站全量 build 通过 (`ALLOW_HEAVY=1 bun run build`,exit 0);hk/sg VitePress + us Astro 各自产物就位。
- **类型/质量**:`apps/us` `astro check` = 0 errors / 0 warnings(1 个既有 hint:theme-mode.js `addListener` 降级，故意保留)。
- **页面**:us 产 56 个 HTML 页 (6 分类 overview + 各 section overview + 36 篇文章 + home + 404)。
- **搜索**:Pagefind 构建期索引 **36 篇文章内容页**(通过 `data-pagefind-body` 限定，排除 nav/footer/overview/home,搜索只返回文章)。

## 1. 任务完成与提交

| Task | 内容 | 提交 | 评审 |
|---|---|---|---|
| 1 | Astro 脚手架 (替换 VitePress 壳) | af1d612..956ad91 | ✅ clean |
| 2 | 内容层:collection + nav 构建器 + 链接改写 (TDD) | ..0919356 | ✅ (1 fix round:补测) |
| 3 | 设计 token + base 样式 + 明暗引导 | ..0040bf8 | ✅ clean(暗色值逐一核对 style.css) |
| 4 | BaseLayout + Header(mega/region/theme/github) + Footer | ..894a60a | ✅(1 门修复 + 2 评审 fix:github URL/footer 变体/cookie/暗色选择器/hero 透明态) |
| 5 | SideTree + 移动 CatDrawer + cat-icons 抽取 | ..46f1ba1 | ✅(1 fix:可导航头/容器滚动/死 CSS/drawer a11y) |
| 6 | 搜索弹窗 + Pagefind | ..d79a673 | ✅(1 fix:history 存 query 对齐 Zendesk;XSS 核实安全) |
| 7 | 首页 hero + catx | ..192ead7 | ✅(2 fix:文案 verbatim/卡片 sub+ 箭头/grid 断点/tab 滚动+fade/catx fallback/header 透明字归并) |
| 8 | 文章路由 + ArticleLayout + 排版 + 尾部 | ..a032341 | ✅(1 fix:edit 文案/recently-viewed 无 JS 泄漏) |
| 9 | 文章 TOC 桌面栏 + 移动 FAB/抽屉 | ..68db23c | ✅ clean(控制器实现，子代理上下文超限)|
| 10 | 分类/小节 overview 页 | ..d4f7125 | ✅ clean(§4 约定 dist 零违规) |
| 11 | 404 + Whale 最小适配 | ..f763983 | ✅ clean |
| 12 | CI deploy.yml us 路径 + README + 三站回归 | ..7f6b646 | ✅(控制器，build 回归绿) |
| — | 搜索索引限定 `data-pagefind-body`(build 回归发现) | ..6491d1a | ✅ 57→36 页 |
| 14 | webhook 自动同步 + 定时兜底 + 认证可选 | ..f46f978 | 代码/YAML 验证通过;端到端见 §5 手动项 |

## 2. 交互清单 I1–I12(spec §7)

均已实现，并经**代码审阅 + 构建产物结构核实**;**实时交互与像素对照需手动浏览器验证 (见 §4)**。

| # | 交互 | 状态 |
|---|---|---|
| I1 | header 滚动过渡 (60px,rAF) | ✅ 代码/结构;hero 存在时 `.header--transparent` |
| I2 | All Topics mega(构建期数据，hover 200ms/ESC/外点/面板切换) | ✅ 6 分类构建期渲染 |
| I3 | catx tab 切换/过滤/12+Show more/边缘 fade | ✅ |
| I4 | 搜索弹窗 (⌘K/focus 开/hot-tag/?q=/history/mark) | ✅ Pagefind 索引就绪 |
| I5 | 移动分类抽屉 (委托/ESC/scroll-lock/链接即关/bfcache) | ✅ |
| I6 | side-tree 折叠 + current scrollIntoView(容器内) | ✅ |
| I7 | 文章 TOC 桌面栏 (伪标题启发式/position/spy/平滑滚动) | ✅ 代码忠实端口;运行时 JS 生成，像素待浏览器 |
| I8 | 移动 TOC FAB 拖拽吸附 + 抽屉 | ✅ |
| I9 | 表格内联宽度清洗 | ✅ |
| I10 | 明暗切换 (localStorage 层 + 系统跟随) | ✅ |
| I11 | region 切换 (cookie max-age + 整页跳) | ✅ |
| I12 | 移动菜单 aria + ESC(归一为 hamburger→cat-drawer) | ✅ |

## 3. 关键风险 (spec §10) 复核

1. **CSS 时间线陷阱** → 各任务以 style.css 末尾规则为准 (hero 亮薄荷 #C2FFF7)。✅
2. **变量坑 (§5.3)** → 全程用 `--accent-teal`(#00B8B8 / 暗 #00F0C4 / side-tree current #22E5CF),无 `var(--primary)` 等未定义变量。✅ 多任务评审确认。
3. **raw HTML 透传** → fees-charges 文章 dist 含 8×`<table>` + 108×wysiwyg，原样渲染，无 sanitize。✅
4. **CI 注释误导** → 以 `deploy.yml`(GitHub Pages) 为准;us 产物路径已改 `apps/us/dist`。✅
5. **线上抓取限制** → WebFetch 被 Cloudflare 403;像素对照需真实浏览器 (§4 手动)。⚠️ 环境阻塞
6. **内容目录只读** → 除删 `index.md`/`graph.md` 外未手改 `docs/en/**`。✅
7. **内链 /us 前缀** → rehype-base-links 生效，文章 dist 153×`href="/us/"`。✅

## 4. ⚠️ 需手动执行的浏览器验收 (环境阻塞，未由 AI 完成)

WebFetch 被 Cloudflare 403、Chrome profile 被占，AI 无法驱动浏览器对照线上站。请手动完成像素/实时交互签收：

```bash
cd apps/us && bun run build && bunx astro preview   # http://localhost:4321/us/
```

双开本地预览与 https://longbridgeus.zendesk.com/hc/en-us,逐页(桌面 1440 + 移动 390，亮/暗两主题) 对照：
- **首页**:hero 亮薄荷底 + 右侧插画位 + sun 光晕 + 标题 "Hi, how can we help?" + 5 hot-tag;catx tab 切换/Show more;header 透明→滚动白底过渡。
- **文章页**(如 fees-charges):正文排版、表格横向滚动、右侧 TOC 定位/spy/平滑滚动、side-tree 当前高亮、投票/related/edit 链接。
- **分类/小节 overview**:两列 section-tree、article-list、入口跳首篇文章。
- **搜索**:⌘K 开弹窗、输入出结果高亮、最近搜索、`?q=` 落地自动开 (注意:dev 无索引，须用 preview)。
- **交互 I1–I12** 逐项实测;明暗切换刷新记忆;region 切换 (dev/preview 跳 /hk/ 会 404 属预期，检查 cookie 写入即可)。
- **App 内嵌**(可选):UA 含 `lbcommitid` 时 header/TOC 隐藏。

允许差异:§5 有意偏差;文章集合差异 (线上可能有新增草稿变更)。

## 5. 需业务/运维执行的后续项 (非代码)

1. **Webhook 自动同步启用**(spec §11.2 Step 5):
   - GitHub:建 fine-grained PAT(仅 `longbridge/docs` 仓 + Contents:write + 设过期)。
   - Zendesk Admin → Webhooks:订阅 Article published + unpublished(事件名以后台为准);Endpoint `https://api.github.com/repos/longbridge/docs/dispatches`,POST/JSON,Bearer=PAT,Body `{"event_type":"zendesk-sync"}`;Test webhook 验证 Actions 触发。
   - CI 默认走匿名同步 (已实测 Help Center API 匿名 200);若被 Cloudflare 拦，repo 配 `ZENDESK_EMAIL`/`ZENDESK_API_TOKEN` Secret 并给 sync 步骤加 env。
2. **合并后端到端验证**:`repository_dispatch` 全链路、定时 cron 首次触发 (需在 main 上)。

## 6. 有意偏差 (spec §9)—— 交底

header 无 Ask AI 按钮 / 无登录头像 / 无 community·service 入口;投票用 localStorage 不显示票数;recently-viewed 客户端;related = 构建期同 section ≤4;搜索 Pagefind(dev 降级);无评论区;`lb_agreement` 协议全宽模板 deferred。

## 7. 遗留 minor(合并前可选清理，均非阻断)

- catx fallback:当前 0 篇 promoted → catx 显示各分类前 N 篇 (可改为去 Zendesk 标 promoted)。**已向 boss 交底，待定。**
- T6 `highlight()` 对 `&` 实体子串的罕见视觉瑕疵 (XSS 安全)。
- T9:drawer current 底色 0.1 vs 源 0.08;`.toc-drawer__cat:visited` 未定色 (访问过可能紫);`.is-current` 加了 font-weight 600。
- T10:overview 未 surfmv category/section 描述 (getNav 无该字段);dead `@media(min-width:1024px)` no-op;子 section 列表空数据未渲染。
- Whale `@media (hover:hover)` 全局 sweep deferred(WebView 少鼠标;T4 App 验证再看)。
- 404 为简化复刻 (spec §11 允许)。
