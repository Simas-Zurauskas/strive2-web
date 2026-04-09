'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { deleteCourse } from '@/api/routes/course';
import { AlertDialog } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useCourse, useCourseProgress, useGeneratedLessons } from '@/hooks';
import { breakpoints } from '@/theme';
import { QKeys } from '@/types';
import { CourseContextProvider } from './CourseContext';
import * as S from './CourseShell.styles';
import { CourseSidebar, ChatPanel } from './internal';
import type { CourseContextValue } from './CourseContext';

const DESKTOP_MQ = `(min-width: ${breakpoints.desktop + 1}px)`;

// Persists across remounts (route param changes remount page components, but layout stays)
let persistedExpandedModules: Set<number> | null = null;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
};

interface CourseShellProps {
  children: React.ReactNode;
}

export const CourseShell = ({ children }: CourseShellProps) => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isDesktop = useIsDesktop();

  const courseId = params.id as string;
  const moduleIndex = params.moduleIndex !== undefined ? Number(params.moduleIndex) : undefined;
  const lessonIndex = params.lessonIndex !== undefined ? Number(params.lessonIndex) : undefined;

  const { data: course, isLoading } = useCourse(courseId);
  const { data: progressData } = useCourseProgress(courseId);
  const { data: generatedLessons } = useGeneratedLessons(courseId);

  // ── Delete course ────────────────────────────────────
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId),
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success(TOASTS.COURSE_DELETED);
      router.push('/');
    },
  });

  // ── UI state ─────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true,
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedModules, setExpandedModulesState] = useState<Set<number> | null>(
    () => persistedExpandedModules,
  );
  const setExpandedModules = useCallback((val: Set<number>) => {
    persistedExpandedModules = val;
    setExpandedModulesState(val);
  }, []);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const modules = useMemo(() => course?.structure?.modules ?? [], [course?.structure?.modules]);

  // ── Navigation ───────────────────────────────────────
  const courseBasePath = `/course/${(course as Record<string, unknown>)?.slug ?? courseId}`;

  const navigateToLesson = useCallback(
    (mi: number, li: number) => {
      router.push(`${courseBasePath}/lesson/${mi}/${li}`);
      if (!isDesktop) setSidebarOpen(false);
    },
    [courseBasePath, router, isDesktop],
  );

  const closeOverlays = useCallback(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
      setChatOpen(false);
    }
  }, [isDesktop]);

  // ── Mobile top bar title ─────────────────────────────
  const topBarTitle = useMemo(() => {
    if (moduleIndex !== undefined && lessonIndex !== undefined) {
      return modules[moduleIndex]?.lessons?.[lessonIndex]?.name ?? 'Lesson';
    }
    return course?.name ?? 'Course';
  }, [moduleIndex, lessonIndex, modules, course?.name]);

  // ── Chat context label ───────────────────────────────
  const chatContextLabel = useMemo(() => {
    if (moduleIndex !== undefined && lessonIndex !== undefined) {
      return modules[moduleIndex]?.lessons?.[lessonIndex]?.name;
    }
    return course?.name;
  }, [moduleIndex, lessonIndex, modules, course?.name]);

  // ── Context value ────────────────────────────────────
  const contextValue: CourseContextValue = useMemo(
    () => ({
      courseId,
      courseBasePath,
      course,
      isLoading,
      modules,
      progressData: progressData ?? undefined,
      generatedLessons: generatedLessons ?? undefined,
      sidebarOpen,
      setSidebarOpen,
      chatOpen,
      setChatOpen,
      isDesktop,
      expandedModules,
      setExpandedModules,
      navigateToLesson,
      onDeleteCourse: () => setShowDeleteDialog(true),
    }),
    [
      courseId, courseBasePath, course, isLoading, modules, progressData, generatedLessons,
      sidebarOpen, chatOpen, isDesktop, expandedModules, setExpandedModules,
      navigateToLesson,
    ],
  );

  // ── Loading state ────────────────────────────────────
  if (isLoading) {
    return (
      <S.FullCenter>Loading...</S.FullCenter>
    );
  }

  if (!course) {
    return (
      <S.FullCenter>Course not found.</S.FullCenter>
    );
  }

  const showBackdrop = !isDesktop && (sidebarOpen || chatOpen);

  return (
    <CourseContextProvider value={contextValue}>
      <S.Layout>
        {/* Mobile top bar */}
        <S.TopBar>
          <S.IconButton onClick={() => setSidebarOpen(true)} aria-label="Open course navigation">
            <Menu size={18} />
          </S.IconButton>
          <S.TopBarTitle>{topBarTitle}</S.TopBarTitle>
          <S.IconButton onClick={() => setChatOpen(true)} aria-label="Open AI chat">
            <MessageCircle size={18} />
          </S.IconButton>
        </S.TopBar>

        {/* Backdrop for mobile overlays */}
        {showBackdrop && <S.Backdrop onClick={closeOverlays} />}

        {/* Left sidebar */}
        <S.SidebarSlot $open={sidebarOpen}>
          <CourseSidebar
            courseBasePath={courseBasePath}
            courseName={course.name}
            courseDepth={course.depth}
            modules={modules}
            currentModuleIndex={moduleIndex}
            currentLessonIndex={lessonIndex}
            onNavigate={navigateToLesson}
            onCollapse={() => setSidebarOpen(false)}
            progressData={progressData ?? undefined}
            generatedLessons={generatedLessons ?? undefined}
            expandedModules={expandedModules}
            onExpandedChange={setExpandedModules}
          />
        </S.SidebarSlot>

        {/* Center content */}
        <S.ContentSlot>{children}</S.ContentSlot>

        {/* Right chat panel */}
        <S.ChatSlot $open={chatOpen}>
          <ChatPanel contextLabel={chatContextLabel} onClose={() => setChatOpen(false)} />
        </S.ChatSlot>

        {/* Desktop floating chat toggle */}
        {!chatOpen && (
          <S.ChatToggle onClick={() => setChatOpen(true)} aria-label="Open AI chat">
            <MessageCircle size={22} />
          </S.ChatToggle>
        )}

        <AlertDialog
          open={showDeleteDialog}
          title="Delete this course?"
          description="This will permanently delete the course and all its data. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </S.Layout>
    </CourseContextProvider>
  );
};
