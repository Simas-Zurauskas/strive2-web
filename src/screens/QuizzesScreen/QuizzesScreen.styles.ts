import styled from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';
import type { QuizIconVariant } from '@/types';

export const ContentWrap = styled.div`
  padding-top: 4vh;
`;

// ── Header ──────────────────────────────────────────

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

// ── Filter tabs ─────────────────────────────────────

export const FilterBar = styled.div`
  margin-bottom: 2rem;
`;

// ── Course cards ────────────────────────────────────

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CourseCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
`;

export const CourseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const CourseName = styled.span`
  flex: 1;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Quiz rows ───────────────────────────────────────

export const QuizRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition:
    background 0.15s,
    padding-left 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  &:hover {
    background: ${(p) => `${p.theme.colors.accent}06`};
    padding-left: calc(1.25rem + 4px);
  }
`;

// QuizzesScreen only surfaces post-attempt states, so it never emits 'locked',
// but types the prop with the shared superset so a future "locked course" filter
// doesn't require another definition.
const iconColor = (
  variant: QuizIconVariant,
  colors: { success: string; accent: string; error: string; tertiary: string; muted: string },
) => {
  switch (variant) {
    case 'mastered':
      return colors.success;
    case 'passed':
      return colors.accent;
    case 'needs_review':
      return colors.error;
    case 'locked':
      return colors.muted;
    default:
      return colors.tertiary;
  }
};

export const QuizIconWrap = styled.span<{ $variant: QuizIconVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => `${iconColor(p.$variant, p.theme.colors)}18`};
  color: ${(p) => iconColor(p.$variant, p.theme.colors)};
`;

export const QuizContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const QuizModuleName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  display: block;
  line-height: 1.4;
`;

export const QuizMeta = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  display: block;
  margin-top: 0.125rem;
`;

export const TierBadge = styled.span<{ $tier: QuizMasteryTier }>`
  padding: 0.1875rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
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

// ── Empty states ────────────────────────────────────

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
