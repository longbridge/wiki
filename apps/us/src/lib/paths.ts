export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // '/us'
  return path.startsWith(base + '/') || path === base ? path : base + path
}
