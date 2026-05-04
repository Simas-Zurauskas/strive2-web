'use client';

import { ArrowRight, BookmarkCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FilterTabs, FilterTab, TopTabs, TopTab } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useBookmarkedLessons, useFavoriteCourseIds } from '@/hooks';
import * as S from './LibrarySection.styles';
import { SkeletonBlock, SkeletonCard } from '../_skeleton/skeleton.styles';
import { HomeCourseCard } from '../HomeCourseCard/HomeCourseCard';
import type { Course } from '@/api/types';

type Tab = 'courses' | 'bookmarks';
type Filter = 'active' | 'completed' | 'archived' | 'all';
type Sort = 'recent' | 'alphabetical';

interface LibrarySectionProps {
  /** All non-creating courses (active + completed + archived). */
  courses: Course[];
  progressMap: Map<string, number>;
  isLoading?: boolean;
}

/**
 * Skeleton for the colored 16:9 course card. Renders the full bento-style
 * outer chrome with skeleton blocks inside, so the grid keeps its exact
 * dimensions during the courses query.
 */
const HomeCourseCardSkeleton = () => (
  <SkeletonCard
    role="presentation"
    aria-hidden
    style={{ minHeight: 220, padding: '1.5rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <SkeletonBlock $h="0.75rem" $w="5rem" />
      <SkeletonBlock $h="2.25rem" $w="2.25rem" $radius="50%" />
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <SkeletonBlock $h="1.375rem" $w="80%" />
      <SkeletonBlock $h="0.6875rem" $w="60%" />
      <SkeletonBlock $h="3px" $w="100%" $radius="9999px" />
    </div>
  </SkeletonCard>
);

const LibrarySectionSkeleton = () => (
  <S.Wrap aria-hidden>
    <S.Title>Your courses</S.Title>
    <SkeletonBlock $h="2.5rem" $w="14rem" $radius="var(--radius-md)" />
    <S.Grid>
      {[0, 1, 2].map((i) => (
        <HomeCourseCardSkeleton key={i} />
      ))}
    </S.Grid>
  </S.Wrap>
);

export const LibrarySection = ({ courses, progressMap, isLoading = false }: LibrarySectionProps) => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('courses');
  const [filter, setFilter] = useState<Filter>('active');
  const [sort, setSort] = useState<Sort>('recent');

  const { data: favoriteCourseIds } = useFavoriteCourseIds();
  const { data: bookmarkedLessons } = useBookmarkedLessons();
  const favoriteSet = useMemo(() => new Set(favoriteCourseIds ?? []), [favoriteCourseIds]);

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
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
  }, [courses, filter, sort, progressMap, favoriteSet]);

  if (isLoading) return <LibrarySectionSkeleton />;

  return (
    <S.Wrap>
      <S.Title>Your courses</S.Title>

      <TopTabs>
        <TopTab $active={tab === 'courses'} onClick={() => setTab('courses')}>
          Courses
        </TopTab>
        <TopTab $active={tab === 'bookmarks'} onClick={() => setTab('bookmarks')}>
          Bookmarks
        </TopTab>
      </TopTabs>

      {tab === 'courses' && (
        <>
          <S.Controls>
            <FilterTabs>
              {(['active', 'completed', 'archived', 'all'] as const).map((f) => (
                <FilterTab key={f} $active={filter === f} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </FilterTab>
              ))}
            </FilterTabs>
            <S.SortToggle onClick={() => setSort((s) => (s === 'recent' ? 'alphabetical' : 'recent'))}>
              {sort === 'recent' ? 'Recent' : 'A–Z'}
            </S.SortToggle>
          </S.Controls>

          {filteredCourses.length === 0 ? (
            <S.EmptyText>No courses match this filter.</S.EmptyText>
          ) : (
            <S.Grid>
              {filteredCourses.map((course) => (
                <HomeCourseCard
                  key={course._id}
                  course={course}
                  progress={progressMap.get(course._id)}
                  onClick={() => router.push(ROUTES.course(course.slug, course._id))}
                />
              ))}
            </S.Grid>
          )}
        </>
      )}

      {tab === 'bookmarks' && (
        <>
          {!bookmarkedLessons || bookmarkedLessons.length === 0 ? (
            <S.EmptyText>
              No bookmarked lessons yet. Bookmark lessons inside a course to save them here.
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
                  <S.BookmarkIcon aria-hidden>
                    <BookmarkCheck size={14} strokeWidth={1.75} fill="currentColor" />
                  </S.BookmarkIcon>
                  <S.BookmarkContent>
                    <S.BookmarkLesson>{item.lessonName}</S.BookmarkLesson>
                    <S.BookmarkMeta>
                      {item.courseName} &middot; {item.moduleName}
                    </S.BookmarkMeta>
                  </S.BookmarkContent>
                  <S.BookmarkArrow aria-hidden>
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </S.BookmarkArrow>
                </S.BookmarkItem>
              ))}
            </S.BookmarkList>
          )}
        </>
      )}
    </S.Wrap>
  );
};
