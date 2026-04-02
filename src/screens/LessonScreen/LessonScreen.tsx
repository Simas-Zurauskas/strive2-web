'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCourse } from '@/hooks';
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
    } else if (moduleIndex < modules.length - 1) {
      navigateToLesson(moduleIndex + 1, 0);
    }
  }, [moduleIndex, lessonIndex, currentModule, modules, navigateToLesson]);

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
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={prevLesson}
          onNext={nextLesson}
          onOpenSidebar={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          isGenerationRunning={!!course.activeJobId}
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
