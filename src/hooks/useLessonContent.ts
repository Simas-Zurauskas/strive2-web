'use client';

import { useQuery } from '@tanstack/react-query';
import { getLessonContent } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useLessonContent = (courseId: string, moduleIndex: number, lessonIndex: number) =>
  useQuery({
    queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
    queryFn: () => getLessonContent(courseId, moduleIndex, lessonIndex),
    retry: false,
  });
