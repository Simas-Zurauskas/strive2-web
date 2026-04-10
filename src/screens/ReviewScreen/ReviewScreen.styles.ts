import styled from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 0;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 0;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 4vh;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 0.75rem;
`;

export const EmptyTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ReviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
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
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ReviewReason = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  display: block;
  margin-top: 0.25rem;
`;

export const TierBadge = styled.span<{ $tier: QuizMasteryTier }>`
  padding: 0.25rem 0.625rem;
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
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.warning};
  flex-shrink: 0;
  white-space: nowrap;
`;
