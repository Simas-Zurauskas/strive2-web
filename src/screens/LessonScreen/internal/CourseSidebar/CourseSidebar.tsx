'use client';

import { Check, ChevronRight, Circle, Minus, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
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
  expandedModules: Set<number> | null;
  onExpandedChange: (expanded: Set<number>) => void;
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
  expandedModules: expandedModulesProp,
  onExpandedChange,
}: CourseSidebarProps) => {
  const router = useRouter();
  const activeRef = useRef<HTMLButtonElement>(null);

  // Initialize on first render if parent hasn't set it yet
  const expandedModules = expandedModulesProp ?? new Set(modules.map((_, i) => i));
  if (expandedModulesProp === null) {
    onExpandedChange(expandedModules);
  }

  // Scroll active lesson into view on mount
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [currentModuleIndex, currentLessonIndex]);

  const toggleModule = (index: number) => {
    const next = new Set(expandedModules);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    onExpandedChange(next);
  };

  const progressMap = useMemo(() => {
    const map = new Map<string, { status: string; bookmarked: boolean }>();
    if (progressData?.lessons) {
      for (const lp of progressData.lessons) {
        map.set(`${lp.moduleIndex}-${lp.lessonIndex}`, {
          status: lp.status,
          bookmarked: lp.bookmarked,
        });
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

  const getDotState = (mi: number, li: number): LessonDotState => {
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
        <S.CourseName>{courseName || 'Course'}</S.CourseName>
        <S.ProgressHeader>
          <S.ProgressPercent>
            {totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}% Complete
          </S.ProgressPercent>
          <S.ProgressBarTrack>
            <S.ProgressBarFill
              $percent={
                totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
              }
            />
          </S.ProgressBarTrack>
        </S.ProgressHeader>
      </S.Header>

      <S.Tree>
        {modules.map((mod, mi) => {
          const expanded = expandedModules.has(mi);
          const lessons = mod.lessons ?? [];
          const mp = getModuleProgress(mi);

          return (
            <S.ModuleSection key={mi}>
              <S.ModuleHeader $expanded={expanded} onClick={() => toggleModule(mi)}>
                <S.ChevronIcon $expanded={expanded}>
                  <ChevronRight size={12} />
                </S.ChevronIcon>
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
                        ref={isActive ? activeRef : undefined}
                        $active={isActive}
                        onClick={() => onNavigate(mi, li)}
                      >
                        <S.LessonIndicator $state={dotState}>
                          {dotState === 'completed' ? (
                            <Check size={12} strokeWidth={3} />
                          ) : dotState === 'in_progress' ? (
                            <Minus size={12} strokeWidth={2.5} />
                          ) : (
                            <Circle size={6} />
                          )}
                        </S.LessonIndicator>
                        <S.LessonName>{lesson.name}</S.LessonName>
                        {isBookmarked && (
                          <S.BookmarkIcon>
                            <Star size={12} fill="currentColor" />
                          </S.BookmarkIcon>
                        )}
                      </S.LessonItem>
                    );
                  })}

                  {(() => {
                    const locked = !isModuleComplete(mi);
                    const qp = quizProgressMap.get(mi);

                    return (
                      <S.QuizItem
                        $locked={locked}
                        onClick={() => {
                          if (!locked) {
                            router.push(
                              `/course/${courseId}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`,
                            );
                          }
                        }}
                      >
                        <S.QuizIconCircle $locked={locked}>Q</S.QuizIconCircle>
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
            </S.ModuleSection>
          );
        })}
      </S.Tree>
    </S.Container>
  );
};
