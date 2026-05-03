'use client';

import { KbArticleCard } from './internal/KbArticleCard';
import { KbBreadcrumb } from './internal/KbBreadcrumb';
import { KbSearchBar } from './internal/KbSearchBar';
import * as S from './KbScreen.styles';
import type { KbArticle, KbSearchEntry, KbTopic } from '@/lib/kb';

interface KbTopicScreenProps {
  topic: KbTopic;
  articles: KbArticle[];
  searchEntries: KbSearchEntry[];
}

export const KbTopicScreen = ({ topic, articles, searchEntries }: KbTopicScreenProps) => (
  <S.Layout>
    <KbBreadcrumb
      trail={[
        { label: 'Help', href: '/help' },
        { label: topic.title, current: true },
      ]}
    />
    <S.Eyebrow>
      {topic.articleCount} article{topic.articleCount === 1 ? '' : 's'}
    </S.Eyebrow>
    <S.HeroTitle>{topic.title}</S.HeroTitle>
    <S.HeroSubtitle>{topic.summary}</S.HeroSubtitle>
    <KbSearchBar entries={searchEntries} />
    {articles.length === 0 ? (
      <p>No articles in this topic yet — check back soon.</p>
    ) : (
      <S.ArticleList>
        {articles.map((a) => (
          <KbArticleCard key={a.slug} article={a} />
        ))}
      </S.ArticleList>
    )}
  </S.Layout>
);
