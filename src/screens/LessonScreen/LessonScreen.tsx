'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { getAuthToken } from '@/api/client';
import { upsertLessonProgress } from '@/api/routes/course';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { useCourseContext } from '@/screens/CourseShell';
import { QKeys } from '@/types';
import { LessonContent } from './internal';

export const LessonScreen = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { courseId, courseBasePath, course, modules, progressData, sidebarOpen, setSidebarOpen, navigateToLesson } =
    useCourseContext();

  const moduleIndex = Number(params.moduleIndex);
  const lessonIndex = Number(params.lessonIndex);

  const currentModule = modules[moduleIndex];
  const currentLesson = currentModule?.lessons?.[lessonIndex];

  // ── Navigation helpers ────────────────────────────────

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
        router.push(`${courseBasePath}/quiz/${moduleIndex}`);
      } else if (moduleIndex < modules.length - 1) {
        navigateToLesson(moduleIndex + 1, 0);
      }
    }
  }, [moduleIndex, lessonIndex, currentModule, modules, navigateToLesson, progressData, courseId, router]);

  const hasPrev = moduleIndex > 0 || lessonIndex > 0;
  const hasNext = moduleIndex < modules.length - 1 || lessonIndex < (currentModule?.lessons?.length ?? 0) - 1;

  // ── Auto-track progress ───────────────────────────────

  const timeRef = useRef(0);

  useEffect(() => {
    upsertLessonProgress({ courseId, moduleIndex, lessonIndex, data: { status: 'in_progress' } }).then(() => {
      queryClient.invalidateQueries({ queryKey: [QKeys.CONTINUE_LEARNING] });
      queryClient.invalidateQueries({ queryKey: [QKeys.PROGRESS_SUMMARY] });
    }).catch(() => {});

    timeRef.current = 0;
    const interval = setInterval(() => {
      timeRef.current += 30;
      upsertLessonProgress({ courseId, moduleIndex, lessonIndex, data: { timeSpentDelta: 30 } }).catch(() => {});
    }, 30_000);

    const sendBeacon = () => {
      const remaining = 30 - (timeRef.current % 30 || 30);
      if (remaining > 0 && remaining < 30) {
        const token = getAuthToken();
        const url = `${NEXT_PUBLIC_API_URL}/api/course/${courseId}/progress/${moduleIndex}/${lessonIndex}`;
        const body = JSON.stringify({ timeSpentDelta: remaining });
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
  }, [courseId, moduleIndex, lessonIndex, queryClient]);

  // ── Not found ─────────────────────────────────────────

  if (!currentModule || !currentLesson) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.5 }}>
        Lesson not found.
      </div>
    );
  }

  return (
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
      isGenerationRunning={!!course?.activeJobId}
      progressData={progressData}
    />
  );
};
