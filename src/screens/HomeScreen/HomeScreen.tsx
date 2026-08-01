'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button, HelpAnchor } from '@/components';
import { useCourses, useProgressSummary } from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
import * as S from './HomeScreen.styles';
import { ContinueLearningCard } from './internal/ContinueLearningCard/ContinueLearningCard';
import { DraftCard } from './internal/DraftCard/DraftCard';
import { Greeting } from './internal/Greeting/Greeting';
import { HomeGhostPreview } from './internal/HomeGhostPreview/HomeGhostPreview';
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

  /** Empty state: rendered when the user has no courses. */
  const isFirstRun = !coursesLoading && !!courses && courses.length === 0;

  // A brand-new account's first destination is course creation, not an empty
  // dashboard — production showed ~53% of signups never reached the wizard
  // when it sat one optional click away. This is the single mechanism for
  // every entry path (Google OAuth return, verified-credentials continue,
  // plain navigation): once the courses query proves "zero courses, zero
  // drafts" (`courses.length === 0` covers both — drafts are course rows
  // with status 'creating'), replace into the wizard. The wizard stamps a
  // session flag on mount, so anyone who backs out of it is NOT bounced
  // again — no redirect loop. `replace` (not `push`) keeps the empty
  // dashboard out of history so Back doesn't re-trigger the hop.
  useEffect(() => {
    if (!isFirstRun) return;
    let skip = false;
    try {
      skip = sessionStorage.getItem('strive.skipWizardRedirect') === '1';
    } catch {
      // Storage denied (private mode etc.) — worst case is one extra
      // redirect into the wizard per visit, never a loop: the guard flag
      // is only read here and the wizard never redirects back.
    }
    if (skip) return;
    router.replace('/courses/new?trigger=home_redirect');
  }, [isFirstRun, router]);

  if (isFirstRun) {
    return (
      <S.Layout>
        <S.Container>
          <Greeting />
          <S.EmptyState>
            <S.EmptyPreviewSlot>
              <HomeGhostPreview />
            </S.EmptyPreviewSlot>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>
              Start with a goal <HelpAnchor concept="how-strive-works" size="sm" />
            </S.EmptyEyebrow>
            <S.EmptyTitle>Tell Strive what you want to learn.</S.EmptyTitle>
            <S.EmptyText>
              Strive turns it into a real course — modules, lessons, quizzes, and daily recall —
              shaped around what you already know.
            </S.EmptyText>
            <S.EmptyAction>
              <Button variant="primary" onClick={() => router.push('/courses/new')}>
                Generate your first course
              </Button>
            </S.EmptyAction>
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
