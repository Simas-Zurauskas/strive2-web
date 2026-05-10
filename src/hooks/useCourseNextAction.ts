'use client';

import { useMemo } from 'react';
import type { CourseProgressResponse } from '@/api/routes/course';

export type CourseNextActionKind =
  | 'start' // Fresh course, no progress anywhere → first lesson of first module
  | 'resume' // There is at least one in_progress lesson → most-recently-touched
  | 'next' // Last touched is completed → first uncompleted lesson in order
  | 'quiz' // All lessons complete; at least one quiz unattempted or due
  | 'complete'; // Every lesson + quiz handled

export interface CourseNextAction {
  kind: CourseNextActionKind;
  moduleIndex: number;
  moduleName: string;
  // Defined for start | resume | next. Undefined for quiz | complete.
  lessonIndex?: number;
  lessonName?: string;
}

interface ModuleLike {
  name: string;
  lessons?: { name: string }[];
}

interface UseCourseNextActionArgs {
  modules: ModuleLike[];
  progressData: CourseProgressResponse | undefined;
}

/**
 * Decides the single most useful next action for a course.
 * Used by:
 *   - CourseShell to pick which module to expand by default per course.
 *   - CourseOverviewScreen's "Up next" hero CTA.
 *
 * Rule order (first match wins):
 *   1. resume — there's an in_progress lesson; point at the most recently touched one.
 *   2. start  — there is literally zero progress anywhere; point at M1L1.
 *   3. next   — some lessons completed; first uncompleted (in module/lesson order).
 *   4. quiz   — every lesson completed; first unattempted or review-due quiz.
 *   5. complete — everything is done.
 */
export const useCourseNextAction = ({
  modules,
  progressData,
}: UseCourseNextActionArgs): CourseNextAction | null => {
  return useMemo(() => {
    if (!modules.length) return null;

    const lessonProgress = progressData?.lessons ?? [];
    const quizProgress = progressData?.quizzes ?? [];

    const buildLessonAction = (
      kind: 'start' | 'resume' | 'next',
      mi: number,
      li: number,
    ): CourseNextAction | null => {
      const mod = modules[mi];
      const lesson = mod?.lessons?.[li];
      if (!mod || !lesson) return null;
      return {
        kind,
        moduleIndex: mi,
        lessonIndex: li,
        moduleName: mod.name,
        lessonName: lesson.name,
      };
    };

    // 1. resume: the most-recently-touched in_progress lesson
    const inProgress = lessonProgress
      .filter((p) => p.status === 'in_progress')
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
    if (inProgress.length > 0) {
      const t = inProgress[0];
      const action = buildLessonAction('resume', t.moduleIndex, t.lessonIndex);
      if (action) return action;
    }

    // Build a quick lookup for "is this lesson completed?"
    const completedSet = new Set<string>();
    for (const p of lessonProgress) {
      if (p.status === 'completed') completedSet.add(`${p.moduleIndex}-${p.lessonIndex}`);
    }

    // 2. start vs 3. next: first uncompleted lesson in order
    let firstUncompleted: { mi: number; li: number } | null = null;
    for (let mi = 0; mi < modules.length && !firstUncompleted; mi++) {
      const lessons = modules[mi]?.lessons ?? [];
      for (let li = 0; li < lessons.length; li++) {
        if (!completedSet.has(`${mi}-${li}`)) {
          firstUncompleted = { mi, li };
          break;
        }
      }
    }

    if (firstUncompleted) {
      const isStart = lessonProgress.length === 0;
      return buildLessonAction(isStart ? 'start' : 'next', firstUncompleted.mi, firstUncompleted.li);
    }

    // 4. quiz: every lesson done. Find first quiz that is unattempted or review-due.
    const quizByMi = new Map<number, (typeof quizProgress)[number]>();
    for (const q of quizProgress) quizByMi.set(q.moduleIndex, q);
    for (let mi = 0; mi < modules.length; mi++) {
      const lessons = modules[mi]?.lessons ?? [];
      if (lessons.length === 0) continue;
      const qp = quizByMi.get(mi);
      const unattempted = !qp;
      const reviewDue = !!qp?.reviewDue;
      if (unattempted || reviewDue) {
        const mod = modules[mi];
        if (!mod) continue;
        return {
          kind: 'quiz',
          moduleIndex: mi,
          moduleName: mod.name,
        };
      }
    }

    // 5. complete
    return {
      kind: 'complete',
      moduleIndex: modules.length - 1,
      moduleName: modules[modules.length - 1]?.name ?? '',
    };
  }, [modules, progressData]);
};
