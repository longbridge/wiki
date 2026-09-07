import { defineMiddleware } from 'astro:middleware'

/**
 * 仅 dev 生效：给所有响应加 no-store。
 * App WebView(WKWebView) 对无缓存头的页面会启发式缓存，且"返回"时从前后翻页缓存恢复旧文档，
 * 导致样式改完后看到的仍是旧页；no-store 的页面 WebKit 不进翻页缓存。静态构建产物不受影响。
 */
export const onRequest = defineMiddleware(async (_ctx, next) => {
  const res = await next()
  if (import.meta.env.DEV) res.headers.set('Cache-Control', 'no-store')
  return res
})
