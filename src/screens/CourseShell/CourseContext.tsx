'use client';

import { createContext, useContext } from 'react';
import type { CourseProgressResponse } from '@/api/routes/course';
import type { Course } from '@/api/types';
import type { CourseNextAction } from '@/hooks';

interface Module {
  name: string;
  description: string;
  lessons?: { name: string; description: string }[];
}

export interface CourseContextValue {
  courseSlug: string;
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
  toggleExpandedModule: (mi: number) => void;
  navigateToLesson: (mi: number, li: number) => void;
  onDeleteCourse: () => void;
  onArchiveCourse: () => void;
  /** Single most useful next action for the course; null until course/progress have loaded. */
  nextAction: CourseNextAction | null;
}

const CourseContext = createContext<CourseContextValue | null>(null);

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourseContext must be used within CourseShell');
  return ctx;
};

export const CourseContextProvider = CourseContext.Provider;
