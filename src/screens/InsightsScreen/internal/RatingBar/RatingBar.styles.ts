import styled from 'styled-components';
import type { InsightRating } from '@/api/types';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const colorForRating = ({
  rating,
  colors,
}: {
  rating: InsightRating;
  colors: { error: string; warning: string; accent: string; success: string };
}) => {
  switch (rating) {
    case 1: return colors.error;
    case 2: return colors.warning;
    case 3: return colors.accent;
    case 4: return colors.success;
  }
};

export const RateButton = styled.button<{ $rating: InsightRating }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  border: 1px solid ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })}55;
  background: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })}10;
  color: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })};
  font-family: inherit;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s;

  &:hover {
    background: ${(p) => colorForRating({ rating: p.$rating, colors: p.theme.colors })}22;
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
  font-size: 0.9375rem;
  font-weight: 700;
`;

export const RateHint = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  opacity: 0.7;
`;
