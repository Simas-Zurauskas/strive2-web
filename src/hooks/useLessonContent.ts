'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getLessonContent } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useLessonContent = ({
  courseId,
  moduleIndex,
  lessonIndex,
  isGenerating,
  enabled = true,
}: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  isGenerating?: boolean;
  enabled?: boolean;
}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
    queryFn: () => getLessonContent({ courseId, moduleIndex, lessonIndex }),
    retry: false,
    enabled: enabled && status === 'authenticated',
    // Poll during generation so blocks appear progressively on reload/navigate-back
    refetchInterval: isGenerating ? 3000 : false,
  });
};
