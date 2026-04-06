'use client';

import { Menu, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAuthToken } from '@/api/client';
import { upsertLessonProgress } from '@/api/routes/course';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { useCourse, useCourseProgress, useGeneratedLessons } from '@/hooks';
import { breakpoints } from '@/theme';
import { CourseSidebar, ChatPanel, LessonContent } from './internal';
import * as S from './LessonScreen.styles';

const DESKTOP_MQ = `(min-width: ${breakpoints.desktop + 1}px)`;

// Persists across remounts (route param changes remount the page component)
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

export const LessonScreen = () => {
  const params = useParams();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const courseId = params.id as string;
  const moduleIndex = Number(params.moduleIndex);
  const lessonIndex = Number(params.lessonIndex);

  const { data: course, isLoading } = useCourse(courseId);
  const { data: progressData } = useCourseProgress(courseId);
  const { data: generatedLessons } = useGeneratedLessons(courseId);

  // Initialize sidebar open on desktop to avoid the open-animation flash on mount
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true,
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedModules, setExpandedModulesState] = useState<Set<number> | null>(() => persistedExpandedModules);
  const setExpandedModules = useCallback((val: Set<number> | null) => {
    persistedExpandedModules = val;
    setExpandedModulesState(val);
  }, []);

  // Sync sidebar with desktop/mobile on resize
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const modules = useMemo(() => course?.structure?.modules ?? [], [course?.structure?.modules]);
  const currentModule = modules[moduleIndex];
  const currentLesson = currentModule?.lessons?.[lessonIndex];

  // ── Navigation helpers ────────────────────────────────

  const navigateToLesson = useCallback(
    (mi: number, li: number) => {
      router.push(`/course/${courseId}/lesson/${mi}/${li}`);
      if (!isDesktop) setSidebarOpen(false);
    },
    [courseId, router, isDesktop],
  );

  const prevLesson = useCallback(() => {
    if (lessonIndex > 0) {
      navigateToLesson(moduleIndex, lessonIndex - 1);
    } else if (moduleIndex > 0) {
      const prevMod = modules[moduleIndex - 1];
      const lastLesson = (prevMod?.lessons?.length ?? 1) - 1;
      navigateToLesson(moduleIndex - 1, lastLesson);
    }
  }, [moduleIndex, lessonIndex, modules, navigateToLesson]);

  const nextLesson = useCallback(() => {
    const lessonsInModule = currentModule?.lessons?.length ?? 0;
    if (lessonIndex < lessonsInModule - 1) {
      navigateToLesson(moduleIndex, lessonIndex + 1);
    } else {
      const allCompleted =
        progressData?.lessons?.filter((p) => p.moduleIndex === moduleIndex && p.status === 'completed').length ===
        lessonsInModule;

      if (allCompleted) {
        router.push(`/course/${courseId}/quiz/${moduleIndex}`);
      } else if (moduleIndex < modules.length - 1) {
        navigateToLesson(moduleIndex + 1, 0);
      }
    }
  }, [moduleIndex, lessonIndex, currentModule, modules, navigateToLesson, progressData, courseId, router]);

  const hasPrev = moduleIndex > 0 || lessonIndex > 0;
  const hasNext = moduleIndex < modules.length - 1 || lessonIndex < (currentModule?.lessons?.length ?? 0) - 1;

  // ── Close overlays on backdrop click ──────────────────

  const closeOverlays = useCallback(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
      setChatOpen(false);
    }
  }, [isDesktop]);

  // ── Auto-track progress ───────────────────────────────

  const timeRef = useRef(0);

  useEffect(() => {
    upsertLessonProgress(courseId, moduleIndex, lessonIndex, { status: 'in_progress' }).catch(() => {});

    timeRef.current = 0;
    const interval = setInterval(() => {
      timeRef.current += 30;
      upsertLessonProgress(courseId, moduleIndex, lessonIndex, { timeSpentDelta: 30 }).catch(() => {});
    }, 30_000);

    const sendBeacon = () => {
      const remaining = 30 - (timeRef.current % 30 || 30);
      if (remaining > 0 && remaining < 30) {
        const token = getAuthToken();
        const url = `${NEXT_PUBLIC_API_URL}/api/course/${courseId}/progress/${moduleIndex}/${lessonIndex}`;
        const body = JSON.stringify({ timeSpentDelta: remaining });
        const blob = new Blob([body], { type: 'application/json' });
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', sendBeacon);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', sendBeacon);
      sendBeacon();
    };
  }, [courseId, moduleIndex, lessonIndex]);

  // ── Loading / not found ───────────────────────────────

  if (isLoading) {
    return (
      <S.Layout>
        <S.ContentSlot>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              opacity: 0.5,
            }}
          >
            Loading...
          </div>
        </S.ContentSlot>
      </S.Layout>
    );
  }

  if (!course || !currentModule || !currentLesson) {
    return (
      <S.Layout>
        <S.ContentSlot>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              opacity: 0.5,
            }}
          >
            Lesson not found.
          </div>
        </S.ContentSlot>
      </S.Layout>
    );
  }

  const showBackdrop = !isDesktop && (sidebarOpen || chatOpen);

  return (
    <S.Layout>
      {/* Mobile top bar */}
      <S.TopBar>
        <S.IconButton onClick={() => setSidebarOpen(true)} aria-label="Open course navigation">
          <Menu size={18} />
        </S.IconButton>
        <S.TopBarTitle>{currentLesson.name}</S.TopBarTitle>
        <S.IconButton onClick={() => setChatOpen(true)} aria-label="Open AI chat">
          <MessageCircle size={18} />
        </S.IconButton>
      </S.TopBar>

      {/* Backdrop for mobile overlays */}
      {showBackdrop && <S.Backdrop onClick={closeOverlays} />}

      {/* Left sidebar */}
      <S.SidebarSlot $open={sidebarOpen}>
        <CourseSidebar
          courseId={courseId}
          courseName={course.name}
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
      <S.ContentSlot>
        <LessonContent
          courseId={courseId}
          moduleName={currentModule.name}
          moduleIndex={moduleIndex}
          lessonIndex={lessonIndex}
          lesson={currentLesson}
          modules={modules}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={prevLesson}
          onNext={nextLesson}
          onOpenSidebar={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          isGenerationRunning={!!course.activeJobId}
          progressData={progressData ?? undefined}
        />
      </S.ContentSlot>

      {/* Right chat panel */}
      <S.ChatSlot $open={chatOpen}>
        <ChatPanel lessonName={currentLesson.name} onClose={() => setChatOpen(false)} />
      </S.ChatSlot>

      {/* Desktop floating chat toggle */}
      {!chatOpen && (
        <S.ChatToggle onClick={() => setChatOpen(true)} aria-label="Open AI chat">
          <MessageCircle size={22} />
        </S.ChatToggle>
      )}
    </S.Layout>
  );
};
