'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourses, getCourse } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useCourses = () =>
  useQuery({
    queryKey: [QKeys.COURSES],
    queryFn: getCourses,
  });

export const useCourse = (courseId: string | null) =>
  useQuery({
    queryKey: [QKeys.COURSE, courseId],
    queryFn: () => getCourse(courseId!),
    enabled: !!courseId,
  });
