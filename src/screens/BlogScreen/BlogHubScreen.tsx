'use client';

import Link from 'next/link';
import {
  BLOG_CATEGORY_LABELS,
  BLOG_CATEGORY_ORDER,
  type BlogCategory,
  type BlogPost,
} from '@/lib/blog';
import * as S from './BlogScreen.styles';

interface BlogHubScreenProps {
  posts: readonly BlogPost[];
  featured?: BlogPost;
  activeCategory?: BlogCategory;
}

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const BlogHubScreen = ({ posts, featured, activeCategory }: BlogHubScreenProps) => {
  const visiblePosts = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts.filter((p) => !featured || p.slug !== featured.slug);
  const showFeatured = !activeCategory && featured;

  return (
    <S.HubLayout>
      <S.Hero>
        <S.Eyebrow>Strive blog</S.Eyebrow>
        <S.HeroTitle>Field notes from teaching, AI, and the design of Strive.</S.HeroTitle>
        <S.HeroSubtitle>
          Written by Simas Zurauskas. Cognitive science behind the recall queue, engineering
          behind the live-streaming lessons, and the product principles that shape what Strive
          does — and what it deliberately doesn’t.
        </S.HeroSubtitle>
      </S.Hero>

      <S.CategoryFilters aria-label="Filter posts by category">
        <S.CategoryPill href="/blog" $active={!activeCategory}>
          All posts
        </S.CategoryPill>
        {BLOG_CATEGORY_ORDER.map((category) => (
          <S.CategoryPill
            key={category}
            href={`/blog/category/${category}`}
            $active={activeCategory === category}
          >
            {BLOG_CATEGORY_LABELS[category]}
          </S.CategoryPill>
        ))}
      </S.CategoryFilters>

      {showFeatured && (
        <S.FeaturedSection>
          <S.FeaturedLink href={featured.href}>
            <S.FeaturedTag>Featured · {featured.categoryLabel}</S.FeaturedTag>
            <S.FeaturedTitle>{featured.title}</S.FeaturedTitle>
            <S.FeaturedSummary>{featured.summary}</S.FeaturedSummary>
            <S.FeaturedMeta>
              {formatDate(featured.published)} · {featured.readTimeMinutes} min read
            </S.FeaturedMeta>
          </S.FeaturedLink>
        </S.FeaturedSection>
      )}

      {visiblePosts.length === 0 ? (
        <S.EmptyState>
          No posts in this category yet — check back soon, or browse{' '}
          <Link href="/blog">all posts</Link>.
        </S.EmptyState>
      ) : (
        <S.PostGrid>
          {visiblePosts.map((post) => (
            <S.PostCardLink key={post.slug} href={post.href}>
              <S.PostCardCategory>{post.categoryLabel}</S.PostCardCategory>
              <S.PostCardTitle>{post.title}</S.PostCardTitle>
              <S.PostCardSummary>{post.summary}</S.PostCardSummary>
              <S.PostCardMeta>
                <span>{formatDate(post.published)}</span>
                <S.PostCardMetaDot>{post.readTimeMinutes} min read</S.PostCardMetaDot>
              </S.PostCardMeta>
            </S.PostCardLink>
          ))}
        </S.PostGrid>
      )}
    </S.HubLayout>
  );
};
