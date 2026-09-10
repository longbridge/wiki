// 站点 SEO 单一来源：规范生产域 + OG 大图绝对 URL(canonical / og / JSON-LD 共用，
// 避免在 BaseLayout 与各 layout 里重复硬编码)。base 固定 /us/en/support/。
export const SITE_ORIGIN = 'https://longbridge.com'
export const OG_IMAGE = SITE_ORIGIN + '/us/en/support/og-image.png'

/**
 * 从文章正文 markdown 派生 meta description:取第一段正文，去掉 markdown 语法，
 * 截断到 ~155 字 (词边界)。派生不出来时返回 undefined，由调用方回退默认简介。
 */
export function deriveDescription(body: string | undefined): string | undefined {
  if (!body) return undefined

  // 找第一段"正文":跳过空行、标题 (# 开头)、纯图片行;列表项也算正文
  let para = ''
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('#')) continue
    if (line.startsWith('![')) continue
    para = line
    break
  }
  if (!para) return undefined

  const text = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 → 保留文字
    .replace(/`([^`]*)`/g, '$1') // 行内代码
    .replace(/[*_~]/g, '') // 粗体/斜体/删除线符号
    .replace(/<[^>]+>/g, '') // 内联 HTML 标签
    .replace(/^[-*+]\s+/, '') // 列表项前缀
    .replace(/^\d+\.\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return undefined

  const MAX = 155
  if (text.length <= MAX) return text
  return text.slice(0, MAX).replace(/\s+\S*$/, '') + '…' // 词边界截断
}
