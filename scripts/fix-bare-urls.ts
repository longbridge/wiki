import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const docsRoot = join(import.meta.dirname, '../docs')

function collectMdFiles(dir: string): string[] {
  const result: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      result.push(...collectMdFiles(full))
    } else if (entry.endsWith('.md')) {
      result.push(full)
    }
  }
  return result
}

function fixBareUrls(content: string): string {
  const lines = content.split('\n')
  return lines.map(line => {
    // 已经是 markdown 链接 [text](url) 的，跳过
    // 处理：`label：URL` 或 `label: URL`（中英文冒号）
    // 匹配：不在 []() 中的裸 URL

    // 先跳过已有 markdown 链接语法的行（即 URL 已在括号内）
    // 用正则逐步替换

    // 模式1: `> label：URL` 或 `label：URL`（中文冒号，label 在 URL 前）
    // 将 "任意文字：https://..." 转为 "[任意文字](https://...)"
    line = line.replace(
      /^(>?\s*)([^：\[\n]+[^\s：])：(https?:\/\/\S+)$/,
      (_, prefix, label, url) => `${prefix}[${label.trim()}](${url})`
    )

    // 模式2: `label: URL`（英文冒号+空格）
    line = line.replace(
      /^(>?\s*)([^:\[\n]+[^\s:]):\s(https?:\/\/\S+)$/,
      (_, prefix, label, url) => `${prefix}[${label.trim()}](${url})`
    )

    // 模式3: `- URL` 单独的 bullet URL
    line = line.replace(
      /^(\s*-\s)(https?:\/\/\S+)$/,
      (_, bullet, url) => `${bullet}[${url}](${url})`
    )

    // 模式4: 句子末尾或行内裸 URL（前面有中文内容，非冒号分隔）
    // 例如 "xxxx参考收费表：https://..." 已被模式1处理
    // 例如 "更多信息请参考新加坡交易所官网：https://..." 已被模式1处理
    // 其余行内裸 URL（URL 不在 []() 内）
    line = line.replace(
      /(?<!\()(?<!\[)(https?:\/\/\S+)(?!\))/g,
      (url) => `[${url}](${url})`
    )

    return line
  }).join('\n')
}

const files = collectMdFiles(docsRoot)
let count = 0

for (const file of files) {
  const original = readFileSync(file, 'utf-8')
  const fixed = fixBareUrls(original)
  if (fixed !== original) {
    writeFileSync(file, fixed, 'utf-8')
    console.log(`✓ ${file.replace(docsRoot + '/', '')}`)
    count++
  }
}

console.log(`\n共处理 ${count} 个文件`)
