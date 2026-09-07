/** Pure core — accepts an explicit base so unit tests don't need import.meta.env */
export function applyBase(path: string, base: string): string {
  const b = base.replace(/\/$/, '') // normalise trailing slash → '/us/en/support'
  // 站点 trailingSlash:'never':首页必须是 '/us/en/support'(带尾斜杠的 '/us/en/support/' 会 404)
  if (path === '/') return b || '/'
  return path.startsWith(b + '/') || path === b ? path : b + path
}

export function withBase(path: string): string {
  return applyBase(path, import.meta.env.BASE_URL)
}
