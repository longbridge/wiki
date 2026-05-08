/**
 * Tabs / TabItem — M1 最小可用版（React 替代旧 Vue 版）。
 * 用法（保持与旧 Vue 版一致，markdown 内不需要改写）：
 *
 *   <Tabs groupId="withdrawal-region">
 *     <TabItem value="hk" label="香港账户" default>...</TabItem>
 *     <TabItem value="sg" label="新加坡账户">...</TabItem>
 *   </Tabs>
 *
 * - groupId 用于跨组件同步（同一 groupId 的 Tabs 切换会联动 + 持久化）
 * - default 标记初始激活项；缺失时取第一个
 * - 仅做"能渲染、能切换"的最小集；视觉/动效留给 M2
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type ReactElement,
} from 'react';

interface TabItemProps {
  value: string;
  label: string;
  default?: boolean;
  children?: ReactNode;
}

interface TabsProps {
  groupId?: string;
  variant?: 'line' | 'pill';
  children?: ReactNode;
}

const ActiveTabContext = createContext<string>('');

// 跨实例同步 groupId 的状态（与旧 Vue 实现保持兼容的本地逻辑，不再使用全局 window 缓存）
const groupListeners = new Map<string, Set<(v: string) => void>>();
const groupState = new Map<string, string>();

function readPersisted(groupId: string): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  try {
    return localStorage.getItem(`rspress-tabs-${groupId}`) ?? undefined;
  } catch {
    return undefined;
  }
}

function writePersisted(groupId: string, value: string) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(`rspress-tabs-${groupId}`, value);
  } catch {
    /* ignore */
  }
}

export function Tabs({ groupId, variant = 'line', children }: TabsProps) {
  // 收集所有 TabItem 子项的 props
  const items = useMemo(() => {
    const result: TabItemProps[] = [];
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        (child.type === TabItem ||
          (child.type as { displayName?: string })?.displayName === 'TabItem')
      ) {
        const p = (child as ReactElement<TabItemProps>).props;
        result.push({ value: p.value, label: p.label, default: p.default });
      }
    });
    return result;
  }, [children]);

  const initial = useMemo(() => {
    if (groupId) {
      const persisted = readPersisted(groupId);
      if (persisted && items.some((i) => i.value === persisted)) return persisted;
      const shared = groupState.get(groupId);
      if (shared && items.some((i) => i.value === shared)) return shared;
    }
    const def = items.find((i) => i.default);
    return def?.value ?? items[0]?.value ?? '';
  }, [groupId, items]);

  const [active, setActive] = useState<string>(initial);

  // 跨实例联动
  useEffect(() => {
    if (!groupId) return;
    if (!groupListeners.has(groupId)) groupListeners.set(groupId, new Set());
    const listener = (v: string) => {
      if (items.some((i) => i.value === v)) setActive(v);
    };
    groupListeners.get(groupId)!.add(listener);
    return () => {
      groupListeners.get(groupId)?.delete(listener);
    };
  }, [groupId, items]);

  const handleClick = (value: string) => {
    setActive(value);
    if (groupId) {
      groupState.set(groupId, value);
      writePersisted(groupId, value);
      groupListeners.get(groupId)?.forEach((fn) => fn(value));
    }
  };

  return (
    <div className="rspress-tabs" style={{ margin: '1rem 0' }}>
      <div
        className={`rspress-tabs-${variant}`}
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '0.75rem',
          borderBottom:
            variant === 'line' ? '1px solid var(--rp-c-divider, #e5e7eb)' : 'none',
          padding: variant === 'pill' ? '0.25rem' : 0,
          background:
            variant === 'pill' ? 'var(--rp-c-bg-soft, #f5f5f5)' : 'transparent',
          borderRadius: variant === 'pill' ? '6px' : 0,
          overflowX: 'auto',
        }}
      >
        {items.map((tab) => {
          const isActive = tab.value === active;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleClick(tab.value)}
              style={{
                cursor: 'pointer',
                background:
                  variant === 'pill' && isActive
                    ? 'var(--rp-c-bg, #fff)'
                    : 'transparent',
                border: 'none',
                borderBottom:
                  variant === 'line'
                    ? `2px solid ${isActive ? 'currentColor' : 'transparent'}`
                    : 'none',
                color: isActive ? 'var(--rp-c-text-1, inherit)' : 'var(--rp-c-text-2, #666)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                borderRadius: variant === 'pill' ? '4px' : 0,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <ActiveTabContext.Provider value={active}>
        <div>{children}</div>
      </ActiveTabContext.Provider>
    </div>
  );
}

export function TabItem({ value, children }: TabItemProps) {
  const active = useContext(ActiveTabContext);
  if (active !== value) return null;
  return <div className="rspress-tab-item">{children}</div>;
}
TabItem.displayName = 'TabItem';

export default Tabs;
