'use client';

import * as S from './StreamingWidget.styles';

export type StreamingPhase = 'streaming' | 'finishing';

interface Props {
  /** `streaming` — primary state while blocks are still arriving.
   *  `finishing` — quieter follow-up while the server wraps recall cards
   *  and metadata after the last block has rendered. */
  phase: StreamingPhase;
  /** Optional flags so the sub-line names only the extras actually
   *  being generated. Default everything-on for back-compat with
   *  callers that don't know (e.g. reload-into-active-stream paths
   *  where the job's options aren't surfaced client-side). */
  includeImage?: boolean;
  includeLinks?: boolean;
  includeRecallCards?: boolean;
  className?: string;
}

/**
 * Compose the streaming sub-line. Lesson body + interactive code/
 * exercises always run, so they're always named. The three optional
 * extras (cover image, further reading, recall cards) get appended
 * only when their flag is on. Oxford comma in the joined list keeps
 * the cadence editorial.
 */
const buildStreamingSub = ({
  includeImage,
  includeLinks,
  includeRecallCards,
}: {
  includeImage: boolean;
  includeLinks: boolean;
  includeRecallCards: boolean;
}): string => {
  const extras: string[] = [];
  if (includeImage) extras.push('a cover image');
  if (includeLinks) extras.push('further reading');
  if (includeRecallCards) extras.push('recall cards to come back to');

  if (extras.length === 0) {
    return 'Drafting the prose, working the examples.';
  }
  if (extras.length === 1) {
    return `Drafting the prose, working the examples — and ${extras[0]}.`;
  }
  if (extras.length === 2) {
    return `Drafting the prose and examples — plus ${extras[0]} and ${extras[1]}.`;
  }
  // 3 extras: full editorial list with Oxford comma
  return `Drafting the prose and examples — plus ${extras[0]}, ${extras[1]}, and ${extras[2]}.`;
};

/**
 * Inline "lesson is generating" widget shown beneath the rendered blocks
 * while the lesson stream is in flight. Two phases:
 *
 *   - `streaming` — bordered card chrome with a three-dot wave, italic-serif
 *     title, supporting line, and a sweeping accent gradient at the bottom
 *     edge. Reads as the headline state of the screen.
 *   - `finishing` — same component, stripped of card chrome and the sweep,
 *     defers to the lesson content above (which is already complete) and
 *     just signals that a small post-stream pass is still running.
 *
 * `aria-live="polite"` so screen readers announce the phase change without
 * interrupting current speech. Decorative motion is `aria-hidden` and all
 * animations honor `prefers-reduced-motion: reduce`.
 */
export const StreamingWidget = ({
  phase,
  includeImage = true,
  includeLinks = true,
  includeRecallCards = true,
  className,
}: Props) => {
  const finishing = phase === 'finishing';
  const title = finishing ? 'Adding finishing touches' : 'Creating your lesson';
  const sub = finishing
    ? null
    : buildStreamingSub({ includeImage, includeLinks, includeRecallCards });

  return (
    <S.Wrap
      $finishing={finishing}
      className={className}
      role="status"
      aria-live="polite"
    >
      <S.IconStage aria-hidden>
        <S.Dot $i={0} $finishing={finishing} />
        <S.Dot $i={1} $finishing={finishing} />
        <S.Dot $i={2} $finishing={finishing} />
      </S.IconStage>
      <S.Body>
        <S.Title $finishing={finishing}>{title}…</S.Title>
        {sub && <S.Sub>{sub}</S.Sub>}
      </S.Body>
      <S.Sweep $finishing={finishing} aria-hidden />
    </S.Wrap>
  );
};
