'use client';

import { Check, Circle, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Badge } from '@/components';
import { useCourseContext } from '@/screens/CourseShell';
import * as S from './CourseOverview.styles';
import type { CourseQuizProgressItem, LessonProgressStatus } from '@/api/types';

export const CourseOverview = () => {
  const router = useRouter();
  const { courseId, course, modules, progressData, navigateToLesson, onDeleteCourse } = useCourseContext();

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
            {modules.length} module{modules.length !== 1 ? 's' : ''} &middot; {totalLessons} lesson
            {totalLessons !== 1 ? 's' : ''}
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

      {/* Reviews due */}
      {reviewsDue.length > 0 && (
        <S.ReviewsSection>
          <S.ReviewsHeader>
            {reviewsDue.length} review{reviewsDue.length !== 1 ? 's' : ''} due
          </S.ReviewsHeader>
          {reviewsDue.map((r) => (
            <S.ReviewItem
              key={r.moduleIndex}
              onClick={() => router.push(`/course/${courseId}/quiz/${r.moduleIndex}?review=true`)}
            >
              <S.ReviewModuleName>
                Module {r.moduleIndex + 1}: {r.moduleName}
              </S.ReviewModuleName>
              <S.ReviewAction>Review &rarr;</S.ReviewAction>
            </S.ReviewItem>
          ))}
        </S.ReviewsSection>
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
              <S.ModuleNumber>Module {mi + 1}</S.ModuleNumber>
              <S.ModuleTitle>{mod.name}</S.ModuleTitle>
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
              <S.QuizRow
                $locked={!isModuleComplete}
                onClick={() =>
                  isModuleComplete &&
                  router.push(`/course/${courseId}/quiz/${mi}${qp?.reviewDue ? '?review=true' : ''}`)
                }
              >
                <S.QuizIcon $locked={!isModuleComplete}>Q</S.QuizIcon>
                <S.QuizLabel>Module Quiz</S.QuizLabel>
                {qp?.reviewDue && <S.ReviewDueBadge>Review due</S.ReviewDueBadge>}
                {qp?.bestTier && <S.QuizBadge $tier={qp.bestTier}>{qp.bestScore}%</S.QuizBadge>}
              </S.QuizRow>
            </S.LessonList>
          </S.ModuleCard>
        );
      })}

      <S.DangerZone>
        <S.DeleteLink onClick={onDeleteCourse}>Delete course</S.DeleteLink>
      </S.DangerZone>
    </S.Container>
  );
};
