'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import * as S from './HandoffButton.styles';

/**
 * The shape of a successful `emit_handoff` tool result. The server-side
 * tool returns either `{ ok: true, target, ... }` or `{ ok: false,
 * error, message }`. Failures don't render — the agent self-corrects on
 * the next iteration.
 */
export interface HandoffSuccess {
  ok: true;
  target: 'quiz' | 'recall' | 'lesson';
  moduleIndex?: number;
  lessonIndex?: number;
  label: string;
}

interface HandoffButtonProps {
  payload: HandoffSuccess;
  /**
   * Course slug from the surrounding ChatPanel. Passed through Chat →
   * ChatMessage → here. When absent (e.g. if a future surface uses
   * `<Chat>` without a course context), the button can't navigate to
   * lesson/quiz routes — caller should not render in that case.
   */
  courseSlug: string;
}

/**
 * Inline navigation button rendered under an assistant message when the
 * agent emits a structured hand-off (instead of telling the learner
 * "go to module X" in plain text). Click → route push to the relevant
 * Strive surface.
 *
 * Stale links are intentionally tolerated: if the learner clicks
 * "Take the module 2 quiz" but completed it in another tab a moment
 * ago, the navigation succeeds and the destination handles its own
 * state (review mode vs first-attempt). No special re-validation
 * happens client-side.
 */
export const HandoffButton = ({ payload, courseSlug }: HandoffButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    const href = resolveHref({ payload, courseSlug });
    if (!href) return;
    router.push(href);
  };

  // Build a useful aria-label that captures both the visible label
  // ("Take the module 2 quiz") and the destination class ("opens
  // module quiz") so screen readers convey both.
  const targetDescription = describeTarget(payload.target);

  return (
    <S.HandoffButton
      type="button"
      onClick={handleClick}
      aria-label={`${payload.label} — opens ${targetDescription}`}
      title={payload.label}
    >
      <S.HandoffLabel>{payload.label}</S.HandoffLabel>
      <ArrowRight size={14} />
    </S.HandoffButton>
  );
};

const describeTarget = (target: HandoffSuccess['target']): string => {
  switch (target) {
    case 'quiz':
      return 'the module quiz';
    case 'recall':
      return 'your recall practice queue';
    case 'lesson':
      return 'the lesson';
  }
};

/**
 * Resolve the click destination. Defensive: returns null when the
 * payload is missing required indices so we don't navigate to a
 * malformed URL. (Server-side validation should already have rejected
 * those, but the client checks again as a belt-and-braces.)
 */
const resolveHref = ({
  payload,
  courseSlug,
}: {
  payload: HandoffSuccess;
  courseSlug: string;
}): string | null => {
  if (payload.target === 'recall') {
    return ROUTES.recall();
  }
  if (payload.target === 'quiz') {
    if (payload.moduleIndex === undefined) return null;
    // ROUTES.moduleQuiz expects (slugOrId, fallbackId, moduleIndex). Both
    // first args are courseSlug — the slug is what the URL uses; the
    // fallback only matters when slugOrId is nullish, which it isn't.
    return ROUTES.moduleQuiz(courseSlug, courseSlug, payload.moduleIndex);
  }
  if (payload.target === 'lesson') {
    if (payload.moduleIndex === undefined || payload.lessonIndex === undefined) return null;
    return ROUTES.lesson(courseSlug, courseSlug, payload.moduleIndex, payload.lessonIndex);
  }
  return null;
};
