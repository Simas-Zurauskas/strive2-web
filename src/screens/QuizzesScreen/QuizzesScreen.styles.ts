import styled from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';

export const ContentWrap = styled.div`
  padding-top: 4vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// ── Page hero ───────────────────────────────────────
// Mirrors the /help hub editorial hero — gold eyebrow + italic serif
// title (full sentence with period) + muted body-size subtitle that
// teaches what this page is about. Static copy, not a dynamic count;
// the filter pills below already surface counts.

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 0.5rem;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.625rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 2.75rem;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0 0 0.875rem 0;

  ${(p) => p.theme.media.tablet} {
    font-size: 2.125rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;
  max-width: 60ch;
`;

/** Scoring rule — shown once on the index instead of repeated on every
 *  quiz landing. Two small pills with the tier semantic colors so the
 *  badges throughout the app (passed = accent green, mastered = success
 *  green) are visually grounded the moment a learner lands here. */
export const ScoringLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
`;

export const ScoringLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  margin-right: 0.125rem;
`;

export const ScoringChip = styled.span<{ $tone: 'pass' | 'master' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.3125rem 0.625rem 0.3125rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid
    ${(p) =>
      p.$tone === 'master'
        ? `color-mix(in oklab, ${p.theme.colors.success} 30%, transparent)`
        : `color-mix(in oklab, ${p.theme.colors.accent} 30%, transparent)`};
  background: ${(p) =>
    p.$tone === 'master'
      ? `color-mix(in oklab, ${p.theme.colors.success} 10%, transparent)`
      : `color-mix(in oklab, ${p.theme.colors.accent} 10%, transparent)`};
  color: ${(p) => (p.$tone === 'master' ? p.theme.colors.success : p.theme.colors.accent)};
`;

export const ScoringDot = styled.span<{ $tone: 'pass' | 'master' }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => (p.$tone === 'master' ? p.theme.colors.success : p.theme.colors.accent)};
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
`;

// ── Course section ──────────────────────────────────

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const CourseSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CourseSectionHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CourseEyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.muted};
`;

/** Section heading — serif non-italic. Only the page title above is
 *  italic; making sub-sections italic too crowds the page (italic
 *  budget: one per screen — same convention as /help). */
export const CourseName = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

// ── Quiz rows ───────────────────────────────────────

/** Hairline-divided list. Top + between rows; no outer card chrome. */
export const QuizList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const QuizRow = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0.25rem 1rem 0;
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    padding-left 0.18s ease,
    background 0.18s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      padding-left: 0.5rem;
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 5%, transparent)`};
    }
  }
`;

export const QuizContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

/** Sans body, medium weight. Resists the italic-serif overuse that
 *  was happening when every level (page title, course header, row
 *  title) was italic — the eye had nowhere to rest. */
export const QuizModuleName = styled.span`
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
`;

export const QuizMeta = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

export const QuizStatus = styled.span<{ $tier?: QuizMasteryTier; $variant: 'tier' | 'review-due' | 'fresh' }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.3125rem 0.625rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid;
  border-color: ${(p) => {
    if (p.$variant === 'review-due') return `color-mix(in oklab, ${p.theme.colors.error} 30%, transparent)`;
    if (p.$variant === 'fresh') return `color-mix(in oklab, ${p.theme.colors.tertiary} 30%, transparent)`;
    if (p.$tier === 'mastered') return `color-mix(in oklab, ${p.theme.colors.success} 30%, transparent)`;
    if (p.$tier === 'passed') return `color-mix(in oklab, ${p.theme.colors.accent} 30%, transparent)`;
    return `color-mix(in oklab, ${p.theme.colors.error} 30%, transparent)`;
  }};
  background: ${(p) => {
    if (p.$variant === 'review-due') return `color-mix(in oklab, ${p.theme.colors.error} 8%, transparent)`;
    if (p.$variant === 'fresh') return p.theme.colors.tertiaryMuted;
    if (p.$tier === 'mastered') return `color-mix(in oklab, ${p.theme.colors.success} 10%, transparent)`;
    if (p.$tier === 'passed') return `color-mix(in oklab, ${p.theme.colors.accent} 10%, transparent)`;
    return `color-mix(in oklab, ${p.theme.colors.error} 10%, transparent)`;
  }};
  color: ${(p) => {
    if (p.$variant === 'review-due') return p.theme.colors.error;
    if (p.$variant === 'fresh') return p.theme.colors.tertiary;
    if (p.$tier === 'mastered') return p.theme.colors.success;
    if (p.$tier === 'passed') return p.theme.colors.accent;
    return p.theme.colors.error;
  }};
`;

/** Tiny coloured dot used inside the review-due chip — matches the
 *  pulse-dot semantic from TodayReview. */
export const StatusDot = styled.span<{ $tone: 'error' | 'tertiary' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => (p.$tone === 'error' ? p.theme.colors.error : p.theme.colors.tertiary)};
  flex-shrink: 0;
`;

export const QuizArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  transition:
    color 0.15s,
    transform 0.15s;

  ${(p) => p.theme.media.hover} {
    ${QuizRow}:hover & {
      color: ${(p) => p.theme.colors.tertiary};
      transform: translateX(3px);
    }
  }
`;

// ── Empty states ────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem 3.5rem;
  gap: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};
`;

export const EmptyPreviewSlot = styled.div`
  width: 100%;
  margin-bottom: 1.25rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyAction = styled.div`
  margin-top: 1rem;
`;

export const EmptyRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.25rem;
`;

/** Non-italic serif: the page header above already carries the single
 *  italic moment, two italic serif lines stacked feels crowded.
 *  Mirrors RecallScreen's empty title. */
export const EmptyTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.25rem 0 0;
`;

export const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 44ch;
  line-height: 1.6;
`;
