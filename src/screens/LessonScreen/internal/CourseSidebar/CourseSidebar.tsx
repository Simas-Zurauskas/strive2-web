'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CourseProgressResponse, CourseQuizProgressItem } from '@/api/routes/course';
import { LessonDotState, QuizBadgeTier } from './CourseSidebar.styles';
import * as S from './CourseSidebar.styles';

interface Module {
  name: string;
  description: string;
  lessons?: { name: string; description: string }[];
}

interface CourseSidebarProps {
  courseId: string;
  courseName: string;
  modules: Module[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  onNavigate: (moduleIndex: number, lessonIndex: number) => void;
  onCollapse: () => void;
  progressData?: CourseProgressResponse;
  generatedLessons?: { moduleIndex: number; lessonIndex: number }[];
}

export const CourseSidebar = ({
  courseId,
  courseName,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  onNavigate,
  onCollapse,
  progressData,
  generatedLessons,
}: CourseSidebarProps) => {
  const router = useRouter();

  // All modules start expanded
  const [expandedModules, setExpandedModules] = useState<Set<number>>(() => {
    return new Set(modules.map((_, i) => i));
  });

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Build lookup maps
  const progressMap = useMemo(() => {
    const map = new Map<string, { status: string; bookmarked: boolean }>();
    if (progressData?.lessons) {
      for (const lp of progressData.lessons) {
        map.set(`${lp.moduleIndex}-${lp.lessonIndex}`, { status: lp.status, bookmarked: lp.bookmarked });
      }
    }
    return map;
  }, [progressData]);

  const generatedSet = useMemo(() => {
    const set = new Set<string>();
    if (generatedLessons) {
      for (const gl of generatedLessons) {
        set.add(`${gl.moduleIndex}-${gl.lessonIndex}`);
      }
    }
    return set;
  }, [generatedLessons]);

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  const completedCount = progressData?.stats?.completed ?? 0;
  const remaining = totalLessons - completedCount;

  const getDotState = (mi: number, li: number): LessonDotState => {
    const isActive = mi === currentModuleIndex && li === currentLessonIndex;
    if (isActive) return 'active';

    const key = `${mi}-${li}`;
    const progress = progressMap.get(key);

    if (progress?.status === 'completed') return 'completed';
    if (progress?.status === 'in_progress' && generatedSet.has(key)) return 'in_progress';
    if (generatedSet.has(key)) return 'not_started';
    return 'not_generated';
  };

  const getModuleProgress = (mi: number) => {
    const lessons = modules[mi]?.lessons ?? [];
    let completed = 0;
    for (let li = 0; li < lessons.length; li++) {
      if (progressMap.get(`${mi}-${li}`)?.status === 'completed') completed++;
    }
    return { completed, total: lessons.length };
  };

  const quizProgressMap = useMemo(() => {
    const map = new Map<number, CourseQuizProgressItem>();
    if (progressData?.quizzes) {
      for (const qp of progressData.quizzes) {
        map.set(qp.moduleIndex, qp);
      }
    }
    return map;
  }, [progressData]);

  const isModuleComplete = (mi: number) => {
    const mp = getModuleProgress(mi);
    return mp.completed === mp.total && mp.total > 0;
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackLink onClick={() => router.push(`/course/${courseId}`)}>
          &larr; <S.CourseName>{courseName || 'Course'}</S.CourseName>
        </S.BackLink>
        <S.CollapseButton onClick={onCollapse} aria-label="Collapse sidebar">
          &#10094;
        </S.CollapseButton>
      </S.Header>

      <S.Tree>
        {modules.map((mod, mi) => {
          const expanded = expandedModules.has(mi);
          const lessons = mod.lessons ?? [];
          const mp = getModuleProgress(mi);

          return (
            <div key={mi}>
              <S.ModuleHeader $expanded={expanded} onClick={() => toggleModule(mi)}>
                <S.Chevron $expanded={expanded}>&#9654;</S.Chevron>
                <S.ModuleLabel>
                  {mi + 1}. {mod.name}
                </S.ModuleLabel>
                {mp.completed > 0 && (
                  <S.ModuleProgress>
                    {mp.completed}/{mp.total}
                  </S.ModuleProgress>
                )}
              </S.ModuleHeader>

              {expanded && (
                <S.LessonList>
                  {lessons.map((lesson, li) => {
                    const isActive = mi === currentModuleIndex && li === currentLessonIndex;
                    const dotState = getDotState(mi, li);
                    const isBookmarked = progressMap.get(`${mi}-${li}`)?.bookmarked;

                    return (
                      <S.LessonItem
                        key={li}
                        $active={isActive}
                        onClick={() => onNavigate(mi, li)}
                      >
                        <S.LessonDot $state={dotState} />
                        <S.LessonName>{lesson.name}</S.LessonName>
                        {isBookmarked && <S.BookmarkIcon>&#9733;</S.BookmarkIcon>}
                      </S.LessonItem>
                    );
                  })}

                  {/* Module Quiz entry */}
                  {(() => {
                    const locked = !isModuleComplete(mi);
                    const qp = quizProgressMap.get(mi);

                    return (
                      <S.QuizItem
                        $locked={locked}
                        onClick={() => {
                          if (!locked) {
                            router.push(`/course/${courseId}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`);
                          }
                        }}
                      >
                        <S.QuizIcon>{locked ? '\u{1F512}' : '\u{1F4DD}'}</S.QuizIcon>
                        <S.LessonName>Module Quiz</S.LessonName>
                        {qp?.reviewDue && <S.ReviewDot />}
                        {qp?.bestTier && (
                          <S.QuizBadge $tier={qp.bestTier as QuizBadgeTier}>
                            {qp.bestScore}%
                          </S.QuizBadge>
                        )}
                      </S.QuizItem>
                    );
                  })()}
                </S.LessonList>
              )}
            </div>
          );
        })}
      </S.Tree>

      <S.Footer>
        <S.FooterText>
          {completedCount} of {totalLessons} completed
        </S.FooterText>
        {remaining > 0 && remaining <= 2 && (
          <S.FooterAccent>
            {remaining} lesson{remaining !== 1 ? 's' : ''} to go!
          </S.FooterAccent>
        )}
        <S.ProgressBarTrack>
          <S.ProgressBarFill $percent={totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0} />
        </S.ProgressBarTrack>
      </S.Footer>
    </S.Container>
  );
};
