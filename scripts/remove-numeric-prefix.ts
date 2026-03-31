/**
 * 去除文档目录和文件名中的数字前缀
 * 例如：01-账户管理 → 账户管理，1.1-开户 → 开户
 */
import { readdirSync, statSync, readFileSync, writeFileSync, renameSync } from 'fs'
import { join, relative } from 'path'

const docsRoot = join(import.meta.dirname, '../docs')

function stripPrefix(name: string): string {
  // 匹配 "01-", "1.1-", "16.4-" 等数字前缀
  return name.replace(/^\d+(\.\d+)*-/, '')
}

function hasNumericPrefix(name: string): boolean {
  return /^\d+(\.\d+)*-/.test(name)
}

// 收集所有需要重命名的目录（按路径深度从深到浅排序，避免先改父目录导致子目录找不到）
function collectDirs(dir: string): string[] {
  const result: string[] = []
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      result.push(...collectDirs(full))
      if (hasNumericPrefix(entry)) {
        result.push(full)
      }
    }
  }
  return result
}

// 收集所有 md 文件
function collectMdFiles(dir: string): string[] {
  const result: string[] = []
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      result.push(...collectMdFiles(full))
    } else if (entry.endsWith('.md')) {
      result.push(full)
    }
  }
  return result
}

// 第一步：构建旧路径段 → 新路径段 的映射（只针对目录名）
// 遍历所有目录，建立替换映射
function buildRenameMap(dir: string): Map<string, string> {
  const map = new Map<string, string>()
  function walk(d: string) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry)
      if (statSync(full).isDirectory()) {
        if (hasNumericPrefix(entry)) {
          map.set(entry, stripPrefix(entry))
        }
        walk(full)
      }
    }
  }
  walk(dir)
  return map
}

const renameMap = buildRenameMap(docsRoot)

console.log('目录重命名映射：')
for (const [old, newName] of renameMap) {
  console.log(`  ${old} → ${newName}`)
}
console.log()

// 第二步：按从深到浅顺序重命名目录
const dirsToRename = collectDirs(docsRoot)
for (const oldPath of dirsToRename) {
  const parent = oldPath.substring(0, oldPath.lastIndexOf('/'))
  const name = oldPath.substring(oldPath.lastIndexOf('/') + 1)
  const newName = stripPrefix(name)
  const newPath = join(parent, newName)
  renameSync(oldPath, newPath)
  console.log(`✓ rename dir: ${name} → ${newName}`)
}
console.log()

// 第三步：更新所有 md 文件中的路径引用
// 将所有路径中出现的 "数字前缀-xxx" 替换为 "xxx"
const mdFiles = collectMdFiles(docsRoot)

// 构建正则：按长度降序排列，避免短的先匹配
const patterns = Array.from(renameMap.entries())
  .sort((a, b) => b[0].length - a[0].length)

let updatedFiles = 0
for (const file of mdFiles) {
  let content = readFileSync(file, 'utf-8')
  let changed = false
  for (const [oldSeg, newSeg] of patterns) {
    // 替换路径中出现的目录名段（在 / 之间，或行尾）
    const escaped = oldSeg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(escaped, 'g')
    if (re.test(content)) {
      content = content.replace(re, newSeg)
      changed = true
    }
  }
  if (changed) {
    writeFileSync(file, content, 'utf-8')
    console.log(`✓ update links: ${relative(docsRoot, file)}`)
    updatedFiles++
  }
}

console.log(`\n共更新 ${updatedFiles} 个文件的链接`)
