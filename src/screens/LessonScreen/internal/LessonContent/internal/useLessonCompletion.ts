import { useCallback } from 'react';
import { toast } from 'sonner';
import { TOASTS } from '@/constants/toasts';
import { useUpsertProgress } from '@/hooks';
import { analytics } from '@/lib/analytics';
import { celebrateLessonComplete, celebrateModuleComplete, celebrateCourseComplete } from '@/lib/celebrations';
import type { CourseProgressResponse } from '@/api/routes/course';

interface Module {
  name: string;
  lessons?: { name: string; description: string }[];
}

interface UseLessonCompletionParams {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  modules: Module[];
  progressData?: CourseProgressResponse;
  hasNext: boolean;
  onNext: () => void;
  onOpenQuiz: () => void;
}

export const useLessonCompletion = ({
  courseId,
  moduleIndex,
  lessonIndex,
  modules,
  progressData,
  hasNext,
  onNext,
  onOpenQuiz,
}: UseLessonCompletionParams) => {
  const upsertProgress = useUpsertProgress();

  const currentLessonProgress = progressData?.lessons?.find(
    (lp) => lp.moduleIndex === moduleIndex && lp.lessonIndex === lessonIndex,
  );
  const isCompleted = currentLessonProgress?.status === 'completed';
  const isBookmarked = currentLessonProgress?.bookmarked ?? false;

  const handleMarkComplete = useCallback(() => {
    upsertProgress.mutate(
      { courseId, moduleIndex, lessonIndex, data: { status: 'completed' } },
      {
        onSuccess: () => {
          analytics.track('lesson_completed', {
            course_id: courseId,
            lesson_id: `${courseId}-${moduleIndex}-${lessonIndex}`,
            module_index: moduleIndex,
            lesson_index: lessonIndex,
            ...(typeof currentLessonProgress?.timeSpentSeconds === 'number' && {
              time_on_lesson_seconds: currentLessonProgress.timeSpentSeconds,
            }),
          });
          const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
          const completedBefore = progressData?.stats?.completed ?? 0;
          const completedNow = completedBefore + 1;

          const moduleLessons = modules[moduleIndex]?.lessons?.length ?? 0;
          let moduleCompletedBefore = 0;
          for (let li = 0; li < moduleLessons; li++) {
            const lp = progressData?.lessons?.find((p) => p.moduleIndex === moduleIndex && p.lessonIndex === li);
            if (lp?.status === 'completed') moduleCompletedBefore++;
          }
          const isModuleComplete = moduleCompletedBefore + 1 === moduleLessons;
          const isCourseComplete = completedNow === totalLessons;

          if (isCourseComplete) {
            celebrateCourseComplete();
            toast(TOASTS.COURSE_COMPLETE);
            setTimeout(onOpenQuiz, 800);
          } else if (isModuleComplete) {
            celebrateModuleComplete();
            // Auto-redirect to the module quiz follows in 800ms — the toast
            // doesn't need to call out "take the quiz", the user is already
            // looking at it by the time they finish reading the toast.
            toast(`Module ${moduleIndex + 1} complete.`);
            setTimeout(onOpenQuiz, 800);
          } else {
            celebrateLessonComplete();
            if (hasNext) setTimeout(onNext, 800);
          }
        },
      },
    );
  }, [courseId, moduleIndex, lessonIndex, modules, progressData, upsertProgress, hasNext, onNext, onOpenQuiz]);

  const handleToggleBookmark = useCallback(() => {
    upsertProgress.mutate({
      courseId,
      moduleIndex,
      lessonIndex,
      data: { bookmarked: !isBookmarked },
    });
  }, [courseId, moduleIndex, lessonIndex, isBookmarked, upsertProgress]);

  return {
    upsertProgress,
    currentLessonProgress,
    isCompleted,
    isBookmarked,
    handleMarkComplete,
    handleToggleBookmark,
  };
};
