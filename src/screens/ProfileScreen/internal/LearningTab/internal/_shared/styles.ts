import styled from 'styled-components';

/**
 * Shared chrome for the four widget sections on the Profile / Learning tab
 * (XP chart, Activity heatmap, Quiz scores, Recall activity). Previously
 * each widget defined its own Section/Header/Title trio, which drifted
 * between widgets and hard-coded `12px` radii / `border` colour. Single
 * source means the tab reads as one cohesive surface.
 */

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1.125rem;
  }
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
`;

/** Section title — small uppercase eyebrow, matches the Eyebrow primitive
 *  used across /help and /quizzes for sub-sections. Gold tertiary tint
 *  keeps it consistent with the app's "scholarly" voice. */
export const SectionEyebrow = styled.h3`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin: 0;
`;

/** Right-aligned meta on the section header — date range, trend chip,
 *  active-day count, etc. Muted, small, never competes with the eyebrow. */
export const SectionMeta = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.005em;
  font-variant-numeric: tabular-nums;
`;

/** Trend chip — colored. Used for "+12% this month" on the quiz-score
 *  trend, "+24% vs last week" on the recall activity card, etc. Pill
 *  shape, hairline border, color-mix tint. */
export const TrendChip = styled.span<{ $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  border: 1px solid
    ${(p) =>
      p.$positive
        ? `color-mix(in oklab, ${p.theme.colors.success} 28%, transparent)`
        : `color-mix(in oklab, ${p.theme.colors.error} 28%, transparent)`};
  background: ${(p) =>
    p.$positive
      ? `color-mix(in oklab, ${p.theme.colors.success} 10%, transparent)`
      : `color-mix(in oklab, ${p.theme.colors.error} 10%, transparent)`};
  color: ${(p) => (p.$positive ? p.theme.colors.success : p.theme.colors.error)};
`;

/** Editorial empty-state block, mirrors the /recall empty-state pattern:
 *  gold rule → uppercase eyebrow → italic serif title → muted lead. */
export const EmptyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.75rem 1rem;
`;

export const EmptyRule = styled.span`
  display: block;
  width: 32px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.375rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyTitle = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.125rem 0 0;
`;

export const EmptyText = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 36ch;
`;
