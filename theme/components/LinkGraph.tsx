/**
 * LinkGraph — M1 阶段为占位组件。
 * 旧 Vue 版（12.3K）使用 Canvas + 力导图算法，节点数据来自 docs/.vitepress/link-graph.json。
 * 移植到 React + useRef<HTMLCanvasElement> 是 M2 的工作；M1 只需要保证含 <LinkGraph /> 的页面能渲染、不崩溃。
 */
import React from 'react';

export function LinkGraph() {
  return (
    <div
      style={{
        margin: '1rem 0',
        padding: '2rem',
        border: '1px dashed var(--rp-c-divider, #e5e7eb)',
        borderRadius: '8px',
        textAlign: 'center',
        color: 'var(--rp-c-text-2, #666)',
      }}
    >
      <div style={{ fontSize: '0.95rem', marginBottom: 4 }}>
        Knowledge Graph (placeholder)
      </div>
      <div style={{ fontSize: '0.8rem' }}>
        力导图组件将在 M2 阶段从旧 Vue 实现移植到 React。
      </div>
    </div>
  );
}

export default LinkGraph;
