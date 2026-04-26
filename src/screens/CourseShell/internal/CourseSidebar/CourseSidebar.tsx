'use client';

import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Lock,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { Badge, LessonIndicator, computeLessonIndicatorState } from '@/components';
import { plural } from '@/lib/strings';
import * as S from './CourseSidebar.styles';
import type { CourseProgressResponse } from '@/api/routes/course';
import type { Course, CourseQuizProgressItem } from '@/api/types';
import type { QuizIconVariant } from '@/types';

const quizIconFor: Record<QuizIconVariant, typeof Trophy> = {
  locked: Lock,
  'not-taken': Sparkles,
  mastered: Trophy,
  passed: CheckCircle,
  needs_review: AlertCircle,
};

interface Module {
  name: string;
  description: string;
  lessons?: { name: string; description: string }[];
}

interface CourseSidebarProps {
  courseBasePath: string;
  courseName: string;
  courseDepth?: string;
  modules: Module[];
  currentModuleIndex?: number;
  currentLessonIndex?: number;
  onNavigate: (moduleIndex: number, lessonIndex: number) => void;
  onCollapse: () => void;
  progressData?: CourseProgressResponse;
  generatedLessons?: { moduleIndex: number; lessonIndex: number }[];
  activeLesson?: Course['activeLesson'];
  expandedModules: Set<number> | null;
  onExpandedChange: (expanded: Set<number>) => void;
}

export const CourseSidebar = ({
  courseBasePath,
  courseName,
  courseDepth,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  onNavigate,
  onCollapse: _onCollapse,
  progressData,
  generatedLessons,
  activeLesson,
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

  const getIndicatorState = ({ mi, li }: { mi: number; li: number }) =>
    computeLessonIndicatorState({
      moduleIndex: mi,
      lessonIndex: li,
      activeLesson,
      progressStatus: progressMap.get(`${mi}-${li}`)?.status,
      isGenerated: generatedSet.has(`${mi}-${li}`),
    });

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

  const depthLabel = courseDepth?.replace('_', ' ');

  const reviewsDueCount = useMemo(() => {
    if (!progressData?.quizzes) return 0;
    return progressData.quizzes.filter((q) => q.reviewDue).length;
  }, [progressData]);

  return (
    <S.Container>
      <S.Header>
        <S.CourseNameLink onClick={() => router.push(courseBasePath)}>{courseName || 'Course'}</S.CourseNameLink>
        <S.MetaRow>
          {depthLabel && <Badge variant="gold">{depthLabel}</Badge>}
          <S.MetaText>
            {modules.length} {plural({ count: modules.length, singular: 'module' })} &middot; {totalLessons} {plural({ count: totalLessons, singular: 'lesson' })}
          </S.MetaText>
        </S.MetaRow>
        <S.ProgressHeader>
          <S.ProgressPercent>
            {totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}% Complete
          </S.ProgressPercent>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0} />
          </S.ProgressBarTrack>
        </S.ProgressHeader>
        {reviewsDueCount > 0 && (
          <S.ReviewsDueBanner>
            <S.ReviewDot />
            {reviewsDueCount} {plural({ count: reviewsDueCount, singular: 'review' })} due
          </S.ReviewsDueBanner>
        )}
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
                    const isActive =
                      currentModuleIndex !== undefined &&
                      currentLessonIndex !== undefined &&
                      mi === currentModuleIndex &&
                      li === currentLessonIndex;
                    const indicatorState = getIndicatorState({ mi, li });
                    const isBookmarked = progressMap.get(`${mi}-${li}`)?.bookmarked;

                    return (
                      <S.LessonItem
                        key={li}
                        ref={isActive ? activeRef : undefined}
                        $active={isActive}
                        onClick={() => onNavigate(mi, li)}
                      >
                        <LessonIndicator state={indicatorState} size="sm" />
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
                    const variant: QuizIconVariant = locked
                      ? 'locked'
                      : qp?.bestTier ?? 'not-taken';
                    const QuizIcon = quizIconFor[variant];

                    return (
                      <S.QuizItem
                        $locked={locked}
                        onClick={() => {
                          if (!locked) {
                            router.push(`${courseBasePath}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`);
                          }
                        }}
                      >
                        <S.QuizIconCircle $variant={variant}>
                          <QuizIcon size={12} strokeWidth={2} />
                        </S.QuizIconCircle>
                        <S.LessonName>Module Quiz</S.LessonName>
                        {qp?.reviewDue && <S.ReviewDueBadge>Review due</S.ReviewDueBadge>}
                        {qp?.bestTier && (
                          <S.QuizBadge $tier={qp.bestTier}>{qp.bestScore}%</S.QuizBadge>
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
