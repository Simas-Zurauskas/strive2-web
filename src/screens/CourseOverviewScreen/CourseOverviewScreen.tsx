'use client';

import { AlertCircle, Check, CheckCircle, Circle, Lock, Minus, Sparkles, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Badge, TextAction } from '@/components';
import { plural } from '@/lib/strings';
import { useCourseContext } from '@/screens/CourseShell';
import * as S from './CourseOverviewScreen.styles';
import type { CourseQuizProgressItem, LessonProgressStatus } from '@/api/types';
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
  const { courseBasePath, course, modules, progressData, navigateToLesson, onDeleteCourse, onArchiveCourse } =
    useCourseContext();

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

  // Find last accessed lesson for "Continue" button
  const continueTarget = useMemo(() => {
    if (!progressData?.lessons || progressData.lessons.length === 0) return { mi: 0, li: 0 };
    const sorted = [...progressData.lessons].sort(
      (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime(),
    );
    return { mi: sorted[0].moduleIndex, li: sorted[0].lessonIndex };
  }, [progressData]);

  const stats = progressData?.stats;
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  const depthLabel = course?.depth?.replace('_', ' ');

  const getLessonStatus = (mi: number, li: number): LessonProgressStatus | 'default' => {
    const status = progressMap.get(`${mi}-${li}`);
    if (status === 'completed') return 'completed';
    if (status === 'in_progress') return 'in_progress';
    return 'default';
  };

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
            {modules.length} {plural(modules.length, 'module')} &middot; {totalLessons} {plural(totalLessons, 'lesson')}
          </Badge>
        </S.MetaRow>
      </S.Header>

      {/* Progress */}
      {stats && stats.percentage > 0 && (
        <S.ProgressSection>
          <S.ProgressHeader>
            <S.ProgressLabel>Progress</S.ProgressLabel>
            <S.ProgressValue>{stats.percentage}% complete</S.ProgressValue>
          </S.ProgressHeader>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={stats.percentage} />
          </S.ProgressBarTrack>
          <S.ContinueButton onClick={() => navigateToLesson(continueTarget.mi, continueTarget.li)}>
            Continue learning
          </S.ContinueButton>
        </S.ProgressSection>
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

      {/* Course outline */}
      <S.SectionTitle>Course Outline</S.SectionTitle>
      {modules.map((mod, mi) => {
        const mp = getModuleProgress(mi);
        const isModuleComplete = mp.completed === mp.total && mp.total > 0;
        const qp = quizProgressMap.get(mi);

        return (
          <S.ModuleCard key={mi}>
            <S.ModuleHeader>
              <S.ModuleTitle>
                Module {mi + 1} <S.ModuleDot>&middot;</S.ModuleDot> {mod.name}
              </S.ModuleTitle>
              {mp.completed > 0 && (
                <S.ModuleProgress>
                  {mp.completed}/{mp.total}
                </S.ModuleProgress>
              )}
            </S.ModuleHeader>
            <S.ModuleDescription>{mod.description}</S.ModuleDescription>
            <S.LessonList>
              {mod.lessons?.map((lesson, li) => {
                const status = getLessonStatus(mi, li);
                return (
                  <S.LessonItem key={li} $status={status} onClick={() => navigateToLesson(mi, li)}>
                    <S.LessonStatus $status={status}>
                      {status === 'completed' ? (
                        <Check size={14} strokeWidth={3} />
                      ) : status === 'in_progress' ? (
                        <Minus size={14} strokeWidth={2.5} />
                      ) : (
                        <Circle size={6} />
                      )}
                    </S.LessonStatus>
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
