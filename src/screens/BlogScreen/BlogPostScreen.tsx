'use client';

import { Markdown } from '@/components';
import * as S from './BlogScreen.styles';
import type { BlogPost } from '@/lib/blog';

interface BlogPostScreenProps {
  post: BlogPost;
  related: BlogPost[];
  readNext?: BlogPost;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export const BlogPostScreen = ({ post, related, readNext }: BlogPostScreenProps) => {
  const updated = post.updated && post.updated !== post.published ? formatDate(post.updated) : null;

  return (
    <S.ArticleLayout>
      <S.Breadcrumb aria-label="Breadcrumb">
        <S.BreadcrumbLink href="/">Home</S.BreadcrumbLink>
        <S.BreadcrumbDivider />
        <S.BreadcrumbLink href="/blog">Blog</S.BreadcrumbLink>
        <S.BreadcrumbDivider />
        <S.BreadcrumbCurrent>{post.title}</S.BreadcrumbCurrent>
      </S.Breadcrumb>

      <S.ArticleEyebrow>{post.categoryLabel}</S.ArticleEyebrow>
      <S.ArticleTitle>{post.title}</S.ArticleTitle>
      <S.ArticleSummary>{post.summary}</S.ArticleSummary>

      <S.Byline>
        <S.BylineAuthor>{post.author}</S.BylineAuthor>
        <S.BylineDot />
        <span>{formatDate(post.published)}</span>
        <S.BylineDot />
        <span>{post.readTimeMinutes} min read</span>
        {updated && (
          <>
            <S.BylineDot />
            <span>Updated {updated}</span>
          </>
        )}
      </S.Byline>

      <S.ArticleBody>
        <Markdown math>{post.body}</Markdown>
      </S.ArticleBody>

      {readNext && (
        <S.ReadNextSection>
          <S.ReadNextEyebrow>Read next</S.ReadNextEyebrow>
          <S.ReadNextLink href={readNext.href}>
            <S.ReadNextCategory>{readNext.categoryLabel}</S.ReadNextCategory>
            <S.ReadNextTitle>{readNext.title}</S.ReadNextTitle>
            <S.ReadNextSummary>{readNext.summary}</S.ReadNextSummary>
            <S.ReadNextArrow>{readNext.readTimeMinutes} min read →</S.ReadNextArrow>
          </S.ReadNextLink>
        </S.ReadNextSection>
      )}

      {related.length > 0 && (
        <S.RelatedSection>
          <S.RelatedHeading>Related reading</S.RelatedHeading>
          <S.RelatedGrid>
            {related.map((p) => (
              <S.PostCardLink key={p.slug} href={p.href}>
                <S.PostCardCategory>{p.categoryLabel}</S.PostCardCategory>
                <S.PostCardTitle>{p.title}</S.PostCardTitle>
                <S.PostCardMeta>
                  <span>{p.readTimeMinutes} min read</span>
                </S.PostCardMeta>
              </S.PostCardLink>
            ))}
          </S.RelatedGrid>
        </S.RelatedSection>
      )}

      <S.FinalCta>
        <S.FinalCtaHeading>Want a personal AI course on what you’re reading about?</S.FinalCtaHeading>
        <S.FinalCtaButton href="/?auth=signup">Build your first course — free</S.FinalCtaButton>
      </S.FinalCta>
    </S.ArticleLayout>
  );
};
