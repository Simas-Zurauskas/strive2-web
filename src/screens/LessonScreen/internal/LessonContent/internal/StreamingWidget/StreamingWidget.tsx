'use client';

import * as S from './StreamingWidget.styles';

export type StreamingPhase = 'streaming' | 'finishing';

interface Props {
  /** `streaming` — primary state while blocks are still arriving.
   *  `finishing` — quieter follow-up while the server wraps recall cards
   *  and metadata after the last block has rendered. */
  phase: StreamingPhase;
  className?: string;
}

const COPY: Record<StreamingPhase, { title: string; sub?: string }> = {
  streaming: {
    title: 'Creating your lesson',
    sub: 'Pulling together blocks, code, and recall cards.',
  },
  finishing: {
    title: 'Adding finishing touches',
  },
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
export const StreamingWidget = ({ phase, className }: Props) => {
  const finishing = phase === 'finishing';
  const copy = COPY[phase];

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
        <S.Title $finishing={finishing}>{copy.title}…</S.Title>
        {copy.sub && !finishing && <S.Sub>{copy.sub}</S.Sub>}
      </S.Body>
      <S.Sweep $finishing={finishing} aria-hidden />
    </S.Wrap>
  );
};
