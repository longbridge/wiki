/// <reference path="./turndown-plugin-gfm.d.ts" />
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

// Zendesk `article.body` 是 HTML，统一转 Markdown。
// 策略：白名单化基础语义标签 + GFM 扩展 (表格 / 删除线 / 任务列表)。
// 内部链接改写走 rewriteLink 回调：调用方可传入把 `/hc/en-us/articles/12345`
// 转成本仓路径的函数。
export interface HtmlToMdOptions {
  /** 内部链接改写：输入原 href，返回新 href;返回 null 表示保留原样 */
  rewriteLink?: (href: string) => string | null
}

export function htmlToMarkdown(html: string, opts: HtmlToMdOptions = {}): string {
  const td = createTurndown()
  if (opts.rewriteLink) {
    // 覆盖 a 标签规则，做内链改写后再走默认渲染
    td.addRule('rewrite-link', {
      filter: 'a',
      replacement(content, node) {
        const el = node as HTMLAnchorElement
        const rawHref = el.getAttribute('href') ?? ''
        const title = el.getAttribute('title')
        const newHref = opts.rewriteLink!(rawHref) ?? rawHref
        const linkText = content.trim() || rawHref
        if (!newHref) return linkText
        return title ? `[${linkText}](${newHref} "${title}")` : `[${linkText}](${newHref})`
      },
    })
  }
  const md = td.turndown(html)
  // 归一化：去掉行尾空格 + 合并 3+ 空行 → 2 空行
  return md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

function createTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  })
  td.use(gfm)

  // 内联样式是内容语义的一部分 (Zendesk 用 color / font-size / font-weight 等做强调):
  // 带 style 的行内壳 (span / font) 整条原样保留为 `<span style="…">`
  // (Astro markdown 默认渲染原始 HTML;内部内容仍走 turndown，故内链改写不受影响)。
  // 只匹配行内壳：块级元素 (p / div / li 等) 带 style 时走各自默认规则 (结构不塌、丢样式),
  // 避免把整段包成 span 导致块级布局 (text-align / 段落间距) 错乱。
  // 纯装饰空节点 (无文本) 仍脱壳;双引号转义避免破坏属性。
  td.addRule('preserve-inline-styles', {
    filter: node =>
      node.nodeType === 1 &&
      (node as Element).hasAttribute('style') &&
      ['SPAN', 'FONT'].includes((node as Element).tagName),
    replacement(content, node) {
      const style = ((node as Element).getAttribute('style') ?? '').trim()
      if (!style || !content.trim()) return content
      return `<span style="${style.replace(/"/g, '&quot;')}">${content}</span>`
    },
  })

  // 空段落 / 空 div 直接吞掉
  td.addRule('empty-block', {
    filter(node) {
      if (node.nodeType !== 1) return false
      const el = node as Element
      const tag = el.tagName.toLowerCase()
      if (!['p', 'div', 'span'].includes(tag)) return false
      return el.textContent?.trim() === '' && el.querySelector('img, iframe, video, audio') === null
    },
    replacement() {
      return ''
    },
  })

  // 表格:GFM markdown 表格无法表达空表头格 / 行表头 / 合并单元格，turndown 的
  // gfm 表格规则遇到这类结构会直接把每个单元格拍平成独立段落 (丢掉整张表)。
  // 整块原样保留为 HTML(Astro markdown 渲染原始 HTML，样式由 .article-body table 接管)。
  // 后加的规则在 turndown 里优先级更高 (unshift 到队首),会先于 gfm 的 table 规则命中。
  td.addRule('table-raw', {
    filter: 'table',
    replacement(_content, node) {
      return '\n\n' + (node as Element).outerHTML + '\n\n'
    },
  })

  // Zendesk 有时候会插 `<div class="notice">…</div>` 之类的告警块，先转成普通引用
  // (未来可以映射到本仓的 ::: tip container，这里第一版保守走 blockquote)
  td.addRule('notice-to-blockquote', {
    filter(node) {
      if (node.nodeType !== 1) return false
      const cls = (node as Element).getAttribute('class') ?? ''
      return /\b(notice|callout|alert|admonition|warning|tip)\b/.test(cls)
    },
    replacement(content) {
      return '\n\n> ' + content.trim().replace(/\n/g, '\n> ') + '\n\n'
    },
  })

  return td
}
