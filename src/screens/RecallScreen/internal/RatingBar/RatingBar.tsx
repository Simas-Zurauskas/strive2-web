'use client';

import { useEffect } from 'react';
import * as S from './RatingBar.styles';
import type { RecallRating } from '@/api/types';

interface RatingBarProps {
  onRate: (rating: RecallRating) => void;
  disabled?: boolean;
}

const RATINGS: { rating: RecallRating; label: string; hint: string; key: string }[] = [
  { rating: 1, label: 'Again', hint: '< 1m', key: '1' },
  { rating: 2, label: 'Hard', hint: '3d', key: '2' },
  { rating: 3, label: 'Good', hint: '7d', key: '3' },
  { rating: 4, label: 'Easy', hint: '14d+', key: '4' },
];

export const RatingBar = ({ onRate, disabled }: RatingBarProps) => {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in input/textarea (typed-recall mode).
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

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
      {RATINGS.map((r) => (
        <S.RateButton
          key={r.rating}
          $rating={r.rating}
          disabled={disabled}
          onClick={() => onRate(r.rating)}
          aria-label={`${r.label} — next review in ${r.hint}`}
          title={`${r.label} (${r.key})`}
        >
          <S.RateLabel>{r.label}</S.RateLabel>
          <S.RateHint>{r.hint}</S.RateHint>
        </S.RateButton>
      ))}
    </S.Container>
  );
};
