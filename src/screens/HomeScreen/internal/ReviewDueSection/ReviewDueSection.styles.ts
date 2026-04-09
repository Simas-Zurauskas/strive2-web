import styled from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';

export const Container = styled.div`
  display: flex;
  align-items: stretch;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

export const Accent = styled.div`
  width: 4px;
  background: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
`;

export const Label = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.warning};
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const ReviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.background};
  }
`;

export const ReviewItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CourseName = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  display: block;
`;

export const ModuleName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TierBadge = styled.span<{ $tier: QuizMasteryTier }>`
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
  background: ${(p) =>
    p.$tier === 'mastered'
      ? `${p.theme.colors.success}20`
      : p.$tier === 'passed'
        ? `${p.theme.colors.accent}20`
        : `${p.theme.colors.error}20`};
  color: ${(p) =>
    p.$tier === 'mastered'
      ? p.theme.colors.success
      : p.$tier === 'passed'
        ? p.theme.colors.accent
        : p.theme.colors.error};
`;

export const ReviewButton = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;
  white-space: nowrap;
`;
