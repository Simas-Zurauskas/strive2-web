'use client';

import { useEffect } from 'react';
import * as S from './RatingBar.styles';
import type { RecallRating } from '@/api/types';

// Mirror api/src/lib/recallConstants.ts — Leitner v0 intervals (days)
// keyed by box. Inline so the rating bar can name the consequence of
// each choice without roundtripping. If the table ever changes, this
// must change with it.
const LEITNER_BOX_INTERVAL_DAYS: Record<number, number> = {
  0: 1,
  1: 3,
  2: 7,
  3: 14,
  4: 30,
};

const MAX_BOX = 4;

const formatDays = (d: number): string => {
  if (d < 1) return '< 1d';
  if (d === 1) return '1 day';
  if (d < 30) return `${d} days`;
  if (d === 30) return '1 month';
  return `${Math.round(d / 30)} months`;
};

interface RatingBarProps {
  /** Current Leitner box of the card. Used to project the next interval per rating. */
  box: number;
  onRate: (rating: RecallRating) => void;
  disabled?: boolean;
}

interface RatingDef {
  rating: RecallRating;
  label: string;
  key: string;
  /**
   * Days until next review *if* the user picks this rating from `box`.
   * `null` for Again — Again no longer schedules a "next review" in a
   * meaningful sense; the card re-enters the current session via the
   * in-session retry queue. The 1-day reschedule on the backend is a
   * fallback for the close-the-tab case, not the dominant behavior.
   */
  intervalDays: ((box: number) => number) | null;
}

// Mirrors api/src/services/recallSchedulerService.ts mapping:
//   1 (Again): cycles back in-session (client-side retry queue).
//              Backend still records lapse + nextDue=now+1d as a
//              fallback for the close-the-tab case.
//   2 (Hard):  box stays → current box interval
//   3 (Good):  box + 1 (capped) → next box interval
//   4 (Easy):  box + 2 (capped) → two-up box interval
const RATINGS: RatingDef[] = [
  {
    rating: 1,
    label: 'Again',
    key: '1',
    intervalDays: null,
  },
  {
    rating: 2,
    label: 'Hard',
    key: '2',
    intervalDays: (box) =>
      LEITNER_BOX_INTERVAL_DAYS[Math.max(0, Math.min(MAX_BOX, box))] ?? LEITNER_BOX_INTERVAL_DAYS[0],
  },
  {
    rating: 3,
    label: 'Good',
    key: '3',
    intervalDays: (box) =>
      LEITNER_BOX_INTERVAL_DAYS[Math.min(MAX_BOX, Math.max(0, box) + 1)] ??
      LEITNER_BOX_INTERVAL_DAYS[MAX_BOX],
  },
  {
    rating: 4,
    label: 'Easy',
    key: '4',
    intervalDays: (box) =>
      LEITNER_BOX_INTERVAL_DAYS[Math.min(MAX_BOX, Math.max(0, box) + 2)] ??
      LEITNER_BOX_INTERVAL_DAYS[MAX_BOX],
  },
];

/**
 * Four-button rating bar — same Again/Hard/Good/Easy semantics taught by
 * the `recall-ratings` concept modal, so the UI and the explainer agree.
 *
 * Improvement over the previous version: each button shows the *actual*
 * next-review interval projected from the card's current box, instead of
 * abstract fixed hints like "< 1m". That makes the consequence of each
 * choice legible without Anki literacy.
 *
 * Keyboard: 1/2/3/4 maps to Again/Hard/Good/Easy.
 */
export const RatingBar = ({ box, onRate, disabled }: RatingBarProps) => {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      )
        return;
      const match = RATINGS.find((r) => r.key === e.key);
      if (match) {
        e.preventDefault();
        onRate(match.rating);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRate, disabled]);

  return (
    <S.Container role="group" aria-label="Rate how well you recalled this">
      {RATINGS.map((r) => {
        const isAgain = r.intervalDays === null;
        const hint = isAgain ? null : formatDays(r.intervalDays!(box));
        return (
          <S.RateButton
            key={r.rating}
            $rating={r.rating}
            disabled={disabled}
            onClick={() => onRate(r.rating)}
            aria-label={
              isAgain
                ? 'Again — retry this card in the current session'
                : `${r.label} — next review in ${hint}`
            }
            title={`${r.label} (${r.key})`}
          >
            <S.RateKey>{r.key}</S.RateKey>
            <S.RateLabel>{r.label}</S.RateLabel>
            {isAgain ? (
              <S.RateHint>↻ retry</S.RateHint>
            ) : (
              <S.RateHint>→ {hint}</S.RateHint>
            )}
          </S.RateButton>
        );
      })}
    </S.Container>
  );
};
