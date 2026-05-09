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
import { AnimatePresence, animate as motionAnimate, useMotionValue } from 'framer-motion';
import { List, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { deleteCourse, updateCourse } from '@/api/routes/course';
import { AlertDialog, TextLoader } from '@/components';
import { ROUTES } from '@/constants/routes';
import { TOASTS } from '@/constants/toasts';
import { useCourse, useCourseProgress, useGeneratedLessons } from '@/hooks';
import { analytics } from '@/lib/analytics';
import { breakpoints } from '@/theme';
import { QKeys } from '@/types';
import { CourseContextProvider } from './CourseContext';
import * as S from './CourseShell.styles';
import { CourseSidebar, ChatPanel } from './internal';
import {
  PANEL_CLOSE_TRANSITION,
  PANEL_OPEN_TRANSITION,
  PANEL_PARALLAX_OFFSET,
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
      // No toast — user confirmed via dialog; the visible state change
      // (course removed from home library) is the confirmation.
      router.push(ROUTES.home());
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
      router.push(ROUTES.home());
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

  // Mixpanel: emit `mentor_chat_opened` exactly when the panel transitions
  // from closed to open. The persisted `chatOpen=true` from a prior session
  // doesn't fire on the initial mount — useEffect's deps capture the
  // post-mount transition only via `prevChatOpenRef`.
  const prevChatOpenRef = useRef(chatOpen);
  useEffect(() => {
    if (chatOpen && !prevChatOpenRef.current) {
      analytics.track('mentor_chat_opened', {
        course_id: course?._id,
      });
    }
    prevChatOpenRef.current = chatOpen;
  }, [chatOpen, course?._id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(sidebarOpen));
    } catch {
      // non-fatal.
    }
  }, [sidebarOpen]);

  // ── Side-panel drag (tablet only) ─────────────────────
  // Drag and the open/close animation share a single motion value per
  // panel. Without this, the `animate` prop's variant target reasserts
  // `x: 0` every frame and tugs the drag value back — so the panel
  // appears not to follow the finger. Owning the motion value here
  // means drag updates it directly during the gesture; on release we
  // either commit (state change → effect animates motion value to
  // target) or snap back via motionAnimate.
  //
  // Targets are kept in PIXELS (not percentages or `calc()` strings)
  // because drag updates the motion value with pixel deltas, and
  // framer-motion can't interpolate from a pixel value to a string
  // target. We measure each panel's offsetWidth via ResizeObserver and
  // store closed-position pixel values in refs.
  //
  // Initial value branches on the initial open/closed state so panels
  // that mount in the closed state render off-screen on first paint,
  // not at x:0 (which produced a brief flash where both side panels
  // were visible at once over the lesson content).
  const sidebarX = useMotionValue(sidebarOpen ? 0 : -2000);
  const chatX = useMotionValue(chatOpen ? 0 : 2000);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const sidebarClosedX = useRef(-2000);
  const chatClosedX = useRef(2000);

  useEffect(() => {
    if (!sidebarRef.current || typeof ResizeObserver === 'undefined') return;
    const node = sidebarRef.current;
    const ro = new ResizeObserver(() => {
      // Closed = full width off-screen + parallax overshoot (same
      // magnitude as panelMotion.PANEL_PARALLAX_OFFSET so the
      // leading-edge slide reads identically to the variant-driven
      // animation we used before).
      sidebarClosedX.current = -(node.offsetWidth + PANEL_PARALLAX_OFFSET);
      // If the panel is currently closed, snap the motion value to
      // the freshly-measured closed offset so a viewport resize
      // doesn't strand it mid-transit.
      if (!sidebarOpen) sidebarX.set(sidebarClosedX.current);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [sidebarOpen, sidebarX]);

  useEffect(() => {
    if (!chatRef.current || typeof ResizeObserver === 'undefined') return;
    const node = chatRef.current;
    const ro = new ResizeObserver(() => {
      chatClosedX.current = node.offsetWidth + PANEL_PARALLAX_OFFSET;
      if (!chatOpen) chatX.set(chatClosedX.current);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [chatOpen, chatX]);

  // Use the same iOS-decelerating ease + duration vocabulary the rest
  // of the app uses for these panels (PANEL_OPEN_TRANSITION /
  // PANEL_CLOSE_TRANSITION in panelMotion.ts) so the move from
  // variant-driven animation to motion-value-driven animation doesn't
  // change the panel's perceived feel.
  useEffect(() => {
    motionAnimate(
      sidebarX,
      sidebarOpen ? 0 : sidebarClosedX.current,
      sidebarOpen ? PANEL_OPEN_TRANSITION : PANEL_CLOSE_TRANSITION,
    );
  }, [sidebarOpen, sidebarX]);

  useEffect(() => {
    motionAnimate(
      chatX,
      chatOpen ? 0 : chatClosedX.current,
      chatOpen ? PANEL_OPEN_TRANSITION : PANEL_CLOSE_TRANSITION,
    );
  }, [chatOpen, chatX]);


  // ── Keep fixed sidebars above the global footer ──────
  // Both sidebars are position: fixed with bottom: 0 — without this they'd
  // sit ON TOP of the footer when the page is scrolled to the bottom. We
  // measure how much of the footer is currently visible in the viewport
  // and write that as a CSS variable; the SidebarPanelFixed and
  // ChatPanelFixed styles bind their `bottom` to it. Result: panels stay
  // at viewport-bottom during normal scroll, retract upward exactly the
  // height of footer that's currently visible.
  useEffect(() => {
    const root = document.documentElement;
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const footer = document.querySelector('footer');
      if (!footer) {
        root.style.setProperty('--shell-bottom-offset', '0px');
        return;
      }
      const rect = footer.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - rect.top);
      root.style.setProperty('--shell-bottom-offset', `${overlap}px`);
    };
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
      root.style.setProperty('--shell-bottom-offset', '0px');
    };
  }, []);

  // ── Tag the body while the course shell is mounted ──
  // The lesson TopBar at tablet/mobile sits directly under the main
  // navbar and supplies its own bottom border. Without this flag the
  // navbar's scrolled-state border stacks on top, reading as a clumsy
  // double seam. Navbar.styles.ts watches this body class and drops
  // its border-bottom inside the matching media range.
  useEffect(() => {
    document.body.classList.add('in-course-shell');
    return () => {
      document.body.classList.remove('in-course-shell');
    };
  }, []);

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
  // Always shows the course name. The lesson title is already the H1 on
  // the page, so duplicating it in the sticky bar is just visual noise.
  // Showing the course name instead gives a "where am I" anchor while
  // scrolling deep into a lesson.
  const topBarTitle = course?.name ?? 'Course';

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

  // Mount the lesson bar inside the main navbar's extension slot. Living
  // in the same DOM element as the navbar means the two share the same
  // transform on hide-on-scroll and the same backdrop-filter — no possible
  // visual seam, no timing drift between two animated elements.
  // (Hooks declared above any early returns to satisfy Rules of Hooks.)
  const [navExtensionEl, setNavExtensionEl] = useState<Element | null>(null);
  useEffect(() => {
    setNavExtensionEl(document.getElementById('navbar-extension-slot'));
  }, []);


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

  const lessonBar = !isDesktop && (
    <S.LessonBar>
      <S.IconButton
        onClick={() => {
          /* Toggle: pressing while open closes; pressing while closed
             opens this panel and dismisses the other (the two are
             full-width overlays at tablet and would otherwise stack). */
          if (sidebarOpen) {
            setSidebarOpen(false);
          } else {
            setSidebarOpen(true);
            setChatOpen(false);
          }
        }}
        aria-label={sidebarOpen ? 'Close course navigation' : 'Open course navigation'}
        aria-expanded={sidebarOpen}
      >
        <List size={18} />
      </S.IconButton>
      <S.LessonBarTitle>{topBarTitle}</S.LessonBarTitle>
      <S.IconButton
        onClick={() => {
          if (chatOpen) {
            setChatOpen(false);
          } else {
            setChatOpen(true);
            setSidebarOpen(false);
          }
        }}
        aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={chatOpen}
      >
        <MessageCircle size={18} />
      </S.IconButton>
    </S.LessonBar>
  );

  return (
    <CourseContextProvider value={contextValue}>
      {navExtensionEl && lessonBar && createPortal(lessonBar, navExtensionEl)}
      <S.Layout>
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
          ref={sidebarRef}
          style={{ x: sidebarX }}
          aria-hidden={!sidebarOpen}
          /* Drag-to-close: enabled only at tablet/below. The panel's
             transform is a useMotionValue we own — drag updates it
             directly during the gesture (so it follows the finger),
             and the `animate` effect above re-takes control on
             open/close state changes. dragConstraints clamp leftward
             travel to one panel width; `dragElastic: 0` keeps the
             motion 1:1 with the finger inside the bounds. On release
             we either commit close (state flip → effect animates to
             closed) or snap back via motionAnimate. */
          drag={!isDesktop && sidebarOpen ? 'x' : false}
          dragConstraints={{ left: -440, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -100 || info.velocity.x < -400) {
              setSidebarOpen(false);
            } else {
              motionAnimate(sidebarX, 0, PANEL_CLOSE_TRANSITION);
            }
          }}
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
          ref={chatRef}
          style={{ x: chatX }}
          aria-hidden={!chatOpen}
          /* Drag-to-close — mirror of the sidebar pattern on the
             right edge. See SidebarPanelFixed for rationale. */
          drag={!isDesktop && chatOpen ? 'x' : false}
          dragConstraints={{ left: 0, right: 440 }}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 100 || info.velocity.x > 400) {
              setChatOpen(false);
            } else {
              motionAnimate(chatX, 0, PANEL_CLOSE_TRANSITION);
            }
          }}
        >
          <ChatPanel
          key={`${moduleIndex}-${lessonIndex}`}
          contextLabel={chatContextLabel}
          courseSlug={courseSlug}
          moduleIndex={moduleIndex}
          lessonIndex={lessonIndex}
          onClose={() => setChatOpen(false)}
        />
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
