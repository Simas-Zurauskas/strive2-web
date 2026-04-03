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
} from '@/api/routes/course';
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
      upsertLessonProgress(
        params.courseId,
        params.moduleIndex,
        params.lessonIndex,
        params.data,
      ),
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
    },
  });
};

// ── Module quiz hooks ──────────────────────────────────

export const useModuleQuizContent = (courseId: string | null, moduleIndex: number | null) =>
  useQuery({
    queryKey: [QKeys.MODULE_QUIZ_CONTENT, courseId, moduleIndex],
    queryFn: () => getModuleQuizContent(courseId!, moduleIndex!),
    enabled: !!courseId && moduleIndex !== null,
  });

export const useModuleQuizProgress = (courseId: string | null, moduleIndex: number | null) =>
  useQuery({
    queryKey: [QKeys.MODULE_QUIZ_PROGRESS, courseId, moduleIndex],
    queryFn: () => getModuleQuizProgress(courseId!, moduleIndex!),
    enabled: !!courseId && moduleIndex !== null,
  });

export const useGenerateModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { courseId: string; moduleIndex: number }) =>
      generateModuleQuiz(params.courseId, params.moduleIndex),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QKeys.MODULE_QUIZ_CONTENT, variables.courseId, variables.moduleIndex],
      });
    },
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
      submitQuizAttempt(params.courseId, params.moduleIndex, params.responses),
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
    },
  });
};

// ── Reviews due ──────────────────────────────────────────

export const useReviewsDue = () =>
  useQuery({
    queryKey: [QKeys.REVIEWS_DUE],
    queryFn: getReviewsDue,
  });
