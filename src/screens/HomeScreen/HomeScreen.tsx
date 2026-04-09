'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CourseCard, Button } from '@/components';
import { useCourses, useContinueLearning, useProgressSummary, useReviewsDue } from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
import * as S from './HomeScreen.styles';
import { ContinueLearningCard } from './internal/ContinueLearningCard/ContinueLearningCard';
import { ReviewDueSection } from './internal/ReviewDueSection/ReviewDueSection';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { data: courses, isLoading } = useCourses();
  const { isJobRunningForCourse } = useJobManager();
  const { data: continueLearning } = useContinueLearning();
  const { data: progressSummary } = useProgressSummary();
  const { data: reviewsDue } = useReviewsDue();

  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    if (progressSummary) {
      for (const item of progressSummary) {
        map.set(item.courseId, item.percentage);
      }
    }
    return map;
  }, [progressSummary]);

  return (
    <S.Layout>
      <S.PageHeader>
        <S.Title>My Courses</S.Title>
        <Button variant="primary" onClick={() => router.push('/courses/new')}>
          New Course
        </Button>
      </S.PageHeader>

      {isLoading && <S.LoadingText>Loading courses...</S.LoadingText>}

      {!isLoading && (!courses || courses.length === 0) && (
        <S.EmptyState>
          <S.EmptyText>No courses yet. Create your first course to get started.</S.EmptyText>
          <Button variant="primary" onClick={() => router.push('/courses/new')}>
            Create Course
          </Button>
        </S.EmptyState>
      )}

      {!isLoading && courses && courses.length > 0 && (
        <>
          {continueLearning && <ContinueLearningCard data={continueLearning} />}
          {reviewsDue && reviewsDue.length > 0 && <ReviewDueSection items={reviewsDue} />}

          <S.Grid>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isGenerating={isJobRunningForCourse(course._id)}
                progress={progressMap.get(course._id)}
                onClick={() => {
                  if (course.status === 'creating') {
                    router.push(`/courses/new?courseId=${course._id}`);
                    return;
                  }
                  router.push(`/course/${(course as Record<string, unknown>).slug}`);
                }}
              />
            ))}
          </S.Grid>
        </>
      )}
    </S.Layout>
  );
};
