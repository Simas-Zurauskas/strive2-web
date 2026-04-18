'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CourseCard, Button, SectionLabel, FilterTabs, FilterTab, TopTabs, TopTab, TextLoader } from '@/components';
import { ROUTES } from '@/constants/routes';
import {
  useCourses,
  useContinueLearning,
  useReviewsDue,
  useUnattemptedQuizzes,
  useProgressSummary,
  useFavoriteCourseIds,
  useToggleFavoriteCourse,
  useBookmarkedLessons,
  useInsightsDueCount,
} from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
import { plural } from '@/lib/strings';
import * as S from './HomeScreen.styles';
import { ContinueLearningCard } from './internal/ContinueLearningCard/ContinueLearningCard';
import { GamificationCard } from './internal/GamificationCard/GamificationCard';

type TopTab = 'courses' | 'bookmarks';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { data: courses, isLoading } = useCourses();
  const { data: continueLearning } = useContinueLearning();
  const { data: progressSummary } = useProgressSummary();
  const { data: reviewsDue } = useReviewsDue();
  const { data: unattemptedQuizzes } = useUnattemptedQuizzes();
  const { data: insightsDue } = useInsightsDueCount();
  const { data: favoriteCourseIds } = useFavoriteCourseIds();
  const { mutate: toggleFavorite } = useToggleFavoriteCourse();
  const { isJobRunningForCourse } = useJobManager();
  const { data: bookmarkedLessons } = useBookmarkedLessons();

  const [topTab, setTopTab] = useState<TopTab>('courses');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('active');
  const [sort, setSort] = useState<'recent' | 'alphabetical'>('recent');

  const favoriteSet = useMemo(() => new Set(favoriteCourseIds ?? []), [favoriteCourseIds]);

  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    if (progressSummary) {
      for (const item of progressSummary) {
        map.set(item.courseId, item.percentage);
      }
    }
    return map;
  }, [progressSummary]);

  const draftCourses = useMemo(() => {
    if (!courses) return [];
    return courses
      .filter((c) => c.status === 'creating')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [courses]);

  const readyCourses = useMemo(() => {
    if (!courses) return [];

    const filtered = courses.filter((course) => {
      if (course.status === 'creating') return false;
      if (filter === 'all') return course.status !== 'archived';
      if (filter === 'active') return course.status === 'ready' && (progressMap.get(course._id) ?? 0) < 100;
      if (filter === 'completed') return course.status === 'ready' && (progressMap.get(course._id) ?? 0) >= 100;
      if (filter === 'archived') return course.status === 'archived';
      return true;
    });

    return filtered.sort((a, b) => {
      const aFav = favoriteSet.has(a._id) ? 0 : 1;
      const bFav = favoriteSet.has(b._id) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;

      if (sort === 'alphabetical') return (a.name || '').localeCompare(b.name || '');
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [courses, favoriteSet, filter, sort, progressMap]);

  const hasAnyCourses = courses && courses.length > 0;

  if (isLoading) {
    return (
      <S.Layout>
        <S.Container>
          <TextLoader />
        </S.Container>
      </S.Layout>
    );
  }

  if (!hasAnyCourses) {
    return (
      <S.Layout>
        <S.Container>
          <S.EmptyState>
            <S.EmptyText>No courses yet. Create your first course to get started.</S.EmptyText>
            <Button variant="primary" onClick={() => router.push('/courses/new')}>
              Create Course
            </Button>
          </S.EmptyState>
        </S.Container>
      </S.Layout>
    );
  }

  return (
    <S.Layout>
      <S.Container>
        <S.DebugPanel>
          <S.DebugLabel>Sonner debug</S.DebugLabel>
          <S.DebugRow>
            <Button variant="secondary" size="small" onClick={() => toast('Plain toast')}>
              Default
            </Button>
            <Button variant="secondary" size="small" onClick={() => toast.success('It worked!')}>
              Success
            </Button>
            <Button variant="secondary" size="small" onClick={() => toast.error('Something went wrong.')}>
              Error
            </Button>
            <Button variant="secondary" size="small" onClick={() => toast.info('Heads up — just so you know.')}>
              Info
            </Button>
            <Button variant="secondary" size="small" onClick={() => toast.warning('Careful, this might blow up.')}>
              Warning
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() =>
                toast('Event created', {
                  description: 'Monday, April 20 at 10:00 AM',
                  action: { label: 'Undo', onClick: () => toast('Undone') },
                })
              }
            >
              With action
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() =>
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                  loading: 'Loading…',
                  success: 'Loaded!',
                  error: 'Failed to load',
                })
              }
            >
              Promise
            </Button>
            <Button variant="secondary" size="small" onClick={() => toast.dismiss()}>
              Dismiss all
            </Button>
          </S.DebugRow>
        </S.DebugPanel>

        <S.DashboardGrid>
          <S.MainColumn>
            {continueLearning && <ContinueLearningCard data={continueLearning} />}

            {/* ── Drafts ──────────────────────────────── */}
            {draftCourses.length > 0 && (
              <div>
                <SectionLabel>Drafts</SectionLabel>
                <S.DraftGrid>
                  {draftCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      isGenerating={isJobRunningForCourse(course._id)}
                      onClick={() => router.push(`/courses/new?courseId=${course._id}`)}
                    />
                  ))}
                </S.DraftGrid>
              </div>
            )}

            {/* ── Top tabs: Courses / Bookmarks ─────── */}
            <div>
              <TopTabs>
                <TopTab $active={topTab === 'courses'} onClick={() => setTopTab('courses')}>
                  Courses
                </TopTab>
                <TopTab $active={topTab === 'bookmarks'} onClick={() => setTopTab('bookmarks')}>
                  Bookmarks
                </TopTab>
              </TopTabs>

              {topTab === 'courses' && (
                <>
                  <S.FilterBar>
                    <FilterTabs>
                      {(['active', 'completed', 'archived', 'all'] as const).map((tab) => (
                        <FilterTab key={tab} $active={filter === tab} onClick={() => setFilter(tab)}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </FilterTab>
                      ))}
                    </FilterTabs>
                    <S.SortToggle onClick={() => setSort((s) => (s === 'recent' ? 'alphabetical' : 'recent'))}>
                      {sort === 'recent' ? 'Recent' : 'A\u2013Z'}
                    </S.SortToggle>
                  </S.FilterBar>

                  {readyCourses.length === 0 ? (
                    <S.EmptyText>No courses match this filter.</S.EmptyText>
                  ) : (
                    <S.CourseGrid>
                      {readyCourses.map((course) => (
                        <CourseCard
                          key={course._id}
                          course={course}
                          isGenerating={isJobRunningForCourse(course._id)}
                          progress={progressMap.get(course._id)}
                          isFavorited={favoriteSet.has(course._id)}
                          onToggleFavorite={toggleFavorite}
                          onClick={() => router.push(ROUTES.course(course.slug, course._id))}
                        />
                      ))}
                    </S.CourseGrid>
                  )}
                </>
              )}

              {topTab === 'bookmarks' && (
                <>
                  {!bookmarkedLessons || bookmarkedLessons.length === 0 ? (
                    <S.EmptyText>
                      No bookmarked lessons yet. Bookmark lessons to save them here for quick access.
                    </S.EmptyText>
                  ) : (
                    <S.BookmarkList>
                      {bookmarkedLessons.map((item) => (
                        <S.BookmarkItem
                          key={`${item.courseId}-${item.moduleIndex}-${item.lessonIndex}`}
                          onClick={() =>
                            router.push(
                              ROUTES.lesson(item.courseSlug, item.courseId, item.moduleIndex, item.lessonIndex),
                            )
                          }
                        >
                          <S.BookmarkContent>
                            <S.BookmarkCourse>{item.courseName}</S.BookmarkCourse>
                            <S.BookmarkLesson>
                              {item.moduleName} &middot; {item.lessonName}
                            </S.BookmarkLesson>
                          </S.BookmarkContent>
                        </S.BookmarkItem>
                      ))}
                    </S.BookmarkList>
                  )}
                </>
              )}
            </div>
          </S.MainColumn>

          <S.SideColumn>
            <GamificationCard />

            {((reviewsDue && reviewsDue.length > 0) || (unattemptedQuizzes && unattemptedQuizzes.length > 0)) && (
              <S.QuizCard onClick={() => router.push('/quizzes')}>
                <S.QuizCardLabel>Quizzes</S.QuizCardLabel>
                {reviewsDue && reviewsDue.length > 0 && (
                  <S.QuizCardRow>
                    <S.QuizCardCount $color="warning">{reviewsDue.length}</S.QuizCardCount>
                    <S.QuizCardText>{plural({ count: reviewsDue.length, singular: 'review' })} due</S.QuizCardText>
                  </S.QuizCardRow>
                )}
                {unattemptedQuizzes && unattemptedQuizzes.length > 0 && (
                  <S.QuizCardRow>
                    <S.QuizCardCount $color="accent">{unattemptedQuizzes.length}</S.QuizCardCount>
                    <S.QuizCardText>not yet taken</S.QuizCardText>
                  </S.QuizCardRow>
                )}
              </S.QuizCard>
            )}

            {insightsDue && insightsDue.count > 0 && (
              <S.QuizCard onClick={() => router.push('/insights')}>
                <S.QuizCardLabel>Insights</S.QuizCardLabel>
                <S.QuizCardRow>
                  <S.QuizCardCount $color="accent">{insightsDue.count}</S.QuizCardCount>
                  <S.QuizCardText>
                    {plural({ count: insightsDue.count, singular: 'insight' })} due
                  </S.QuizCardText>
                </S.QuizCardRow>
              </S.QuizCard>
            )}
          </S.SideColumn>
        </S.DashboardGrid>
      </S.Container>
    </S.Layout>
  );
};
