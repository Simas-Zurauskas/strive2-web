'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { getAuthToken } from '@/api/client';
import { upsertLessonProgress } from '@/api/routes/course';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { ROUTES } from '@/constants/routes';
import { useCourseContext } from '@/screens/CourseShell';
import { analytics } from '@/lib/analytics';
import { QKeys } from '@/types';
import { LessonContent } from './internal';

export const LessonScreen = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { courseSlug, courseBasePath, course, modules, progressData, sidebarOpen, setSidebarOpen, navigateToLesson } =
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
  }, [moduleIndex, lessonIndex, currentModule, modules, navigateToLesson, progressData, courseBasePath, router]);

  const hasPrev = moduleIndex > 0 || lessonIndex > 0;
  const hasNext = moduleIndex < modules.length - 1 || lessonIndex < (currentModule?.lessons?.length ?? 0) - 1;

  const openModuleQuiz = useCallback(
    () => router.push(ROUTES.moduleQuiz(courseSlug, course?._id ?? '', moduleIndex)),
    [router, courseSlug, course?._id, moduleIndex],
  );

  // ── Auto-track progress ───────────────────────────────

  const timeRef = useRef(0);

  useEffect(() => {
    upsertLessonProgress({ courseId: courseSlug, moduleIndex, lessonIndex, data: { status: 'in_progress' } }).then(() => {
      queryClient.invalidateQueries({ queryKey: [QKeys.CONTINUE_LEARNING] });
      queryClient.invalidateQueries({ queryKey: [QKeys.PROGRESS_SUMMARY] });
    }).catch(() => {});

    // Mixpanel: lesson_opened. `is_first_view` is inferred at the server
    // side (status='in_progress' write only happens once for a brand-new
    // attempt — Mongo upserts do not distinguish create from update for us
    // here without a follow-up read). Approximated via the progressData
    // snapshot already in scope; cheaper + good enough for the funnel.
    const lessonProgress = progressData?.lessons?.find(
      (p) => p.moduleIndex === moduleIndex && p.lessonIndex === lessonIndex,
    );
    const isFirstView = !lessonProgress;
    analytics.track('lesson_opened', {
      course_id: course?._id,
      lesson_id: course?._id ? `${course._id}-${moduleIndex}-${lessonIndex}` : undefined,
      module_index: moduleIndex,
      lesson_index: lessonIndex,
      is_first_view: isFirstView,
    });

    timeRef.current = 0;
    const interval = setInterval(() => {
      timeRef.current += 30;
      upsertLessonProgress({ courseId: courseSlug, moduleIndex, lessonIndex, data: { timeSpentDelta: 30 } }).catch(() => {});
    }, 30_000);

    const sendBeacon = () => {
      const remaining = 30 - (timeRef.current % 30 || 30);
      if (remaining > 0 && remaining < 30) {
        const token = getAuthToken();
        const url = `${NEXT_PUBLIC_API_URL}/api/course/${courseSlug}/progress/${moduleIndex}/${lessonIndex}`;
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
  }, [courseSlug, moduleIndex, lessonIndex, queryClient]);

  // ── Not found ─────────────────────────────────────────

  const courseObjectId = course?._id;
  const isGenerationRunning = !!course?.activeJobId;

  // `course.activeLesson` is the authoritative source — it's stamped by
  // generateLessonController and cleared by the job runner's finally, so
  // it's correct the instant GET /course returns (including reload right
  // after clicking Generate, before any content has landed in the DB).
  // The WS `generatingLesson` state stays as a fast-path for sibling
  // features (e.g. dashboard list) but the viewer reads the course
  // field directly to avoid race gaps.
  const isThisLessonGenerating =
    course?.activeLesson?.moduleIndex === moduleIndex &&
    course?.activeLesson?.lessonIndex === lessonIndex;

  if (!currentModule || !currentLesson) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.5 }}>
        Lesson not found.
      </div>
    );
  }

  return (
    <LessonContent
      key={`${moduleIndex}-${lessonIndex}`}
      courseId={courseSlug}
      courseObjectId={courseObjectId}
      moduleName={currentModule.name}
      moduleIndex={moduleIndex}
      lessonIndex={lessonIndex}
      lesson={currentLesson}
      modules={modules}
      hasPrev={hasPrev}
      hasNext={hasNext}
      onPrev={prevLesson}
      onNext={nextLesson}
      onOpenQuiz={openModuleQuiz}
      onOpenSidebar={() => setSidebarOpen(true)}
      sidebarOpen={sidebarOpen}
      isGenerationRunning={isGenerationRunning}
      isThisLessonGenerating={isThisLessonGenerating}
      progressData={progressData}
    />
  );
};
