/**
 * 一次性脚本：把所有 _order.json 转换为 Rspress 约定的 _meta.json。
 * - VitePress 旧格式：["entry-a", "entry-b"]（仅 slug 字符串数组）
 * - Rspress 新格式：同样支持纯字符串数组（侧边栏 label 取自 md 的 H1）
 *
 * 同时把每个目录下未列入 _order.json 的 md / 子目录追加到末尾，避免漏掉条目。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dir ?? __dirname, '..', 'docs');

function walk(dir: string) {
  const orderFile = path.join(dir, '_order.json');
  if (fs.existsSync(orderFile)) {
    const order: string[] = JSON.parse(fs.readFileSync(orderFile, 'utf-8'));

    const entries = fs
      .readdirSync(dir)
      .filter(
        (e) =>
          !e.startsWith('.') &&
          !e.startsWith('_') &&
          e !== 'index.md' &&
          e !== 'index.mdx',
      );

    const known = new Set<string>();
    const ordered: string[] = [];
    for (const slug of order) {
      const match = entries.find(
        (e) => e === slug || e === `${slug}.md` || e === `${slug}.mdx`,
      );
      if (match) {
        ordered.push(match.replace(/\.(md|mdx)$/, ''));
        known.add(match);
      }
    }
    for (const e of entries.sort()) {
      if (!known.has(e)) ordered.push(e.replace(/\.(md|mdx)$/, ''));
    }

    const metaFile = path.join(dir, '_meta.json');
    fs.writeFileSync(metaFile, JSON.stringify(ordered, null, 2) + '\n', 'utf-8');
    console.log(`✓ ${path.relative(ROOT, metaFile)}`);
  }

  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
  }
}

walk(ROOT);
console.log('Done.');
