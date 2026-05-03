import * as S from '../KbScreen.styles';
import type { KbArticle } from '@/lib/kb';

interface KbArticleCardProps {
  article: Pick<KbArticle, 'title' | 'summary' | 'href'>;
}

export const KbArticleCard = ({ article }: KbArticleCardProps) => (
  <S.ArticleCardLink href={article.href}>
    <S.ArticleCardTitle>{article.title}</S.ArticleCardTitle>
    <S.ArticleCardSummary>{article.summary}</S.ArticleCardSummary>
  </S.ArticleCardLink>
);
