'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCourseProgress,
  getContinueLearning,
  getGeneratedLessons,
  getProgressSummary,
  upsertLessonProgress,
  UpsertProgressBody,
  generateModuleQuiz,
  getModuleQuizContent,
  submitQuizAttempt,
  getModuleQuizProgress,
  getReviewsDue,
  getUnattemptedQuizzes,
  resetModuleQuiz,
  getBookmarkedLessons,
  getRecentActivity,
} from '@/api/routes/course';
import { TOASTS } from '@/constants/toasts';
import { QKeys } from '@/types';

export const useCourseProgress = (courseId: string | null) =>
  useQuery({
    queryKey: [QKeys.COURSE_PROGRESS, courseId],
    queryFn: () => getCourseProgress(courseId!),
    enabled: !!courseId,
  });

export const useContinueLearning = () =>
  useQuery({
    queryKey: [QKeys.CONTINUE_LEARNING],
    queryFn: getContinueLearning,
  });

export const useGeneratedLessons = (courseId: string | null) =>
  useQuery({
    queryKey: [QKeys.GENERATED_LESSONS, courseId],
    queryFn: () => getGeneratedLessons(courseId!),
    enabled: !!courseId,
  });

export const useProgressSummary = () =>
  useQuery({
    queryKey: [QKeys.PROGRESS_SUMMARY],
    queryFn: getProgressSummary,
  });

export const useUpsertProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      courseId: string;
      moduleIndex: number;
      lessonIndex: number;
      data: UpsertProgressBody;
    }) =>
      upsertLessonProgress(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QKeys.COURSE_PROGRESS, variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.CONTINUE_LEARNING],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.PROGRESS_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.GAMIFICATION_PROFILE],
      });
    },
    meta: { errorMessage: 'Failed to save progress' },
  });
};

// ── Module quiz hooks ──────────────────────────────────

export const useModuleQuizContent = ({ courseId, moduleIndex }: { courseId: string | null; moduleIndex: number | null }) =>
  useQuery({
    queryKey: [QKeys.MODULE_QUIZ_CONTENT, courseId, moduleIndex],
    queryFn: () => getModuleQuizContent({ courseId: courseId!, moduleIndex: moduleIndex! }),
    enabled: !!courseId && moduleIndex !== null,
  });

export const useModuleQuizProgress = ({ courseId, moduleIndex }: { courseId: string | null; moduleIndex: number | null }) =>
  useQuery({
    queryKey: [QKeys.MODULE_QUIZ_PROGRESS, courseId, moduleIndex],
    queryFn: () => getModuleQuizProgress({ courseId: courseId!, moduleIndex: moduleIndex! }),
    enabled: !!courseId && moduleIndex !== null,
  });

export const useGenerateModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { courseId: string; moduleIndex: number }) =>
      generateModuleQuiz(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QKeys.MODULE_QUIZ_CONTENT, variables.courseId, variables.moduleIndex],
      });
    },
    meta: { errorMessage: TOASTS.QUIZ_START_ERROR },
  });
};

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      courseId: string;
      moduleIndex: number;
      responses: { questionId: string; selectedOption: number }[];
    }) =>
      submitQuizAttempt(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QKeys.MODULE_QUIZ_PROGRESS, variables.courseId, variables.moduleIndex],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.COURSE_PROGRESS, variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.REVIEWS_DUE],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.GAMIFICATION_PROFILE],
      });
    },
    meta: { errorMessage: TOASTS.QUIZ_SUBMIT_ERROR },
  });
};

export const useResetModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { courseId: string; moduleIndex: number }) =>
      resetModuleQuiz(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QKeys.MODULE_QUIZ_CONTENT, variables.courseId, variables.moduleIndex],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.MODULE_QUIZ_PROGRESS, variables.courseId, variables.moduleIndex],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.COURSE_PROGRESS, variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [QKeys.REVIEWS_DUE],
      });
    },
    meta: { errorMessage: 'Failed to reset quiz' },
  });
};

// ── Reviews due ──────────────────────────────────────────

export const useReviewsDue = () =>
  useQuery({
    queryKey: [QKeys.REVIEWS_DUE],
    queryFn: getReviewsDue,
  });

// ── Unattempted quiz count ───────────────────────────────

export const useUnattemptedQuizzes = () =>
  useQuery({
    queryKey: [QKeys.UNATTEMPTED_QUIZ_COUNT],
    queryFn: getUnattemptedQuizzes,
  });

// ── Bookmarked lessons ────────────────────────────────

export const useBookmarkedLessons = () =>
  useQuery({
    queryKey: [QKeys.BOOKMARKED_LESSONS],
    queryFn: getBookmarkedLessons,
  });

// ── Recent activity ─────────────────────────────────

export const useRecentActivity = () =>
  useQuery({
    queryKey: [QKeys.RECENT_ACTIVITY],
    queryFn: getRecentActivity,
  });
