'use client';

/**
 * CourseShell is the layout wrapper that mounts for every `/course/[slug]/...`
 * route. It owns course data fetching, the persistent sidebar, the chat panel,
 * and the CourseContext consumed by its children (LessonScreen,
 * CourseOverviewScreen, ModuleQuizScreen). The name omits the "Screen" suffix
 * on purpose — this component never renders stand-alone; Next.js wires it up
 * through a route-group layout rather than a `page.tsx`.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Menu, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { deleteCourse, updateCourse } from '@/api/routes/course';
import { AlertDialog, TextLoader } from '@/components';
import { ROUTES } from '@/constants/routes';
import { TOASTS } from '@/constants/toasts';
import { useCourse, useCourseProgress, useGeneratedLessons } from '@/hooks';
import { breakpoints } from '@/theme';
import { QKeys } from '@/types';
import { CourseContextProvider } from './CourseContext';
import * as S from './CourseShell.styles';
import { CourseSidebar, ChatPanel } from './internal';
import {
  leftPanelVariants,
  rightPanelVariants,
  slotVariants,
  tabEnterTransition,
  tabExitTransition,
} from './panelMotion';
import type { CourseContextValue } from './CourseContext';
import type { CourseStatus } from '@/api/types';

const DESKTOP_MQ = `(min-width: ${breakpoints.desktop + 1}px)`;

// Persists across remounts (route param changes remount page components, but layout stays)
let persistedExpandedModules: Set<number> | null = null;

// Persist panel-open states across page reloads, course switches, and
// lesson navigation. Plain "true"/"false" strings for forward-compat with
// other primitive flags we may want to colocate here.
const CHAT_OPEN_STORAGE_KEY = 'strive.lessonScreen.chatOpen';
const SIDEBAR_OPEN_STORAGE_KEY = 'strive.lessonScreen.sidebarOpen';

const readStoredBool = (key: string, fallback: boolean): boolean => {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch {
    return fallback;
  }
};

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

  const courseSlug = params.slug as string;
  const moduleIndex = params.moduleIndex !== undefined ? Number(params.moduleIndex) : undefined;
  const lessonIndex = params.lessonIndex !== undefined ? Number(params.lessonIndex) : undefined;

  const { data: course, isLoading } = useCourse(courseSlug);
  const { data: progressData } = useCourseProgress(courseSlug);
  const { data: generatedLessons } = useGeneratedLessons(courseSlug);

  // ── Delete course ────────────────────────────────────
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseSlug),
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast(TOASTS.COURSE_DELETED);
      router.push('/');
    },
  });

  // ── Archive / unarchive course ────────────────────────
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const isArchived = course?.status === 'archived';
  const archiveMutation = useMutation({
    mutationFn: () => {
      const newStatus: CourseStatus = isArchived ? 'ready' : 'archived';
      return updateCourse({ id: courseSlug, data: { status: newStatus } });
    },
    onSuccess: () => {
      setShowArchiveDialog(false);
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseSlug] });
      toast(isArchived ? TOASTS.COURSE_UNARCHIVED : TOASTS.COURSE_ARCHIVED);
      router.push('/');
    },
  });

  // ── UI state ─────────────────────────────────────────
  // Sidebar default: open on desktop, closed on mobile. Persisted choice
  // overrides the responsive default.
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const isDesktopMount =
      typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true;
    return readStoredBool(SIDEBAR_OPEN_STORAGE_KEY, isDesktopMount);
  });
  const [chatOpen, setChatOpen] = useState(() => readStoredBool(CHAT_OPEN_STORAGE_KEY, false));
  const [expandedModules, setExpandedModulesState] = useState<Set<number> | null>(
    () => persistedExpandedModules,
  );
  const setExpandedModules = useCallback((val: Set<number>) => {
    persistedExpandedModules = val;
    setExpandedModulesState(val);
  }, []);

  // ── Persist panel states to localStorage ─────────────
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_OPEN_STORAGE_KEY, String(chatOpen));
    } catch {
      // localStorage can throw in private mode / quota exceeded — non-fatal.
    }
  }, [chatOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(sidebarOpen));
    } catch {
      // non-fatal.
    }
  }, [sidebarOpen]);

  // ── Keyboard shortcuts ───────────────────────────────
  // ⌘\ / Ctrl+\           → toggle chat (right panel)
  // ⌘⇧\ / Ctrl+Shift+\   → toggle sidebar (left panel)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '\\' || (!e.metaKey && !e.ctrlKey) || e.altKey) return;
      e.preventDefault();
      if (e.shiftKey) {
        setSidebarOpen((prev) => !prev);
      } else {
        setChatOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const modules = useMemo(() => course?.structure?.modules ?? [], [course?.structure?.modules]);

  // ── Navigation ───────────────────────────────────────
  const courseBasePath = ROUTES.course(course?.slug, courseSlug);

  const navigateToLesson = useCallback(
    (mi: number, li: number) => {
      router.push(ROUTES.lesson(course?.slug, courseSlug, mi, li));
      if (!isDesktop) setSidebarOpen(false);
    },
    [course?.slug, courseSlug, router, isDesktop],
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
      courseSlug,
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
      onArchiveCourse: () => setShowArchiveDialog(true),
    }),
    [
      courseSlug, courseBasePath, course, isLoading, modules, progressData, generatedLessons,
      sidebarOpen, chatOpen, isDesktop, expandedModules, setExpandedModules,
      navigateToLesson,
    ],
  );

  // ── Loading state ────────────────────────────────────
  if (isLoading) {
    return (
      <S.FullCenter><TextLoader /></S.FullCenter>
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

        {/* Left sidebar — mirror of the right chat panel:
            SidebarSlot is empty grid placeholder animating width.
            SidebarPanelFixed is the visible panel with bottom-anchored
            geometry (no twitch). translateX animates open/close. */}
        <S.SidebarSlot
          initial={false}
          variants={slotVariants}
          animate={sidebarOpen ? 'open' : 'closed'}
        />
        <S.SidebarPanelFixed
          initial={false}
          variants={leftPanelVariants}
          animate={sidebarOpen ? 'open' : 'closed'}
          aria-hidden={!sidebarOpen}
        >
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
            activeLesson={course?.activeLesson ?? null}
            expandedModules={expandedModules}
            onExpandedChange={setExpandedModules}
          />
        </S.SidebarPanelFixed>

        {/* Center content */}
        <S.ContentSlot>{children}</S.ContentSlot>

        {/* Right chat panel.
            ChatSlot is an empty grid placeholder — it animates width to
            push lesson content as it opens/closes (so the layout reflows),
            but renders nothing.
            ChatPanelFixed is the actual visible panel. position:fixed with
            top:var(--navbar-offset) and bottom:0 anchors its bottom edge
            to viewport bottom by CSS — no interpolated math, no wobble for
            the chat composer. translateX handles open/close and the
            parallax (panel travels further than the slot collapses, so it
            "leads" the exit). The left sidebar will mirror this with
            leftPanelVariants. */}
        <S.ChatSlot
          initial={false}
          variants={slotVariants}
          animate={chatOpen ? 'open' : 'closed'}
        />
        <S.ChatPanelFixed
          initial={false}
          variants={rightPanelVariants}
          animate={chatOpen ? 'open' : 'closed'}
          aria-hidden={!chatOpen}
        >
          <ChatPanel contextLabel={chatContextLabel} onClose={() => setChatOpen(false)} />
        </S.ChatPanelFixed>

        {/* Desktop sidebar edge tab — mirror of the chat tab on the
            left edge. Travels in -x (leftward) on entry/exit. */}
        <AnimatePresence initial={false}>
          {!sidebarOpen && (
            <S.SidebarEdgeTab
              key="sidebar-edge-tab"
              style={{ y: '-50%' }}
              initial={{ x: -60, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: tabEnterTransition,
              }}
              exit={{
                x: -60,
                opacity: 0,
                transition: tabExitTransition,
              }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open lessons panel"
              title="Lessons (⌘⇧\)"
            >
              <S.SidebarEdgeTabLabel>Lessons</S.SidebarEdgeTabLabel>
            </S.SidebarEdgeTab>
          )}
        </AnimatePresence>

        {/* Desktop chat edge tab — same easing language as the panel:
            ease-in exit when the chat opens, delayed ease-out entry on
            close so the panel is mostly gone before it returns. */}
        <AnimatePresence initial={false}>
          {!chatOpen && (
            <S.ChatEdgeTab
              key="chat-edge-tab"
              style={{ y: '-50%' }}
              initial={{ x: 60, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: tabEnterTransition,
              }}
              exit={{
                x: 60,
                opacity: 0,
                transition: tabExitTransition,
              }}
              onClick={() => setChatOpen(true)}
              aria-label="Open AI mentor"
              title="Mentor (⌘\)"
            >
              <S.ChatEdgeTabLabel>Mentor</S.ChatEdgeTabLabel>
            </S.ChatEdgeTab>
          )}
        </AnimatePresence>

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

        <AlertDialog
          open={showArchiveDialog}
          title={isArchived ? 'Unarchive this course?' : 'Archive this course?'}
          description={
            isArchived
              ? 'This course will be moved back to your active courses.'
              : 'This course will be moved to your archived courses. You can unarchive it at any time.'
          }
          confirmLabel={isArchived ? 'Unarchive' : 'Archive'}
          cancelLabel="Cancel"
          loading={archiveMutation.isPending}
          onConfirm={() => archiveMutation.mutate()}
          onCancel={() => setShowArchiveDialog(false)}
        />
      </S.Layout>
    </CourseContextProvider>
  );
};
