'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FilterTabs, FilterTab, PageLayout } from '@/components';
import { useReviewsDue, useUnattemptedQuizzes } from '@/hooks';
import * as S from './QuizzesScreen.styles';

type Filter = 'all' | 'review' | 'not-taken';

interface QuizItem {
  type: 'review' | 'not-taken';
  courseId: string;
  courseSlug: string | null;
  courseName: string;
  moduleIndex: number;
  moduleName: string;
  bestScore?: number;
  bestTier?: string;
  reviewReason?: string;
}

interface CourseGroup {
  courseId: string;
  courseSlug: string | null;
  courseName: string;
  hasReviews: boolean;
  items: QuizItem[];
}

export const QuizzesScreen: React.FC = () => {
  const router = useRouter();
  const { data: reviewsDue, isLoading: reviewsLoading } = useReviewsDue();
  const { data: unattemptedQuizzes, isLoading: unattemptedLoading } = useUnattemptedQuizzes();
  const [filter, setFilter] = useState<Filter>('all');

  const isLoading = reviewsLoading || unattemptedLoading;
  const reviewCount = reviewsDue?.length ?? 0;
  const notTakenCount = unattemptedQuizzes?.length ?? 0;
  const totalCount = reviewCount + notTakenCount;

  const courseGroups = useMemo(() => {
    const map = new Map<string, CourseGroup>();

    for (const item of reviewsDue ?? []) {
      if (!map.has(item.courseId)) {
        map.set(item.courseId, {
          courseId: item.courseId,
          courseSlug: item.courseSlug,
          courseName: item.courseName,
          hasReviews: true,
          items: [],
        });
      }
      const group = map.get(item.courseId)!;
      group.hasReviews = true;
      group.items.push({
        type: 'review',
        courseId: item.courseId,
        courseSlug: item.courseSlug,
        courseName: item.courseName,
        moduleIndex: item.moduleIndex,
        moduleName: item.moduleName,
        bestScore: item.bestScore,
        bestTier: item.bestTier,
        reviewReason: item.reviewReason,
      });
    }

    for (const item of unattemptedQuizzes ?? []) {
      if (!map.has(item.courseId)) {
        map.set(item.courseId, {
          courseId: item.courseId,
          courseSlug: item.courseSlug,
          courseName: item.courseName,
          hasReviews: false,
          items: [],
        });
      }
      map.get(item.courseId)!.items.push({
        type: 'not-taken',
        courseId: item.courseId,
        courseSlug: item.courseSlug,
        courseName: item.courseName,
        moduleIndex: item.moduleIndex,
        moduleName: item.moduleName,
      });
    }

    for (const group of map.values()) {
      group.items.sort((a, b) => a.moduleIndex - b.moduleIndex);
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.hasReviews !== b.hasReviews) return a.hasReviews ? -1 : 1;
      return a.courseName.localeCompare(b.courseName);
    });
  }, [reviewsDue, unattemptedQuizzes]);

  const filteredGroups = useMemo(() => {
    if (filter === 'all') return courseGroups;

    return courseGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.type === filter),
      }))
      .filter((group) => group.items.length > 0);
  }, [courseGroups, filter]);

  const handleQuizClick = (item: QuizItem) => {
    const slug = item.courseSlug ?? item.courseId;
    const params = new URLSearchParams();
    if (item.type === 'review') params.set('review', 'true');
    params.set('from', 'quizzes');
    router.push(`/course/${slug}/quiz/${item.moduleIndex}?${params.toString()}`);
  };

  return (
    <PageLayout>
      <S.ContentWrap>
        <S.PageHeader>
          <S.Title>Quizzes</S.Title>
        </S.PageHeader>

        {!isLoading && totalCount > 0 && (
          <S.FilterBar>
            <FilterTabs>
              <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
                All ({totalCount})
              </FilterTab>
              <FilterTab $active={filter === 'review'} onClick={() => setFilter('review')}>
                Due for review ({reviewCount})
              </FilterTab>
              <FilterTab $active={filter === 'not-taken'} onClick={() => setFilter('not-taken')}>
                Not taken ({notTakenCount})
              </FilterTab>
            </FilterTabs>
          </S.FilterBar>
        )}

        {!isLoading && totalCount === 0 && (
          <S.EmptyState>
            <S.EmptyTitle>All caught up</S.EmptyTitle>
            <S.EmptyText>
              Complete module quizzes to unlock spaced reviews. They&apos;ll appear here when it&apos;s time to review.
            </S.EmptyText>
          </S.EmptyState>
        )}

        {!isLoading && totalCount > 0 && filteredGroups.length === 0 && (
          <S.EmptyState>
            <S.EmptyText>
              {filter === 'review' ? 'No reviews due' : 'No untaken quizzes'}
            </S.EmptyText>
          </S.EmptyState>
        )}

        {!isLoading && filteredGroups.length > 0 && (
          <S.CourseList>
            {filteredGroups.map((group) => (
              <S.CourseCard key={group.courseId}>
                <S.CourseHeader>
                  <S.CourseName>{group.courseName}</S.CourseName>
                  <S.CourseCount>
                    {group.items.length} quiz{group.items.length !== 1 ? 'zes' : ''}
                  </S.CourseCount>
                </S.CourseHeader>
                {group.items.map((item) => (
                  <S.QuizRow
                    key={`${item.courseId}-${item.moduleIndex}`}
                    onClick={() => handleQuizClick(item)}
                  >
                    <S.QuizIcon $review={item.type === 'review'}>Q</S.QuizIcon>
                    <S.QuizContent>
                      <S.QuizModuleName>
                        Module {item.moduleIndex + 1}: {item.moduleName}
                      </S.QuizModuleName>
                      {item.type === 'review' && item.reviewReason && (
                        <S.QuizMeta>
                          {item.reviewReason === 'progression' ? 'Triggered by new progress' : 'Scheduled review'}
                        </S.QuizMeta>
                      )}
                    </S.QuizContent>
                    {item.type === 'review' && item.bestTier && item.bestScore != null && (
                      <S.TierBadge $tier={item.bestTier as 'mastered' | 'passed' | 'needs_review'}>
                        {item.bestScore}%
                      </S.TierBadge>
                    )}
                    {item.type === 'review' && <S.ReviewDueBadge>Review</S.ReviewDueBadge>}
                  </S.QuizRow>
                ))}
              </S.CourseCard>
            ))}
          </S.CourseList>
        )}
      </S.ContentWrap>
    </PageLayout>
  );
};
