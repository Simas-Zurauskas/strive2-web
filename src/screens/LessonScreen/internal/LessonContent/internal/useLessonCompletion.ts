import { useCallback } from 'react';
import { toast } from 'sonner';
import { TOASTS } from '@/constants/toasts';
import { useUpsertProgress } from '@/hooks';
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
            toast.success(TOASTS.COURSE_COMPLETE);
            setTimeout(onOpenQuiz, 800);
          } else if (isModuleComplete) {
            celebrateModuleComplete();
            toast(`Module ${moduleIndex + 1} complete! Take the quiz to test your knowledge.`);
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
