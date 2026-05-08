/**
 * <ClientOnly> — 等价于 VitePress 的 ClientOnly 包裹器。
 * SSG 阶段返回 null，挂载到客户端后才渲染 children。
 * graph.md 用 <ClientOnly><LinkGraph /></ClientOnly>，避免 SSR 时访问 window/Canvas。
 */
import React, { useEffect, useState, type ReactNode } from 'react';

export function ClientOnly({ children }: { children?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}

export default ClientOnly;
