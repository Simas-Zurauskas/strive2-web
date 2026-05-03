'use client';

import { Markdown } from '@/components';
import { NEXT_PUBLIC_SITE_URL } from '@/conf/env';
import { KbBreadcrumb } from './internal/KbBreadcrumb';
import { KbRelatedArticles } from './internal/KbRelatedArticles';
import * as S from './KbScreen.styles';
import type { KbArticle } from '@/lib/kb';

interface KbArticleScreenProps {
  article: KbArticle;
  related: KbArticle[];
}

const formatDate = (iso?: string): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export const KbArticleScreen = ({ article, related }: KbArticleScreenProps) => {
  const updated = formatDate(article.updated);
  const absoluteUrl = `${NEXT_PUBLIC_SITE_URL}${article.href}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    inLanguage: 'en',
    keywords: article.tags.join(', '),
    url: absoluteUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl },
    datePublished: article.updated,
    dateModified: article.updated,
    publisher: {
      '@type': 'Organization',
      name: 'Strive',
      url: NEXT_PUBLIC_SITE_URL,
    },
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'Strive Help Center',
      url: `${NEXT_PUBLIC_SITE_URL}/help`,
    },
  };
  return (
    <S.ArticleLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KbBreadcrumb
        trail={[
          { label: 'Help', href: '/help' },
          { label: article.topicTitle, href: `/help/${article.topic}` },
          { label: article.title, current: true },
        ]}
      />
      <S.Eyebrow>{article.topicTitle}</S.Eyebrow>
      <S.ArticleTitle>{article.title}</S.ArticleTitle>
      <S.ArticleSummary>{article.summary}</S.ArticleSummary>
      {updated && <S.ArticleMeta>Last updated {updated}</S.ArticleMeta>}
      <S.ArticleBody>
        <Markdown math>{article.body}</Markdown>
      </S.ArticleBody>
      <KbRelatedArticles articles={related} />
    </S.ArticleLayout>
  );
};
