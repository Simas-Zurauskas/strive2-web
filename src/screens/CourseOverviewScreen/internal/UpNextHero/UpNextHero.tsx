'use client';

import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCourseContext } from '@/screens/CourseShell';
import * as S from './UpNextHero.styles';

const padTwo = (n: number) => (n + 1).toString().padStart(2, '0');

/**
 * UpNextHero — the always-visible directional anchor on a course overview.
 *
 * Replaces the conditional "Continue learning" tile that only rendered when
 * percentage > 0. Five copy/CTA states keyed off `useCourseNextAction`:
 *
 *   start    → fresh course, never opened a lesson
 *   resume   → an in_progress lesson exists; pick up exactly where left off
 *   next     → finished what they last opened; the next uncompleted lesson
 *   quiz     → all lessons done, at least one quiz unattempted/needs review
 *   complete → everything is done — soft celebratory state
 *
 * Renders nothing when:
 *   - course/modules haven't loaded (parent hasn't computed nextAction yet)
 */
export const UpNextHero = () => {
  const router = useRouter();
  const { courseBasePath, modules, navigateToLesson, nextAction } = useCourseContext();

  if (!nextAction) return null;

  const moduleNumberLabel = `Module ${padTwo(nextAction.moduleIndex)}`;
  const moduleLessonCount = modules[nextAction.moduleIndex]?.lessons?.length ?? 0;

  // ── Per-state copy + CTA ────────────────────────────────────────
  if (nextAction.kind === 'complete') {
    return (
      <S.Container>
        <S.AccentRail $variant="complete" aria-hidden />
        <S.Body>
          <S.Eyebrow>Course complete</S.Eyebrow>
          <S.Title>Nicely done.</S.Title>
          <S.Subhead>
            Every lesson finished. Drop into recall to keep what you&rsquo;ve learned, or jump back into any lesson to refresh.
          </S.Subhead>
          <S.ActionsRow>
            <S.PrimaryCta onClick={() => router.push('/recall')} type="button">
              Open recall
              <ArrowRight size={15} aria-hidden />
            </S.PrimaryCta>
          </S.ActionsRow>
        </S.Body>
      </S.Container>
    );
  }

  if (nextAction.kind === 'quiz') {
    return (
      <S.Container>
        <S.AccentRail $variant="quiz" aria-hidden />
        <S.Body>
          <S.Eyebrow>One step left</S.Eyebrow>
          <S.Title>{nextAction.moduleName} quiz</S.Title>
          <S.Subhead>
            All lessons in {moduleNumberLabel} are done. Take the quiz to lock it in.
          </S.Subhead>
          <S.ActionsRow>
            <S.PrimaryCta
              onClick={() => router.push(`${courseBasePath}/quiz/${nextAction.moduleIndex}`)}
              type="button"
            >
              Take the module quiz
              <ArrowRight size={15} aria-hidden />
            </S.PrimaryCta>
          </S.ActionsRow>
        </S.Body>
      </S.Container>
    );
  }

  // start | resume | next — all point at a specific lesson.
  const { moduleIndex, lessonIndex, lessonName } = nextAction;
  if (lessonIndex === undefined) return null;

  const eyebrow =
    nextAction.kind === 'start'
      ? 'Start here'
      : nextAction.kind === 'resume'
        ? 'Pick up where you left off'
        : 'Up next';

  const subheadCore =
    nextAction.kind === 'start'
      ? `${moduleNumberLabel} · Lesson ${padTwo(lessonIndex)} of ${moduleLessonCount}`
      : nextAction.kind === 'resume'
        ? `${moduleNumberLabel} · in progress`
        : `${moduleNumberLabel} · ready to start`;

  const ctaLabel =
    nextAction.kind === 'start'
      ? 'Create your first lesson'
      : nextAction.kind === 'resume'
        ? 'Resume lesson'
        : 'Continue';

  return (
    <S.Container>
      <S.AccentRail $variant="lesson" aria-hidden />
      <S.Body>
        <S.Eyebrow>
          {nextAction.kind === 'start' ? (
            <>
              <Sparkles size={11} style={{ verticalAlign: '-1px', marginRight: '0.375rem' }} aria-hidden />
              {eyebrow}
            </>
          ) : nextAction.kind === 'resume' ? (
            eyebrow
          ) : (
            <>
              <CheckCircle2 size={11} style={{ verticalAlign: '-1px', marginRight: '0.375rem' }} aria-hidden />
              {eyebrow}
            </>
          )}
        </S.Eyebrow>
        <S.Title>{lessonName}</S.Title>
        <S.Subhead>{subheadCore}</S.Subhead>
        <S.ActionsRow>
          <S.PrimaryCta
            type="button"
            onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
          >
            {ctaLabel}
            <ArrowRight size={15} aria-hidden />
          </S.PrimaryCta>
        </S.ActionsRow>
      </S.Body>
    </S.Container>
  );
};
