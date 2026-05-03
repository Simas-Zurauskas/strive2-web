import * as S from '../KbScreen.styles';
import { KbArticleCard } from './KbArticleCard';
import type { KbArticle } from '@/lib/kb';

interface KbRelatedArticlesProps {
  articles: KbArticle[];
}

export const KbRelatedArticles = ({ articles }: KbRelatedArticlesProps) => {
  if (articles.length === 0) return null;
  return (
    <S.RelatedSection>
      <S.RelatedHeading>Related articles</S.RelatedHeading>
      <S.ArticleList>
        {articles.map((a) => (
          <KbArticleCard key={`${a.topic}/${a.slug}`} article={a} />
        ))}
      </S.ArticleList>
    </S.RelatedSection>
  );
};
