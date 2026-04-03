'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCourseProgress,
  getContinueLearning,
  getGeneratedLessons,
  getProgressSummary,
  upsertLessonProgress,
  UpsertProgressBody,
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
