---
name: Longbridge Docs
description: 长桥证券官方帮助中心，AI 问答 + 专题文档
colors:
  brand: "#00B8B8"
  brand-dark: "#00F0C4"
  brand-aux: "#E5F8F8"
  brand-aux-dark: "#09252A"
  text-primary: "#0A0E19"
  text-secondary: "#6C6E75"
  text-tertiary: "#A9ABAE"
  bg-primary: "#FFFFFF"
  bg-secondary: "#F3F5F6"
  bg-primary-dark: "#0A0E19"
  bg-secondary-dark: "#232630"
  divider: "#DDDDDF"
  border: "#E6E7E8"
  status-up: "#00ADA2"
  status-down: "#FF3A75"
  status-error: "#F7415F"
  status-warning: "#FF9728"
  status-success: "#00CC92"
  status-info: "#2A99FE"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 20px"
  button-primary-disabled:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 20px"
  button-tertiary:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brand}"
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.bg-primary}"
    rounded: "{rounded.sm}"
    padding: "16px"
  card-ai:
    backgroundColor: "{colors.bg-secondary-dark}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Longbridge Docs

## 1. Overview

**Creative North Star: "The Expert Guide"**

这套设计系统是一份经过校对的专业简报，不是热线客服台，也不是知识库工具。每个页面的职责只有一件：精确回答用户的那个问题，然后让他离开去执行。装饰是耗时成本。信息层次是信任基础。温度来自清晰，不来自温暖色调。

双主题（Light / Dark）是产品承诺，不是功能可选项。Light 模式是大多数散户白天在手机上查阅文档的场景，高对比度，内容密度适中。Dark 模式是 AI 功能的原生场景，也是夜间交易者的首选。两套主题之间的切换不应有视觉跳跃，颜色语义严格对应。

本系统明确拒绝：传统银行官网的密集蓝灰感和 PDF 式导航；Notion/Confluence 的极简白底工具感（品牌辨识为零）；券商营销页的红绿配色和大 Banner 视觉噪音；以及任何一眼可辨为 AI 产出的模板特征，包括渐变文字、玻璃态堆叠卡片和相同尺寸的图标格。

**Key Characteristics:**
- 平坦为默认，阴影只回应交互状态
- 品牌色（Longbridge Teal）是稀缺资源，不超过屏幕面积 10%
- AI 场景固定使用深色底，与普通内容形成明确区隔
- 移动端优先：触摸目标 ≥44px，中文行高 ≥1.7
- 分隔线固定 0.5px，描边固定 1px，不允许自定义同义值

## 2. Colors: The Precision Palette

双主题语义色系，Light 为主，Dark 作为平等的公民存在。每一个 token 都有且仅有一个唯一意义，不允许创建同义色值。

### Primary
- **Longbridge Teal** (`#00B8B8`，Dark: `#00F0C4`): 品牌的唯一代言。仅用于主按钮、强调操作、链接、激活状态和进度指示。在任何给定屏幕上，它的出现面积不超过 10%，其稀缺性即是其力量。Dark 模式下升温为薄荷绿，保持同等视觉权重。
- **Teal Whisper** (`#E5F8F8`，Dark: `#09252A`): 品牌辅助背景。用于徽章、品牌语境的卡片底色或选中状态背景，不用于大面积填充。

### Neutral
- **Deep Ink** (`#0A0E19`，Dark: `#FFFFFF`): 标题和正文的唯一文字色。不是纯黑，带轻微冷蓝倾向，与品牌色形成内在呼应。Dark 模式翻转为纯白，不带色偏。
- **Muted Slate** (`#6C6E75`，Dark: `#9D9FA3`): 次级信息、辅助标签、时间戳。不用于正文，不用于标题。
- **Subdued Chalk** (`#A9ABAE`，Dark: `#60626A`): 三级文字色。仅限免责声明、法律条款，严禁用于任何正文或交互元素。
- **Clean Surface** (`#FFFFFF`，Dark: `#0A0E19`): 页面主背景。Light 纯白，Dark 深墨蓝。
- **Frost** (`#F3F5F6`，Dark: `#232630`): 卡片、输入框、代码块的背景。比主背景暗一级，提供无边框的视觉分层。
- **Hairline** (`#DDDDDF`，Dark: `#3B3E47`): 分隔线专用，固定 0.5px，不用于描边。
- **Perimeter** (`#E6E7E8`，Dark: `#2C3039`): 描边专用，固定 1px，不用于分隔线。

### Secondary: Status Colors
交易情境的状态色，与品牌色不重叠，浅深主题通用：
- **Market Teal** (`#00ADA2`): 上涨、盈利状态，偏绿调以区别于品牌蓝绿。
- **Alert Rose** (`#FF3A75`): 下跌、亏损状态。
- **Critical** (`#F7415F`): 错误、删除操作。
- **Amber** (`#FF9728`): 预警、风险提示。
- **Confirm** (`#00CC92`): 成功、完成操作。
- **Sky** (`#2A99FE`): 信息提示、中性通知。

### Named Rules
**The Single Voice Rule.** 品牌色 Longbridge Teal 在任意屏幕上的占比不超过 10%。超过这个比例，它就成了背景噪音；在这个比例内，它是用户注意力的精确导向。

**The Semantic Lock Rule.** 每个 token 只有一个用途。`--lbus-divider` 只做分隔线，`--lbus-border` 只做描边，不允许互换，不允许用 hex 字面量代替。新增色值前必须确认现有 token 无法满足需求。

## 3. Typography

**Body Font:** system-ui → -apple-system → PingFang SC → Microsoft YaHei → sans-serif

使用系统字体栈。在 iOS 上是 SF Pro + PingFang，在 Android 上是 Roboto + Noto Sans，在 Windows 上是 Segoe + Microsoft YaHei。零加载成本，原生渲染质量，中英文各得其所。

**Character:** 不寻求字体个性。字体本身应当透明，让信息层次成为视觉焦点。字号和字重的对比度是层次感的唯一来源，不依赖装饰性字体。

### Hierarchy
- **Display** (800, `clamp(2.4rem, 6vw, 4rem)`, line-height 1.15, tracking −0.02em): 首页 Hero 主标题。全站仅此一处使用。letter-spacing 收紧，使大字号在中文排版下不显松散。
- **Headline** (700, `clamp(1.5rem, 3vw, 2rem)`, line-height 1.25): 章节大标题，如「9 大专题，系统覆盖」。
- **Title** (600, `1rem/16px`, line-height 1.4): 卡片标题、导航标签、弹出层标题。
- **Body** (400, `15px`, line-height 1.7): 所有正文内容。行高 1.7 是中文阅读舒适度下限，不可低于此值。段落宽度限制在 65–75ch，超宽屏幕不拉伸正文列。
- **Label** (500, `13px`, line-height 1.4, tracking +0.01em): 导航项、徽章、按钮文字、元数据标签。500 字重确保小号中文不因字重不足显得模糊。

### Named Rules
**The 1.7 Floor Rule.** 中文正文 `line-height` 不得低于 1.7。低于此值的段落在手机屏幕上阅读会产生行与行之间的视觉拥挤感，直接破坏「清晰」的品牌承诺。

**The Weight Contrast Rule.** 相邻层级的字重差不小于 100。Display(800) → Headline(700) → Title(600) → Body(400)：每一级降 100–200，视觉上步步可辨。避免同屏出现两个 700 字重的元素互相竞争。

## 4. Elevation

本系统默认平坦。静态卡片不带阴影，靠背景色层叠（`bg-primary` vs `bg-secondary`）实现分层。阴影是交互响应，不是装饰手段。

### Shadow Vocabulary
- **Collapsed** (`0 1px 4px rgba(0,0,0,0.06)`，Dark: `rgba(0,0,0,0.18)`): 折叠卡片、行内展开内容，轻触式存在感。
- **Card** (`0 2px 8px rgba(0,0,0,0.08)`，Dark: `rgba(0,0,0,0.24)`): 悬停卡片、激活的内容块。静止时不出现，hover/focus 时出现。
- **Dropdown** (`0 4px 12px rgba(0,0,0,0.12)`，Dark: `rgba(0,0,0,0.32)`): 下拉菜单、浮动面板。只用于脱离文档流的浮层。

### Named Rules
**The Flat-by-Default Rule.** 任何静止状态的表面不带阴影。阴影出现意味着「此处发生了交互」，不是「此处是一张卡片」。滥用阴影等同于滥用强调，结果是强调失效。

**The Three-Layer Ceiling Rule.** 最多三层阴影级别，不引入第四层。`collapsed` 是内容，`card` 是浮动内容，`dropdown` 是脱流浮层。层级超过三层时重新审视信息架构而非增加阴影级别。

## 5. Components

### Buttons

形状保守，语义清晰。圆角 6px，不使用全圆角（pill）形状，除非是搜索框或 badge 类元素。

- **Shape:** 轻微圆角（6px），传递专业克制感而非消费级友好感。
- **Primary (LG/MD):** 背景 `#00B8B8`，白色文字，`height: 44px/36px`，`padding: 0 20px`。同屏不出现两个及以上大型 Primary 按钮。
- **Secondary:** 透明背景，`1px solid #E6E7E8`，`--lbus-text-primary` 文字。等级低于 Primary，用于次要操作。
- **Tertiary:** `#F3F5F6` 背景，`--lbus-text-primary` 文字。比 Secondary 更低调，用于第三优先级操作。
- **Ghost (SM only, 28px):** 透明背景，`1px solid #00B8B8`，品牌色文字。仅 SM 尺寸使用，用于内联的品牌操作链接，不用于页面主操作。
- **Disabled:** 背景 `#F3F5F6`，文字 `#A9ABAE`，`opacity: 0.7`，`pointer-events: none`。
- **Hover/Pressed:** 所有变体叠加 `rgba(10,14,25,0.05)` 蒙层，`transition: 200ms ease`。不使用颜色切换，使用透明度叠加。

### Cards / Containers

- **Corner Style:** 普通卡片 6px；AI 功能卡片 12px；浮层/抽屉仅顶部 18px（`border-radius: 18px 18px 0 0`）。
- **Background (Light):** `#FFFFFF`（内容卡片）或 `#F3F5F6`（嵌套容器）。不使用相同背景色的嵌套卡片。
- **Background (Dark):** `#232630`（卡片）嵌于 `#0A0E19`（页面背景）。
- **Shadow Strategy:** 静止无阴影；hover 时出现 Card 级阴影。
- **Border:** `1px solid #E6E7E8`（Light）/ `1px solid #2C3039`（Dark）。当卡片背景与页面背景有对比时可省略边框。
- **Internal Padding:** 标准 16px；紧凑列表 8px；宽松展示 24px。

### Inputs / Fields

- **Style:** 背景 `#F3F5F6`，`border-radius: 6px`，无描边（静止态）。
- **Focus:** `1px solid #00B8B8`，轻微品牌色 glow `0 0 0 3px rgba(0,184,184,0.12)`，过渡 200ms ease。
- **Placeholder:** 颜色 `#A9ABAE`（Subdued Chalk），不使用 italic。
- **Error:** `1px solid #F7415F`，提示文字 `#F7415F`，12px，输入框下方 4px 间距显示。
- **Disabled:** `opacity: 0.5`，`pointer-events: none`。

### Navigation

首页使用双行自定义导航栏（HomeNavbar）；文档内页使用 VitePress 默认侧边栏。

- **Top Bar (HomeNavbar Row 1, height 52px):** 背景 `var(--vp-c-bg)`，底部 `1px solid rgba(0,0,0,0.06)`。Logo + 搜索/AI 中心区 + 登录注册。
- **Bottom Bar (Row 2, height 40px):** 主题标签页 + 外部链接。标签默认色 `#666`，激活色 `#18e299`（亮绿），底部 2px 激活线。
- **Active State:** 字重 500 + 2px 底线，颜色使用 `#18e299`（与品牌 Teal 形成场景区分，更亮、可辨度更高的激活信号）。
- **Mobile (≤768px):** 底行隐藏，精简为 Logo + 搜索图标 + 登录按钮。

### AI Feature Components

AI 场景固定使用深色配色，即使系统处于 Light 模式。这是品牌策略：AI 是长桥的差异化功能，需要独立视觉语言以传递「进入了一个不同的模式」。

- **AI 卡片:** 背景 `#232630`，`border-radius: 12px`，`1px solid #2C3039`。
- **AI 按钮/高亮:** `#00F0C4`（Longbridge Mint）。
- **AI 对话文字:** 主文字 `#FFFFFF`，次文字 `#9D9FA3`。
- **AI 分隔线:** `0.5px solid #3B3E47`。

### Form Controls

- **Switch (32×32 容器，16×16 滑块):** On 态：滑块 `#00B8B8`，轨道 `rgba(0,184,184,0.25)`；Off 态：滑块 `#6C6E75`，轨道 `rgba(108,110,117,0.25)`。轨道圆角 10px，过渡 200ms ease。禁用时整组件 `opacity: 0.5`。
- **Checkbox (20×20):** 选中背景 `#00B8B8`，勾 `#FFFFFF`，`border-radius: 4px`；未选中 `1px solid #E6E7E8`；禁用选中背景 `#A9ABAE`。
- **Radio (20×20):** 外圈 `2px solid #00B8B8`；内实心圆 `#00B8B8`，`border-radius: 50%`；未选中外圈 `1px solid #E6E7E8`。

## 6. Do's and Don'ts

### Do:
- **Do** 使用 UX 5.0 token 名称（如 `--lbus-brand`、`--lbus-text-secondary`），不自造同义色值。
- **Do** 保持分隔线 `0.5px`、描边 `1px`，全站统一不漂移。
- **Do** 确保正文 `line-height ≥ 1.7`，手机端中文阅读是主要场景。
- **Do** 在 AI 场景（对话、AI 功能模块）固定使用深色底，即使系统处于 Light 模式。
- **Do** 让阴影回应状态：hover 卡片出现 Card 阴影，静止卡片无阴影。
- **Do** 限制 Primary 按钮数量：同屏最多一个大型 Primary 按钮。
- **Do** 浮层/抽屉仅顶部使用 18px 圆角，底部圆角为 0。
- **Do** 触摸目标不低于 44px（高度），确保手机端可靠触达。
- **Do** 在 `prefers-reduced-motion` 媒体查询下禁用动画，仅保留即时状态切换。

### Don't:
- **Don't** 使用传统银行官网的密集蓝灰配色和多级官僚导航——这是第一反例，明确禁止。
- **Don't** 让设计退化为 Notion/Confluence 极简白底工具风，品牌辨识度为零。
- **Don't** 引入券商营销页的红绿配色或大 Banner 促销视觉——长桥帮助中心不是营销页。
- **Don't** 使用 `background-clip: text` + 渐变制造彩虹/金属渐变文字——AI 生成感的典型特征，禁止。
- **Don't** 使用玻璃态（backdrop-filter blur）作为默认卡片装饰——此为 glassmorphism 滥用，除非有明确交互意图且极度克制。
- **Don't** 创建相同尺寸的图标卡片格（icon + heading + text 重复 N 次）——这是「AI 做的」的视觉证据，重新设计版块结构。
- **Don't** 使用 `border-left` 或 `border-right` 大于 1px 的彩色条纹装饰卡片或列表项——这是被明确禁止的 side-stripe 模式。
- **Don't** 在卡片嵌套中使用相同背景色——嵌套卡片必须有至少一个层级的背景色差异，否则删除嵌套层。
- **Don't** 引入第四层阴影级别——最多三层（collapsed/card/dropdown），超出时重审信息架构。
- **Don't** 对 AI 卡片使用 Light 模式配色——AI 场景强制深色，这是品牌差异化决策，不是主题跟随。
