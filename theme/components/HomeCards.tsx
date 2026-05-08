/**
 * HomeCards — M1 最小可用版（朴素 CSS Grid）。
 * 旧 Vue 版 34K，含 A/B/C 多变体与背景动画；M1 仅保证首页渲染、链接可点。
 * 视觉与变体留给 M2。
 *
 * 当前用法（zh-CN/index.md）：<HomeCards />，无 props，自取默认 zh-CN 分类列表。
 */
import React from 'react';
import { usePageData } from '@rspress/core/runtime';

interface CategoryCard {
  slug: string;
  text: string;
  description?: string;
}

const ZH_CN_CATEGORIES: CategoryCard[] = [
  { slug: 'getting-started', text: '新手入门', description: '注册与首次使用' },
  { slug: 'app-guide', text: 'App 导览', description: '功能与界面介绍' },
  { slug: 'account', text: '开户与账户', description: '账户类型、开户、安全' },
  { slug: 'deposit', text: '入金', description: '香港 / 新加坡入金方式' },
  { slug: 'withdrawal', text: '出金', description: '出金渠道与规则' },
  { slug: 'transfers-and-fx', text: '资金划转与换汇' },
  { slug: 'stock-trading', text: '股票交易', description: '订单、费用、规则' },
  { slug: 'derivatives', text: '衍生品', description: '期权等衍生品交易' },
  { slug: 'ipo', text: '新股认购' },
  { slug: 'margin', text: '融资融券' },
  { slug: 'funds-and-wealth', text: '基金与理财' },
  { slug: 'market-data', text: '行情数据' },
  { slug: 'portfolio-and-statements', text: '资产与账单' },
  { slug: 'rewards', text: '活动与奖励' },
  { slug: 'compliance-and-tax', text: '合规与税务' },
  { slug: 'troubleshooting', text: '故障排查' },
];

const EN_CATEGORIES: CategoryCard[] = ZH_CN_CATEGORIES.map((c) => ({
  slug: c.slug,
  text: c.slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
}));

const ZH_HK_CATEGORIES: CategoryCard[] = ZH_CN_CATEGORIES;

function getLocalePrefix(lang: string | undefined): string {
  if (lang === 'zh-CN') return '/zh-CN';
  if (lang === 'zh-HK') return '/zh-HK';
  return '';
}

function getCategories(lang: string | undefined): CategoryCard[] {
  if (lang === 'zh-CN') return ZH_CN_CATEGORIES;
  if (lang === 'zh-HK') return ZH_HK_CATEGORIES;
  return EN_CATEGORIES;
}

export function HomeCards() {
  const data = usePageData();
  const lang = data?.page?.lang ?? data?.siteData?.lang;
  const prefix = getLocalePrefix(lang);
  const cards = getCategories(lang);

  return (
    <div
      className="home-cards"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        margin: '2rem 0',
      }}
    >
      {cards.map((card) => (
        <a
          key={card.slug}
          href={`${prefix}/${card.slug}/`}
          style={{
            display: 'block',
            padding: '1rem 1.1rem',
            border: '1px solid var(--rp-c-divider, #e5e7eb)',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = 'var(--rp-c-brand, #3451b2)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'var(--rp-c-divider, #e5e7eb)')
          }
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>
            {card.text}
          </div>
          {card.description && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--rp-c-text-2, #666)',
                lineHeight: 1.5,
              }}
            >
              {card.description}
            </div>
          )}
        </a>
      ))}
    </div>
  );
}

export default HomeCards;
