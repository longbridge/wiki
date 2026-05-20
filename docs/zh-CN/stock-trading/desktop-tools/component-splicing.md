---
layout: doc
sidebar: true
---

# 组件拼接

组件拼接仅在**自适应布局**模式下可用，允许将多个组件合并到同一区域，通过切换 Tab 页查看不同组件内容，解决屏幕空间不足时多组件平铺遮挡数据的问题。

## 主要特色

- **直观导航**：通过 Tab 轻松切换所需功能或组件
- **节省空间**：多个组件共享一块区域，按需切换显示
- **流畅体验**：在客户端切换内容面板，不触发整页刷新

![组件拼接示意](https://pub.pbkrs.com/uploads/2025/69420ca287a91ae155334be2fa1bc478)

## 阴影色块说明

拖动组件到目标组件上时，会出现蓝色阴影色块，颜色块位置决定拼接方式：

- **阴影出现在目标组件上、下、左、右侧**：表示将新组件放置在目标组件旁边，**不进行拼接**

  ![阴影色块 - 上方](https://pub-canary.lbkrs.com/uploads/2023/f6b8bb7f18ad70b66886e8b92f754c6f)

  ![阴影色块 - 下方](https://pub-canary.lbkrs.com/uploads/2023/c754fa0d2aad777c747cb3aa828f6f72)

  ![阴影色块 - 左侧](https://pub-canary.lbkrs.com/uploads/2023/51b7b2cc70e7d71aaaab37011294955c)

  ![阴影色块参考](https://pub-canary.lbkrs.com/uploads/2023/3e5f2d598b3797d91d3adf51da05f649)

- **阴影色块完全占满目标组件**：松开鼠标后即完成拼接。需将新组件移动至目标组件**中间区域**，以触发整块阴影。

  以下示例为将「7×24 快讯」拼接进「图表」组件：

  ![完整阴影拼接示例](https://pub.pbkrs.com/uploads/2025/73e39d7198e6b77e149b8d25da570200)

## 拼接操作

### 两个独立组件拼接

按住组件拖动至目标组件中间区域，待整块蓝色阴影出现时松开鼠标。

![两个独立组件拼接](https://pub-canary.lbkrs.com/social/2023/0/GWZWMhM1hayFMH1VRgwPhNAiNPMzsBQf.jpg)

### 将独立组件拼接进已有组合

**方式一**：将组件拖动至已有组合的中间区域，整块蓝色阴影出现时松开，新组件将追加为最后一个 Tab。

![拼接进已有组合 - 方式一](https://pub-canary.lbkrs.com/social/2023/0/gU48LLc6dQL4qbucv7PJpyJUqBauYuDB.jpg)

**方式二**：将组件拖动至已有组合的**顶部选项卡区域**，选项卡位置出现蓝色阴影时松开，新组件追加为最后一个 Tab。

![拼接进已有组合 - 方式二](https://pub-canary.lbkrs.com/social/2023/0/eEAYENDwSnHpBh7fZ1CknpkP97eLCMJB.jpg)

### 整体移动拼接组件

按住拼接组件 Tab 栏的**空白区域**，可将整个拼接组件拖动到布局的其他位置，目标位置阴影规则与独立组件相同。

![整体移动拼接组件](https://pub-canary.lbkrs.com/uploads/2023/ba8b035267da417cb503b07162a7f2f6)

## 调整 Tab 顺序

选中需要移动的 Tab，按住拖动，目标 Tab 上出现蓝色阴影时松开，该组件将移动至此位置。拖动时鼠标下方会显示当前组件的缩略图。

![调整 Tab 顺序](https://pub-canary.lbkrs.com/uploads/2023/bf855b9ef920b236cd426d5f95511be3)

## 移除拼接中的组件

### 拖出为独立组件

按住目标组件的 Tab 进行拖动，移动到布局空白区域，出现蓝色阴影时松开，组件将独立显示在面板中。

![拖出为独立组件](https://pub-canary.lbkrs.com/social/2023/0/Ex5oqYDKZjaK9AAkh96sbayvRTW75zux.jpg)

### 从拼接中移除组件

点击组件右上角「…」> **移除**，将该组件从拼接组合中删除。

![从拼接中移除组件](https://pub-canary.lbkrs.com/social/2023/0/aQHqzFxMCG3EDe9MAbxF1ibp3UoRse2r.jpg)

### 将组件脱离为独立窗口

点击组件右上角「…」> **脱离**，组件将以独立浮动窗口形式运行。

![脱离为独立窗口](https://pub-canary.lbkrs.com/social/2023/0/hKLZBoFtoo7tDkMFGZYAckUfTvWpSZFw.jpg)

## 组件数量限制

同一页面最多支持打开 **15 个组件**，组件拼接中的每个子组件均计入此上限。

<!-- backlinks:start -->

## 引用此页面的文档

- [自定义布局](/stock-trading/desktop-tools/custom-layout)
- [桌面端工具](/stock-trading/desktop-tools)

<!-- backlinks:end -->
