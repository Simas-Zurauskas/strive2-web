'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FilterTabs, FilterTab, PageLayout, Button, HelpAnchor } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useReviewsDue, useUnattemptedQuizzes } from '@/hooks';
import { QuizzesGhostPreview } from './internal/QuizzesGhostPreview/QuizzesGhostPreview';
import * as S from './QuizzesScreen.styles';
import type { QuizMasteryTier } from '@/api/types';

type Filter = 'all' | 'review' | 'not-taken';

interface QuizItem {
  type: 'review' | 'not-taken';
  courseId: string;
  courseSlug: string | null;
  courseName: string;
  moduleIndex: number;
  moduleName: string;
  bestScore?: number;
  bestTier?: QuizMasteryTier;
  reviewReason?: string;
}

interface CourseGroup {
  courseId: string;
  courseSlug: string | null;
  courseName: string;
  hasReviews: boolean;
  items: QuizItem[];
}

const tierLabel: Record<QuizMasteryTier, string> = {
  mastered: 'Mastered',
  passed: 'Passed',
  needs_review: 'Needs review',
};

const reviewMetaLine = (item: QuizItem): string => {
  if (item.type === 'not-taken') return 'Not taken yet';
  if (item.reviewReason === 'progression') return 'New progress unlocked a review';
  return 'Scheduled review';
};

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
          <S.Eyebrow>Practice</S.Eyebrow>
          <S.Title>
            A quiet way to make what you read stick. <HelpAnchor concept="quiz-types" />
          </S.Title>
          <S.Subtitle>
            Each module ends with a quiz that checks your understanding. Reviews come back on a
            spaced schedule, so the work compounds instead of fading.
          </S.Subtitle>
          <S.ScoringLine>
            <S.ScoringLabel>Scoring</S.ScoringLabel>
            <S.ScoringChip $tone="pass">
              <S.ScoringDot $tone="pass" aria-hidden />
              Pass · 70%
            </S.ScoringChip>
            <S.ScoringChip $tone="master">
              <S.ScoringDot $tone="master" aria-hidden />
              Master · 90%
            </S.ScoringChip>
          </S.ScoringLine>
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
            <S.EmptyPreviewSlot>
              <QuizzesGhostPreview />
            </S.EmptyPreviewSlot>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>Nothing to practice yet</S.EmptyEyebrow>
            <S.EmptyTitle>Quizzes appear after a module.</S.EmptyTitle>
            <S.EmptyText>
              Each module ends with a short quiz. They show up here, then come back on a spaced
              schedule so the work compounds.
            </S.EmptyText>
            <S.EmptyAction>
              <Button variant="primary" onClick={() => router.push(ROUTES.home())}>
                Browse courses
              </Button>
            </S.EmptyAction>
          </S.EmptyState>
        )}

        {!isLoading && totalCount > 0 && filteredGroups.length === 0 && (
          <S.EmptyState>
            <S.EmptyText>
              {filter === 'review' ? 'Nothing due for review.' : 'No untaken quizzes.'}
            </S.EmptyText>
          </S.EmptyState>
        )}

        {!isLoading && filteredGroups.length > 0 && (
          <S.CourseList>
            {filteredGroups.map((group) => (
              <S.CourseSection key={group.courseId}>
                <S.CourseSectionHeader>
                  <S.CourseEyebrow>Course</S.CourseEyebrow>
                  <S.CourseName>{group.courseName}</S.CourseName>
                </S.CourseSectionHeader>
                <S.QuizList>
                  {group.items.map((item) => (
                    <li key={`${item.courseId}-${item.moduleIndex}`}>
                      <S.QuizRow onClick={() => handleQuizClick(item)}>
                        <S.QuizContent>
                          <S.QuizModuleName>
                            Module {item.moduleIndex + 1} · {item.moduleName}
                          </S.QuizModuleName>
                          <S.QuizMeta>{reviewMetaLine(item)}</S.QuizMeta>
                        </S.QuizContent>

                        {item.type === 'review' && item.bestTier && item.bestScore != null ? (
                          <S.QuizStatus $variant="tier" $tier={item.bestTier}>
                            {item.bestScore}% · {tierLabel[item.bestTier]}
                          </S.QuizStatus>
                        ) : item.type === 'review' ? (
                          <S.QuizStatus $variant="review-due">
                            <S.StatusDot $tone="error" aria-hidden />
                            Due
                          </S.QuizStatus>
                        ) : (
                          <S.QuizStatus $variant="fresh">
                            <S.StatusDot $tone="tertiary" aria-hidden />
                            New
                          </S.QuizStatus>
                        )}

                        <S.QuizArrow aria-hidden>
                          <ArrowRight size={15} strokeWidth={1.75} />
                        </S.QuizArrow>
                      </S.QuizRow>
                    </li>
                  ))}
                </S.QuizList>
              </S.CourseSection>
            ))}
          </S.CourseList>
        )}
      </S.ContentWrap>
    </PageLayout>
  );
};
