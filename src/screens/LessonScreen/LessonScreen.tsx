'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { upsertLessonProgress } from '@/api/routes/course';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { getAuthToken } from '@/api/client';
import { useCourse, useCourseProgress, useGeneratedLessons } from '@/hooks';
import { CourseSidebar, ChatPanel, LessonContent } from './internal';
import * as S from './LessonScreen.styles';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // On desktop, sidebar open by default
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const modules = course?.structure?.modules ?? [];
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
      // End of module — check if all lessons are completed to navigate to quiz
      const allCompleted = progressData?.lessons?.filter(
        (p) => p.moduleIndex === moduleIndex && p.status === 'completed',
      ).length === lessonsInModule;

      if (allCompleted) {
        router.push(`/course/${courseId}/quiz/${moduleIndex}`);
      } else if (moduleIndex < modules.length - 1) {
        navigateToLesson(moduleIndex + 1, 0);
      }
    }
  }, [moduleIndex, lessonIndex, currentModule, modules, navigateToLesson, progressData, courseId, router]);

  const hasPrev = moduleIndex > 0 || lessonIndex > 0;
  const hasNext =
    moduleIndex < modules.length - 1 ||
    lessonIndex < (currentModule?.lessons?.length ?? 0) - 1;

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
    // Mark lesson as in_progress on open
    upsertLessonProgress(courseId, moduleIndex, lessonIndex, { status: 'in_progress' }).catch(() => {});

    // Track time spent with 30s heartbeats
    timeRef.current = 0;
    const interval = setInterval(() => {
      timeRef.current += 30;
      upsertLessonProgress(courseId, moduleIndex, lessonIndex, { timeSpentDelta: 30 }).catch(() => {});
    }, 30_000);

    // Send remaining time on unmount via beacon
    const sendBeacon = () => {
      const remaining = 30 - (timeRef.current % 30 || 30);
      if (remaining > 0 && remaining < 30) {
        const token = getAuthToken();
        const url = `${NEXT_PUBLIC_API_URL}/api/course/${courseId}/progress/${moduleIndex}/${lessonIndex}`;
        const body = JSON.stringify({ timeSpentDelta: remaining });
        const blob = new Blob([body], { type: 'application/json' });
        // sendBeacon doesn't support auth headers — fallback to fetch keepalive
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.5 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.5 }}>
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
          &#9776;
        </S.IconButton>
        <S.TopBarTitle>{currentLesson.name}</S.TopBarTitle>
        <S.IconButton onClick={() => setChatOpen(true)} aria-label="Open AI chat">
          &#128172;
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
        <ChatPanel
          lessonName={currentLesson.name}
          onClose={() => setChatOpen(false)}
        />
      </S.ChatSlot>

      {/* Desktop floating chat toggle */}
      {!chatOpen && (
        <S.ChatToggle onClick={() => setChatOpen(true)} aria-label="Open AI chat">
          &#128172;
        </S.ChatToggle>
      )}
    </S.Layout>
  );
};
