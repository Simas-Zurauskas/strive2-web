'use client';

import { useRouter } from 'next/navigation';
import { useReviewsDue, useUnattemptedQuizzes } from '@/hooks';
import * as S from './ReviewScreen.styles';

export const ReviewScreen: React.FC = () => {
  const router = useRouter();
  const { data: reviewsDue, isLoading: reviewsLoading } = useReviewsDue();
  const { data: unattemptedQuizzes, isLoading: unattemptedLoading } = useUnattemptedQuizzes();

  const isLoading = reviewsLoading || unattemptedLoading;
  const dueCount = reviewsDue?.length ?? 0;
  const unattemptedCount = unattemptedQuizzes?.length ?? 0;
  const totalCount = dueCount + unattemptedCount;

  return (
    <S.Layout>
      <S.Container>
      <S.PageHeader>
        <div>
          <S.Title>Review</S.Title>
          <S.Subtitle>
            {isLoading
              ? 'Loading...'
              : totalCount > 0
                ? `${dueCount} review${dueCount !== 1 ? 's' : ''} due${unattemptedCount > 0 ? ` · ${unattemptedCount} not yet taken` : ''}`
                : 'No reviews due'}
          </S.Subtitle>
        </div>
      </S.PageHeader>

      {!isLoading && totalCount === 0 && (
        <S.EmptyState>
          <S.EmptyTitle>All caught up</S.EmptyTitle>
          <S.EmptyText>
            Complete module quizzes to unlock spaced reviews. They&apos;ll appear here when it&apos;s time to review.
          </S.EmptyText>
        </S.EmptyState>
      )}

      {!isLoading && reviewsDue && reviewsDue.length > 0 && (
        <>
          <S.SectionLabel>Reviews due</S.SectionLabel>
          <S.ReviewList>
            {reviewsDue.map((item) => {
              const slug = item.courseSlug;
              return (
                <S.ReviewItem
                  key={`${item.courseId}-${item.moduleIndex}`}
                  onClick={() => router.push(`/course/${slug}/quiz/${item.moduleIndex}?review=true`)}
                >
                  <S.ReviewItemContent>
                    <S.CourseName>{item.courseName}</S.CourseName>
                    <S.ModuleName>Module {item.moduleIndex + 1}: {item.moduleName}</S.ModuleName>
                    <S.ReviewReason>
                      {item.reviewReason === 'progression' ? 'Triggered by new progress' : 'Scheduled review'}
                    </S.ReviewReason>
                  </S.ReviewItemContent>
                  <S.TierBadge $tier={item.bestTier}>{item.bestScore}%</S.TierBadge>
                  <S.ReviewButton>Review &rarr;</S.ReviewButton>
                </S.ReviewItem>
              );
            })}
          </S.ReviewList>
        </>
      )}

      {!isLoading && unattemptedQuizzes && unattemptedQuizzes.length > 0 && (
        <>
          <S.SectionLabel>Not yet taken</S.SectionLabel>
          <S.ReviewList>
            {unattemptedQuizzes.map((item) => (
              <S.ReviewItem
                key={`${item.courseId}-${item.moduleIndex}`}
                onClick={() => router.push(`/course/${item.courseSlug}/quiz/${item.moduleIndex}`)}
              >
                <S.ReviewItemContent>
                  <S.CourseName>{item.courseName}</S.CourseName>
                  <S.ModuleName>Module {item.moduleIndex + 1}: {item.moduleName}</S.ModuleName>
                </S.ReviewItemContent>
                <S.TakeQuizButton>Take quiz &rarr;</S.TakeQuizButton>
              </S.ReviewItem>
            ))}
          </S.ReviewList>
        </>
      )}
      </S.Container>
    </S.Layout>
  );
};
