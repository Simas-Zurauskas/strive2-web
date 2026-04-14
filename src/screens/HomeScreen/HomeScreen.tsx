'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CourseCard, Button } from '@/components';
import {
  useCourses,
  useContinueLearning,
  useReviewsDue,
  useUnattemptedQuizzes,
  useProgressSummary,
  useFavoriteCourseIds,
  useToggleFavoriteCourse,
  useBookmarkedLessons,
} from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
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
          <S.LoadingText>Loading...</S.LoadingText>
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
        <S.DashboardGrid>
          <S.MainColumn>
            {continueLearning && <ContinueLearningCard data={continueLearning} />}

            {/* ── Drafts ──────────────────────────────── */}
            {draftCourses.length > 0 && (
              <div>
                <S.SectionLabel>Drafts</S.SectionLabel>
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
              <S.TopTabs>
                <S.TopTab $active={topTab === 'courses'} onClick={() => setTopTab('courses')}>
                  Courses
                </S.TopTab>
                <S.TopTab $active={topTab === 'bookmarks'} onClick={() => setTopTab('bookmarks')}>
                  Bookmarks
                </S.TopTab>
              </S.TopTabs>

              {topTab === 'courses' && (
                <>
                  <S.FilterBar>
                    <S.FilterTabs>
                      {(['active', 'completed', 'archived', 'all'] as const).map((tab) => (
                        <S.FilterTab key={tab} $active={filter === tab} onClick={() => setFilter(tab)}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </S.FilterTab>
                      ))}
                    </S.FilterTabs>
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
                          onClick={() => router.push(`/course/${course.slug ?? course._id}`)}
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
                              `/course/${item.courseSlug ?? item.courseId}/lesson/${item.moduleIndex}/${item.lessonIndex}`,
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
              <S.QuizCard onClick={() => router.push('/review')}>
                <S.QuizCardLabel>Quizzes</S.QuizCardLabel>
                {reviewsDue && reviewsDue.length > 0 && (
                  <S.QuizCardRow>
                    <S.QuizCardCount $color="warning">{reviewsDue.length}</S.QuizCardCount>
                    <S.QuizCardText>review{reviewsDue.length !== 1 ? 's' : ''} due</S.QuizCardText>
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
          </S.SideColumn>
        </S.DashboardGrid>
      </S.Container>
    </S.Layout>
  );
};
