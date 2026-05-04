import styled from 'styled-components';
import type { RecallRating } from '@/api/types';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
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

export const RateButton = styled.button<{ $rating: RecallRating }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1875rem;
  padding: 0.6875rem 0.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) =>
      `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 32%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 8%, transparent)`};
  color: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })};
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: ${(p) =>
      `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 16%, transparent)`};
    border-color: ${(p) =>
      `color-mix(in oklab, ${colorForRating({ rating: p.$rating, colors: p.theme.colors })} 50%, transparent)`};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`;

export const RateLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.005em;
`;

export const RateHint = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
`;
