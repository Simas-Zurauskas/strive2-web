'use client';

import { Check, Circle, Minus } from 'lucide-react';
import * as S from './LessonIndicator.styles';
import type { LessonProgressStatus } from '@/api/types';

// LessonProgressStatus is 'not_started' | 'in_progress' | 'completed' from
// the OpenAPI schema. Re-export this loosened type so callers reading raw
// strings out of a `Map<string, string>` can pass them in without casting.
export type LessonProgressStatusOrString = LessonProgressStatus | string | undefined;

// ── State ─────────────────────────────────────────────

// Priority order matters: generating wins over any other state, because a
// lesson being regenerated is neither "complete" nor "in_progress" from the
// learner's perspective — the live-gen UI should take precedence.
export type LessonIndicatorState =
  | 'generating' // agent is running for this lesson right now
  | 'completed'  // learner marked complete
  | 'in_progress' // learner started but didn't complete, content exists
  | 'ready'      // content generated, not yet started
  | 'locked';    // no content yet (default lesson stub)

interface ComputeArgs {
  moduleIndex: number;
  lessonIndex: number;
  activeLesson: { moduleIndex: number; lessonIndex: number } | null | undefined;
  progressStatus: LessonProgressStatusOrString;
  isGenerated: boolean;
}

export const computeLessonIndicatorState = ({
  moduleIndex,
  lessonIndex,
  activeLesson,
  progressStatus,
  isGenerated,
}: ComputeArgs): LessonIndicatorState => {
  if (activeLesson?.moduleIndex === moduleIndex && activeLesson.lessonIndex === lessonIndex) {
    return 'generating';
  }
  if (progressStatus === 'completed') return 'completed';
  if (progressStatus === 'in_progress' && isGenerated) return 'in_progress';
  if (isGenerated) return 'ready';
  return 'locked';
};

// ── Component ─────────────────────────────────────────

interface LessonIndicatorProps {
  state: LessonIndicatorState;
  // Two scale presets so the same component can render cleanly in dense
  // sidebar lists and in the roomier course-overview grid without each
  // caller passing raw pixel sizes. 'sm' matches CourseSidebar's old
  // inline icons (12 / 6); 'md' matches CourseOverviewScreen's (14 / 6).
  size?: 'sm' | 'md';
}

export const LessonIndicator = ({ state, size = 'sm' }: LessonIndicatorProps) => {
  const iconSize = size === 'md' ? 14 : 12;
  const circleSize = 6;

  return (
    <S.Wrapper $state={state}>
      {state === 'completed' ? (
        <Check size={iconSize} strokeWidth={3} />
      ) : state === 'in_progress' ? (
        <Minus size={iconSize} strokeWidth={2.5} />
      ) : state === 'generating' ? (
        <S.Pulse>
          <Circle size={circleSize} fill="currentColor" />
        </S.Pulse>
      ) : (
        <Circle size={circleSize} />
      )}
    </S.Wrapper>
  );
};
