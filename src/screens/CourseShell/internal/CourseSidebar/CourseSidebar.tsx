'use client';

import {
  AlertCircle,
  BookmarkCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { Badge, LessonIndicator, computeLessonIndicatorState } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { plural } from '@/lib/strings';
import * as S from './CourseSidebar.styles';
import { useCourseContext } from '../../CourseContext';
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
  onToggleModule: (index: number) => void;
}

export const CourseSidebar = ({
  courseBasePath,
  courseName,
  courseDepth,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  onNavigate,
  onCollapse,
  progressData,
  generatedLessons,
  activeLesson,
  expandedModules: expandedModulesProp,
  onToggleModule,
}: CourseSidebarProps) => {
  const router = useRouter();
  const activeRef = useRef<HTMLButtonElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef(new Map<number, HTMLDivElement>());
  // Set by the module header's click handler when a toggle OPENS a module;
  // read and cleared by the reveal effect once the lesson rows have committed.
  const pendingRevealRef = useRef<number | null>(null);
  const { isDesktop, setSidebarOpen } = useCourseContext();

  // Tablet/mobile: tapping the course title should both navigate AND
  // close the sidebar overlay. Desktop keeps the sidebar visible since
  // it's a persistent left rail. Same pattern as navigateToLesson in
  // CourseShell — overlay routes auto-dismiss after acting.
  const handleCourseTitleClick = () => {
    router.push(courseBasePath);
    if (!isDesktop) setSidebarOpen(false);
  };

  // Render-time fallback: empty set until the parent has hydrated the
  // per-course expanded set from localStorage (one effect tick after
  // mount). One frame of "all collapsed" is far less jarring than the
  // legacy "all expanded → collapse to one" flash.
  const expandedModules = expandedModulesProp ?? new Set<number>();

  const handleToggleModule = (mi: number) => {
    // Only an OPENING toggle needs a reveal — collapsing shrinks the tree and
    // can only bring more of it into view.
    pendingRevealRef.current = expandedModules.has(mi) ? null : mi;
    onToggleModule(mi);
  };

  // Bring a just-expanded module into view inside the tree's OWN scroller.
  // Without this, expanding the last module of a long course is invisible:
  // measured at 375x667, tapping module 10 of 10 rendered 7 rows at y 659-998
  // against a visible band of 117-667 — 0 of them on screen — while scrollTop
  // stayed at 606 and only scrollHeight moved (1011 -> 1402). The user sees
  // literally nothing happen.
  //
  // Deliberately `tree.scrollBy` rather than `section.scrollIntoView`:
  // scrollIntoView walks every scrollable ancestor and would also move the
  // page behind the drawer. Deliberately anchored on the SECTION rather than
  // the lesson list, so a module taller than the tree puts its header at the
  // top edge instead of scrolling the header away.
  useEffect(() => {
    const mi = pendingRevealRef.current;
    if (mi === null) return;
    pendingRevealRef.current = null;
    const tree = treeRef.current;
    const section = sectionRefs.current.get(mi);
    if (!tree || !section) return;

    const treeRect = tree.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    // Taller than the window we have, or hanging off the top: pin the header
    // to the top edge. Otherwise lift it just enough to show the whole module.
    const delta =
      sectionRect.height > treeRect.height || sectionRect.top < treeRect.top
        ? sectionRect.top - treeRect.top
        : Math.max(0, sectionRect.bottom - treeRect.bottom);
    if (Math.abs(delta) < 1) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tree.scrollBy({ top: delta, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    // Deliberately no dependency array: this must run on the commit that
    // paints the newly expanded lesson rows, and `expandedModules` is rebuilt
    // every render anyway (`expandedModulesProp ?? new Set()`), so a dep list
    // would not reduce how often it runs. The ref guard above makes every
    // other invocation a no-op.
  });

  // Scroll active lesson into view on mount
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [currentModuleIndex, currentLessonIndex]);

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

  // Quiz gate. Kept identical to CourseOverviewScreen's, which documents
  // why: the all-lessons-complete gate meant production data showed no
  // quiz was EVER generated, so the rule is two completed lessons (or the
  // only lesson in a one-lesson module). Divergent gates here also made
  // any "how do I unlock this" copy untrue on one surface or the other.
  const isQuizUnlocked = (mi: number) => {
    const mp = getModuleProgress(mi);
    return mp.total > 0 && mp.completed >= Math.min(2, mp.total);
  };

  const depthLabel = courseDepth?.replace('_', ' ');

  const reviewsDueCount = useMemo(() => {
    if (!progressData?.quizzes) return 0;
    return progressData.quizzes.filter((q) => q.reviewDue).length;
  }, [progressData]);

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.CourseNameLink onClick={handleCourseTitleClick}>{courseName || 'Course'}</S.CourseNameLink>
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
        </S.HeaderContent>
        <S.CollapseButton
          onClick={onCollapse}
          aria-label="Collapse lessons panel"
          title="Collapse (⌘⇧\)"
        >
          <ChevronLeft size={18} />
        </S.CollapseButton>
      </S.Header>

      <S.Tree ref={treeRef}>
        {modules.map((mod, mi) => {
          const expanded = expandedModules.has(mi);
          const lessons = mod.lessons ?? [];
          const mp = getModuleProgress(mi);
          const lessonListId = `module-lessons-${mi}`;

          // Compute the quiz variant for the inline collapsed-header badge.
          // Only render the badge when collapsed AND the quiz is actionable
          // (unattempted-but-unlocked, or review-due) — `mastered`/`passed`
          // need no nudge, `locked` is implied by the closed module.
          const qpForHeader = quizProgressMap.get(mi);
          const quizUnlocked = isQuizUnlocked(mi);
          const headerQuizVariant: QuizIconVariant | null = !expanded && quizUnlocked
            ? (qpForHeader?.bestTier === 'needs_review' || qpForHeader?.reviewDue
                ? 'needs_review'
                : !qpForHeader
                  ? 'not-taken'
                  : null)
            : null;
          const HeaderQuizIcon = headerQuizVariant ? quizIconFor[headerQuizVariant] : null;

          return (
            <S.ModuleSection
              key={mi}
              ref={(node) => {
                if (node) sectionRefs.current.set(mi, node);
                else sectionRefs.current.delete(mi);
              }}
            >
              <S.ModuleHeader
                $expanded={expanded}
                onClick={() => handleToggleModule(mi)}
                aria-expanded={expanded}
                aria-controls={lessonListId}
              >
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
                {HeaderQuizIcon && headerQuizVariant && (
                  <S.HeaderQuizBadge
                    $variant={headerQuizVariant}
                    aria-label={
                      headerQuizVariant === 'needs_review'
                        ? 'Module quiz review due'
                        : 'Module quiz available'
                    }
                  >
                    <HeaderQuizIcon size={11} strokeWidth={2.25} />
                  </S.HeaderQuizBadge>
                )}
              </S.ModuleHeader>

              {expanded && (
                <S.LessonList id={lessonListId}>
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
                          <S.BookmarkIcon aria-label="Bookmarked">
                            <BookmarkCheck size={13} strokeWidth={1.75} fill="currentColor" />
                          </S.BookmarkIcon>
                        )}
                      </S.LessonItem>
                    );
                  })}

                  {(() => {
                    const locked = !quizUnlocked;
                    const qp = quizProgressMap.get(mi);
                    const variant: QuizIconVariant = locked
                      ? 'locked'
                      : qp?.bestTier ?? 'not-taken';
                    const QuizIcon = quizIconFor[variant];

                    return (
                      <S.QuizItem
                        type="button"
                        $locked={locked}
                        /* See CourseOverviewScreen's QuizRow — same defect,
                           same treatment. Painted disabled but disabled=false
                           and aria-disabled=null, and a tap did nothing at
                           all. Keep the row focusable and let it say why. */
                        aria-disabled={locked}
                        onClick={() => {
                          if (locked) {
                            toast(
                              lessons.length === 1
                                ? TOASTS.QUIZ_LOCKED_SINGLE_LESSON
                                : TOASTS.QUIZ_LOCKED,
                            );
                            return;
                          }
                          router.push(`${courseBasePath}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`);
                        }}
                      >
                        <S.QuizIconCircle $variant={variant}>
                          <QuizIcon size={12} strokeWidth={2} />
                        </S.QuizIconCircle>
                        <S.LessonName>Module Quiz</S.LessonName>
                        {locked && <S.LockedBadge>Locked</S.LockedBadge>}
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
