import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const TrendLabel = styled.span<{ $positive: boolean; $neutral: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => {
    if (p.$neutral) return p.theme.colors.muted;
    return p.$positive ? p.theme.colors.success : p.theme.colors.error;
  }};
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
  gap: 0.25rem;
  padding: 0.625rem 0.875rem;
  border-radius: 10px;
  background: ${(p) => (p.$urgent ? `${p.theme.colors.warning}12` : p.theme.colors.surfaceBorder + '40')};
  border: 1px solid ${(p) => (p.$urgent ? `${p.theme.colors.warning}55` : 'transparent')};
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

// ── Empty state ────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  gap: 0.5rem;
`;

export const EmptyIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => `${p.theme.colors.accent}18`};
  color: ${(p) => p.theme.colors.accent};
`;

export const EmptyText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 40ch;
`;
