import styled from 'styled-components';

/** Recall card uses a non-pill trend label (it carries longer text like
 *  "+24% vs last week") so it stays as a plain colored line. The chip is
 *  reserved for shorter percentage-only labels on other widgets. */
export const TrendLabel = styled.span<{ $positive: boolean; $neutral: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => {
    if (p.$neutral) return p.theme.colors.muted;
    return p.$positive ? p.theme.colors.success : p.theme.colors.error;
  }};
  font-variant-numeric: tabular-nums;
`;

// ── Stats tiles ────────────────────────────────────

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const StatTile = styled.div<{ $urgent?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
  padding: 0.6875rem 0.9375rem;
  border-radius: var(--radius-lg);
  background: ${(p) =>
    p.$urgent
      ? `color-mix(in oklab, ${p.theme.colors.warning} 8%, transparent)`
      : `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 50%, transparent)`};
  border: 1px solid
    ${(p) =>
      p.$urgent
        ? `color-mix(in oklab, ${p.theme.colors.warning} 30%, transparent)`
        : 'transparent'};
`;

export const StatValue = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
`;

export const StatLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
`;

// ── Chart ──────────────────────────────────────────

export const ChartWrap = styled.div`
  margin-bottom: 1rem;
`;

export const ChartLabel = styled.span`
  display: block;
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.375rem;
`;

/** Inline 2-series legend below the chart. The Highcharts legend is
 *  disabled because it doesn't compose with the dual-y-axis combo
 *  cleanly — we render our own muted strip so the user knows which
 *  visual represents what (rating-tinted columns vs the dark spline). */
export const ChartLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.5rem;
  padding-left: 0.125rem;
  font-size: 0.625rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
  letter-spacing: 0.005em;
`;

export const ChartLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
`;

export const ChartLegendSwatch = styled.span<{ $shape: 'square' | 'line' | 'gradient' }>`
  flex-shrink: 0;
  ${(p) =>
    p.$shape === 'gradient'
      ? `
        width: 18px;
        height: 8px;
        border-radius: 2px;
        background: linear-gradient(
          90deg,
          ${p.theme.colors.error} 0%,
          ${p.theme.colors.warning} 35%,
          ${p.theme.colors.accent} 70%,
          ${p.theme.colors.success} 100%
        );
      `
      : p.$shape === 'line'
        ? `
          width: 14px;
          height: 0;
          border-top: 2px solid ${p.theme.colors.foreground};
        `
        : `
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: ${p.theme.colors.muted};
        `}
`;

// ── Leitner distribution (demoted to footer strip) ─

export const BarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const BarLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const BarSegment = styled.div<{ $pct: number; $color: string }>`
  flex-basis: ${(p) => p.$pct}%;
  background: ${(p) => p.$color};
  min-width: ${(p) => (p.$pct > 0 ? '3px' : '0')};
  transition: flex-basis 0.3s ease;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.125rem;
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const Swatch = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

// Empty state primitives now come from `_shared/styles.ts` (re-exported
// at the top of this file). The previous icon-led empty state has been
// replaced with the editorial gold-rule + italic-serif pattern used
// across /recall, /quizzes, and the QuizScoreTrend widget here.
