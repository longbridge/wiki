/** Pure core — accepts an explicit base so unit tests don't need import.meta.env */
export function applyBase(path: string, base: string): string {
  const b = base.replace(/\/$/, '') // normalise trailing slash → '/us'
  return path.startsWith(b + '/') || path === b ? path : b + path
}

export function withBase(path: string): string {
  return applyBase(path, import.meta.env.BASE_URL)
}
