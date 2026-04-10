'use client';

import { useQuery } from '@tanstack/react-query';
import { getLessonContent } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useLessonContent = (courseId: string, moduleIndex: number, lessonIndex: number, isGenerating?: boolean, enabled = true) =>
  useQuery({
    queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
    queryFn: () => getLessonContent({ courseId, moduleIndex, lessonIndex }),
    retry: false,
    enabled,
    // Poll during generation so blocks appear progressively on reload/navigate-back
    refetchInterval: isGenerating ? 3000 : false,
  });
