'use client';

import { useQuery } from '@tanstack/react-query';
import { getLessonContent } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useLessonContent = (courseId: string, moduleIndex: number, lessonIndex: number, isGenerating?: boolean) =>
  useQuery({
    queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
    queryFn: () => getLessonContent(courseId, moduleIndex, lessonIndex),
    retry: false,
    // When generation is running, keep refetching so we pick up content saved mid-generation
    refetchInterval: isGenerating ? 3000 : false,
  });
