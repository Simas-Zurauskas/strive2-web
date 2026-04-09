'use client';

import { createContext, useContext } from 'react';
import type { CourseProgressResponse } from '@/api/routes/course';
import type { Course } from '@/api/types';

interface Module {
  name: string;
  description: string;
  lessons?: { name: string; description: string }[];
}

export interface CourseContextValue {
  courseId: string;
  courseBasePath: string;
  course: Course | undefined;
  isLoading: boolean;
  modules: Module[];
  progressData: CourseProgressResponse | undefined;
  generatedLessons: { moduleIndex: number; lessonIndex: number }[] | undefined;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  isDesktop: boolean;
  expandedModules: Set<number> | null;
  setExpandedModules: (val: Set<number>) => void;
  navigateToLesson: (mi: number, li: number) => void;
  onDeleteCourse: () => void;
}

const CourseContext = createContext<CourseContextValue | null>(null);

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourseContext must be used within CourseShell');
  return ctx;
};

export const CourseContextProvider = CourseContext.Provider;
