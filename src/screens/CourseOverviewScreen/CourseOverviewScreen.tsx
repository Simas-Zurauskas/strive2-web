'use client';

import { AlertCircle, CheckCircle, ChevronRight, Lock, Sparkles, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Badge, HelpAnchor, LessonIndicator, TextAction, computeLessonIndicatorState } from '@/components';
import { plural } from '@/lib/strings';
import { useCourseContext } from '@/screens/CourseShell';
import * as S from './CourseOverviewScreen.styles';
import { UpNextHero } from './internal/UpNextHero';
import type { CourseQuizProgressItem } from '@/api/types';
import type { QuizIconVariant } from '@/types';

const quizIconFor: Record<QuizIconVariant, typeof Trophy> = {
  locked: Lock,
  'not-taken': Sparkles,
  mastered: Trophy,
  passed: CheckCircle,
  needs_review: AlertCircle,
};

export const CourseOverviewScreen = () => {
  const router = useRouter();
  const {
    courseBasePath,
    course,
    modules,
    progressData,
    generatedLessons,
    navigateToLesson,
    onDeleteCourse,
    onArchiveCourse,
    expandedModules,
    toggleExpandedModule,
    nextAction,
  } = useCourseContext();

  const generatedSet = useMemo(() => {
    const set = new Set<string>();
    if (generatedLessons) {
      for (const gl of generatedLessons) set.add(`${gl.moduleIndex}-${gl.lessonIndex}`);
    }
    return set;
  }, [generatedLessons]);

  const progressMap = useMemo(() => {
    const map = new Map<string, string>();
    if (progressData?.lessons) {
      for (const lp of progressData.lessons) {
        map.set(`${lp.moduleIndex}-${lp.lessonIndex}`, lp.status);
      }
    }
    return map;
  }, [progressData]);

  const quizProgressMap = useMemo(() => {
    const map = new Map<number, CourseQuizProgressItem>();
    if (progressData?.quizzes) {
      for (const qp of progressData.quizzes) {
        map.set(qp.moduleIndex, qp);
      }
    }
    return map;
  }, [progressData]);

  const bookmarkedLessons = useMemo(() => {
    if (!progressData?.lessons) return [];
    return progressData.lessons
      .filter((lp) => lp.bookmarked)
      .map((lp) => ({
        moduleIndex: lp.moduleIndex,
        lessonIndex: lp.lessonIndex,
        moduleName: modules[lp.moduleIndex]?.name ?? `Module ${lp.moduleIndex + 1}`,
        lessonName: modules[lp.moduleIndex]?.lessons?.[lp.lessonIndex]?.name ?? `Lesson ${lp.lessonIndex + 1}`,
      }));
  }, [progressData, modules]);

  const reviewsDue = useMemo(() => {
    if (!progressData?.quizzes) return [];
    return progressData.quizzes
      .filter((q) => q.reviewDue)
      .map((q) => ({
        moduleIndex: q.moduleIndex,
        moduleName: modules[q.moduleIndex]?.name ?? `Module ${q.moduleIndex + 1}`,
        bestScore: q.bestScore,
      }));
  }, [progressData, modules]);

  // Modules where all lessons are completed but quiz has never been attempted
  const unattemptedQuizzes = useMemo(() => {
    const results: { moduleIndex: number; moduleName: string }[] = [];
    for (let mi = 0; mi < modules.length; mi++) {
      const lessons = modules[mi]?.lessons ?? [];
      if (lessons.length === 0) continue;
      let completed = 0;
      for (let li = 0; li < lessons.length; li++) {
        if (progressMap.get(`${mi}-${li}`) === 'completed') completed++;
      }
      if (completed === lessons.length && !quizProgressMap.has(mi)) {
        results.push({
          moduleIndex: mi,
          moduleName: modules[mi]?.name ?? `Module ${mi + 1}`,
        });
      }
    }
    return results;
  }, [modules, progressMap, quizProgressMap]);

  const stats = progressData?.stats;
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  const depthLabel = course?.depth?.replace('_', ' ');

  // Coordinates of the lesson that the UpNextHero CTA points at — used to
  // paint a subtle gold left-rail on that row inside the open module so
  // the eye lands on the same target even if the user scrolls past the hero.
  const focusLesson =
    nextAction && nextAction.lessonIndex !== undefined
      ? { mi: nextAction.moduleIndex, li: nextAction.lessonIndex }
      : null;

  const getIndicatorState = ({ mi, li }: { mi: number; li: number }) =>
    computeLessonIndicatorState({
      moduleIndex: mi,
      lessonIndex: li,
      activeLesson: course?.activeLesson ?? null,
      progressStatus: progressMap.get(`${mi}-${li}`),
      isGenerated: generatedSet.has(`${mi}-${li}`),
    });

  const getModuleProgress = (mi: number) => {
    const lessons = modules[mi]?.lessons ?? [];
    let completed = 0;
    for (let li = 0; li < lessons.length; li++) {
      if (progressMap.get(`${mi}-${li}`) === 'completed') completed++;
    }
    return { completed, total: lessons.length };
  };

  if (!course) return null;

  return (
    <S.Container>
      <S.Header>
        <S.Title>{course.name}</S.Title>
        <S.Goal>{course.goal}</S.Goal>
        <S.MetaRow>
          {depthLabel && <Badge variant="gold">{depthLabel}</Badge>}
          <Badge variant="default">
            {modules.length} {plural({ count: modules.length, singular: 'module' })} &middot; {totalLessons} {plural({ count: totalLessons, singular: 'lesson' })}
          </Badge>
        </S.MetaRow>
      </S.Header>

      {/* Up next — always-visible directional anchor (replaces the conditional
          ProgressSection that only rendered after >0% progress). The thin
          progress bar moves to the bottom of this card; the new CTA carries
          the "what to click next" message in all five course states. */}
      <UpNextHero />

      {/* Slim progress bar — secondary readout, only after the user has
          made any forward motion. Does not duplicate the Up-next CTA. */}
      {stats && stats.percentage > 0 && (
        <S.ProgressMini>
          <S.ProgressMiniLabel>{stats.percentage}% complete</S.ProgressMiniLabel>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={stats.percentage} />
          </S.ProgressBarTrack>
        </S.ProgressMini>
      )}

      {/* Quizzes to do: unattempted + reviews due */}
      {(unattemptedQuizzes.length > 0 || reviewsDue.length > 0) && (
        <S.ReviewsSection>
          <S.ReviewsHeader>Quizzes ({unattemptedQuizzes.length + reviewsDue.length})</S.ReviewsHeader>
          {unattemptedQuizzes.map((q) => (
            <S.ReviewItem
              key={`unattempted-${q.moduleIndex}`}
              onClick={() => router.push(`${courseBasePath}/quiz/${q.moduleIndex}`)}
            >
              <S.ReviewModuleName>
                Module {q.moduleIndex + 1}: {q.moduleName}
              </S.ReviewModuleName>
              <S.RowArrow>&rarr;</S.RowArrow>
            </S.ReviewItem>
          ))}
          {reviewsDue.map((r) => (
            <S.ReviewItem
              key={`review-${r.moduleIndex}`}
              onClick={() => router.push(`${courseBasePath}/quiz/${r.moduleIndex}?review=true`)}
            >
              <S.ReviewModuleName>
                Module {r.moduleIndex + 1}: {r.moduleName}
              </S.ReviewModuleName>
              <S.RowArrow>&rarr;</S.RowArrow>
            </S.ReviewItem>
          ))}
        </S.ReviewsSection>
      )}

      {/* Bookmarked lessons */}
      {bookmarkedLessons.length > 0 && (
        <S.BookmarksSection>
          <S.BookmarksHeader>Bookmarked lessons ({bookmarkedLessons.length})</S.BookmarksHeader>
          {bookmarkedLessons.map((b) => (
            <S.BookmarkItem
              key={`${b.moduleIndex}-${b.lessonIndex}`}
              onClick={() => navigateToLesson(b.moduleIndex, b.lessonIndex)}
            >
              <S.BookmarkLessonName>
                {b.moduleName} &middot; {b.lessonName}
              </S.BookmarkLessonName>
              <S.RowArrow>&rarr;</S.RowArrow>
            </S.BookmarkItem>
          ))}
        </S.BookmarksSection>
      )}

      {/* Course outline — collapsible cards. The expanded set is shared with
          the sidebar via CourseContext, so the user maintains a single mental
          model of "which modules am I currently focused on." */}
      <S.SectionTitle>
        Course Outline <HelpAnchor concept="modules-and-lessons" size="sm" />
      </S.SectionTitle>
      {modules.map((mod, mi) => {
        const mp = getModuleProgress(mi);
        const isModuleComplete = mp.completed === mp.total && mp.total > 0;
        const qp = quizProgressMap.get(mi);
        const expanded = expandedModules?.has(mi) ?? false;
        const lessonListId = `overview-module-lessons-${mi}`;

        // Surface an inline quiz indicator on the COLLAPSED header when the
        // quiz is actionable (unattempted-but-unlocked, or review-due) so
        // collapsing the module doesn't bury anything the user should act on.
        const headerQuizVariant: QuizIconVariant | null = !expanded && isModuleComplete
          ? (qp?.bestTier === 'needs_review' || qp?.reviewDue
              ? 'needs_review'
              : !qp
                ? 'not-taken'
                : null)
          : null;
        const HeaderQuizIcon = headerQuizVariant ? quizIconFor[headerQuizVariant] : null;

        return (
          <S.ModuleCard key={mi}>
            <S.ModuleHeader
              type="button"
              onClick={() => toggleExpandedModule(mi)}
              aria-expanded={expanded}
              aria-controls={lessonListId}
            >
              <S.ChevronWrap $expanded={expanded} aria-hidden>
                <ChevronRight size={14} strokeWidth={2} />
              </S.ChevronWrap>
              <S.ModuleTitle>
                Module {mi + 1} <S.ModuleDot>&middot;</S.ModuleDot> {mod.name}
              </S.ModuleTitle>
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
                  <HeaderQuizIcon size={12} strokeWidth={2.25} />
                </S.HeaderQuizBadge>
              )}
            </S.ModuleHeader>

            {expanded && (
              <>
                <S.ModuleDescription>{mod.description}</S.ModuleDescription>
                <S.LessonList id={lessonListId}>
                  {mod.lessons?.map((lesson, li) => {
                    const indicatorState = getIndicatorState({ mi, li });
                    const isFocus =
                      !!focusLesson && focusLesson.mi === mi && focusLesson.li === li;
                    return (
                      <S.LessonItem
                        key={li}
                        $focus={isFocus}
                        onClick={() => navigateToLesson(mi, li)}
                      >
                        <LessonIndicator state={indicatorState} size="md" />
                        <S.LessonContent>
                          <S.LessonName>{lesson.name}</S.LessonName>
                          <S.LessonDescription>{lesson.description}</S.LessonDescription>
                        </S.LessonContent>
                      </S.LessonItem>
                    );
                  })}

                  {/* Module quiz */}
                  {(() => {
                    const variant: QuizIconVariant = !isModuleComplete
                      ? 'locked'
                      : qp?.bestTier ?? 'not-taken';
                    const QuizIcon = quizIconFor[variant];
                    return (
                      <S.QuizRow
                        $locked={!isModuleComplete}
                        onClick={() =>
                          isModuleComplete &&
                          router.push(`${courseBasePath}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`)
                        }
                      >
                        <S.QuizIcon $variant={variant}>
                          <QuizIcon size={14} strokeWidth={2} />
                        </S.QuizIcon>
                        <S.QuizLabel>Module Quiz</S.QuizLabel>
                        {isModuleComplete && !qp && <S.TakeQuizBadge>Take quiz</S.TakeQuizBadge>}
                        {qp?.reviewDue && <S.ReviewDueBadge>Review due</S.ReviewDueBadge>}
                        {qp?.bestTier && <S.QuizBadge $tier={qp.bestTier}>{qp.bestScore}%</S.QuizBadge>}
                      </S.QuizRow>
                    );
                  })()}
                </S.LessonList>
              </>
            )}
          </S.ModuleCard>
        );
      })}

      <S.DangerZone>
        <S.ArchiveLink onClick={onArchiveCourse}>
          {course?.status === 'archived' ? 'Unarchive course' : 'Archive course'}
        </S.ArchiveLink>
        <TextAction $variant="danger" onClick={onDeleteCourse}>
          Delete course
        </TextAction>
      </S.DangerZone>
    </S.Container>
  );
};
