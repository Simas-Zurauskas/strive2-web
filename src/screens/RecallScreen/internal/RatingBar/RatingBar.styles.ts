import styled from 'styled-components';
import type { RecallRating } from '@/api/types';

/**
 * Four-up rating row, but split visually as "1 (Again) + 3 (Hard/Good/
 * Easy)" because Again belongs in a different category ("I missed it")
 * from the quality scale ("how well did I recall it"). The wider gap
 * before Hard is the only signal — labels stay aligned with the
 * recall-ratings explainer modal.
 */
export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;

  /* Extra gap before Hard so Again reads as its own column. */
  & > button:nth-child(2) {
    margin-left: 0.375rem;
  }

  ${(p) => p.theme.media.tablet} {
    gap: 0.3125rem;

    & > button:nth-child(2) {
      margin-left: 0.1875rem;
    }
  }

  ${(p) => p.theme.media.mobile} {
    gap: 0.25rem;

    & > button:nth-child(2) {
      margin-left: 0.125rem;
    }
  }
`;

const colorForRating = ({
  rating,
  colors,
}: {
  rating: RecallRating;
  colors: { error: string; warning: string; accent: string; success: string };
}) => {
  switch (rating) {
    case 1:
      return colors.error;
    case 2:
      return colors.warning;
    case 3:
      return colors.accent;
    case 4:
      return colors.success;
  }
};

/**
 * Ghost-outlined rating button. Background is surface-tone; the rating
 * color lives in a thin top stripe and the label. Reads as four quiet
 * options rather than four competing CTAs.
 */
export const RateButton = styled.button<{ $rating: RecallRating }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1875rem;
  padding: 0.875rem 0.5rem 0.6875rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })};
  font-family: inherit;
  cursor: pointer;
  min-height: 58px;
  overflow: hidden;
  transition:
    transform 0.1s ease,
    background 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;

  ${(p) => p.theme.media.tablet} {
    padding: 0.75rem 0.25rem 0.625rem;
    gap: 0.125rem;
    min-height: 56px;
  }

  ${(p) => p.theme.media.mobile} {
    padding: 0.6875rem 0.1875rem 0.5625rem;
    min-height: 52px;
  }

  /* Thin top stripe carries the rating colour — quieter than a full
     tinted background but still scannable. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(p) =>
      `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 70%, transparent)`};
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) =>
        `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 6%, ${p.theme.colors.surface})`};
      border-color: ${(p) =>
        `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 45%, ${p.theme.colors.surfaceBorder})`};

      &::before {
        background: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })};
      }
    }
  }

  &:active {
    transform: scale(0.985);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px
      ${(p) =>
        `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 28%, transparent)`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`;

/** Tiny 1/2/3/4 keycap in the top-right corner — restrained, in muted
 *  tone so it doesn't fight the label. Hidden on touch widths. */
export const RateKey = styled.span`
  position: absolute;
  top: 0.4375rem;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0.875rem;
  height: 0.875rem;
  padding: 0 0.1875rem;
  border-radius: var(--radius-sm);
  font-size: 0.5625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.6;
  line-height: 1;

  ${(p) => p.theme.media.tablet} {
    display: none;
  }
`;

export const RateLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.005em;

  ${(p) => p.theme.media.tablet} {
    font-size: 0.875rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 0.8125rem;
  }
`;

export const RateHint = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.85;
  white-space: nowrap;

  ${(p) => p.theme.media.mobile} {
    font-size: 0.625rem;
    letter-spacing: 0.01em;
  }
`;
