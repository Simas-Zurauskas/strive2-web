'use client';

import { Markdown } from '@/components';
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
  return (
    <S.Layout>
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
      {updated && <S.ArticleMeta>Updated {updated}</S.ArticleMeta>}
      <S.ArticleBody>
        <Markdown math>{article.body}</Markdown>
      </S.ArticleBody>
      <KbRelatedArticles articles={related} />
    </S.Layout>
  );
};
