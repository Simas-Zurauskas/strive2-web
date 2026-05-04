'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components';
import { useCourses, useProgressSummary } from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
import * as S from './HomeScreen.styles';
import { ContinueLearningCard } from './internal/ContinueLearningCard/ContinueLearningCard';
import { DraftCard } from './internal/DraftCard/DraftCard';
import { Greeting } from './internal/Greeting/Greeting';
import { LibrarySection } from './internal/LibrarySection/LibrarySection';
import { StatBento } from './internal/StatBento/StatBento';
import { TodayReview } from './internal/TodayReview/TodayReview';

/**
 * Home renders its layout immediately on mount. Each widget owns its own
 * data dependencies and shows a skeleton in its exact final shape until
 * its query resolves — no full-page TextLoader gate, no widgets popping
 * in late, no layout shifts. Greeting renders straight away because it
 * only reads from the auth session (already in cache by this point).
 *
 * Course-derived widgets (LibrarySection + Drafts) get their data from
 * here because the same `useCourses` query backs both — fetching it twice
 * would race. LibrarySection takes an `isLoading` prop so it can show its
 * own grid skeleton while we wait.
 */
export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: progressSummary } = useProgressSummary();
  const { isJobRunningForCourse } = useJobManager();

  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    if (progressSummary) {
      for (const item of progressSummary) map.set(item.courseId, item.percentage);
    }
    return map;
  }, [progressSummary]);

  const draftCourses = useMemo(() => {
    if (!courses) return [];
    return courses
      .filter((c) => c.status === 'creating')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [courses]);

  /** All non-creating courses — drives both the home library section and stats. */
  const realCourses = useMemo(
    () => courses?.filter((c) => c.status !== 'creating') ?? [],
    [courses],
  );

  const totalCoursesReady = useMemo(
    () => realCourses.filter((c) => c.status === 'ready').length,
    [realCourses],
  );

  /**
   * First-run state: only render the welcome hero once we know there are
   * no courses. Until courses resolve, fall through to the normal home
   * layout (which renders skeletons everywhere) — better than flashing
   * the welcome hero just to swap it out a moment later.
   */
  const isFirstRun = !coursesLoading && !!courses && courses.length === 0;

  if (isFirstRun) {
    return (
      <S.Layout>
        <S.Container>
          <Greeting />
          <S.EmptyState>
            <S.EmptyTitle>Start with a question.</S.EmptyTitle>
            <S.EmptyText>
              Any topic, any depth. Tell us what you want to learn — we&rsquo;ll generate the modules,
              lessons, and quizzes around it. Courses take about a minute.
            </S.EmptyText>
            <Button variant="primary" onClick={() => router.push('/courses/new')}>
              Generate your first course
            </Button>
          </S.EmptyState>
        </S.Container>
      </S.Layout>
    );
  }

  return (
    <S.Layout>
      <S.Container>
        <Greeting />

        <ContinueLearningCard />

        <TodayReview />

        <StatBento totalCourses={totalCoursesReady} />

        {/* While courses are loading, LibrarySection renders a skeleton.
            Once loaded, it hides itself if there are no real courses. */}
        {(coursesLoading || realCourses.length > 0) && (
          <LibrarySection
            courses={realCourses}
            progressMap={progressMap}
            isLoading={coursesLoading}
          />
        )}

        {draftCourses.length > 0 && (
          <S.DraftsBlock>
            <S.SectionLead>
              <S.SectionLabel>Drafts</S.SectionLabel>
            </S.SectionLead>
            <S.DraftGrid>
              {draftCourses.slice(0, 3).map((course) => (
                <DraftCard
                  key={course._id}
                  course={course}
                  isGenerating={isJobRunningForCourse(course._id)}
                  onClick={() => router.push(`/courses/new?courseId=${course._id}`)}
                />
              ))}
            </S.DraftGrid>
          </S.DraftsBlock>
        )}
      </S.Container>
    </S.Layout>
  );
};
