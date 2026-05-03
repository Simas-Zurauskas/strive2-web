'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getCourses, getCourse } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useCourses = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.COURSES],
    queryFn: getCourses,
    enabled: status === 'authenticated',
  });
};

export const useCourse = (courseId: string | null) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.COURSE, courseId],
    queryFn: () => getCourse(courseId!),
    enabled: !!courseId && status === 'authenticated',
  });
};
