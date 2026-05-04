import styled from 'styled-components';

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

/** Slim stat card — tighter padding/gap so the row reads as a strip, not a wall.
 *  min-height locks the card to the tallest variant (Streak / Level have an
 *  extra Foot row + a thin progress bar) so the skeleton + the real grid
 *  always settle at the same height. Without it, content variation between
 *  the four cards causes a small shift when real data lands. */
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.125rem 1.25rem 1.25rem;
  min-height: 11.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  min-width: 0;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const Label = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Halo = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accentMuted};
  color: ${(p) => p.theme.colors.accent};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const HaloGold = styled(Halo)`
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
`;

export const BigNum = styled.div`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 2.375rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const Unit = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
`;

export const Foot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  margin-top: auto;
  min-height: 14px;
`;

export const FootDelta = styled.span<{ $positive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-weight: 500;
  color: ${(p) => (p.$positive ? p.theme.colors.success : p.theme.colors.muted)};
`;

// ── Sparkline (week stat card) ────────────────────────

export const Sparkline = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
`;

export const SparklineBar = styled.span<{ $height: number; $hi?: boolean }>`
  display: block;
  flex: 1;
  height: ${(p) => Math.max(8, Math.min(100, p.$height))}%;
  background: ${(p) => (p.$hi ? p.theme.colors.accent : p.theme.colors.accentMuted)};
  border-radius: 1px;
  min-height: 4px;
`;

// ── Thin progress bar (streak/level/hours) ────────────

export const ProgressBar = styled.div`
  height: 5px;
  background: ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  overflow: hidden;
  flex: 1;
`;

export const ProgressFill = styled.div<{ $percent: number; $tone?: 'accent' | 'tertiary' }>`
  display: block;
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$percent))}%;
  background: ${(p) => (p.$tone === 'tertiary' ? p.theme.colors.tertiary : p.theme.colors.accent)};
  border-radius: 9999px;
  transition: width 320ms ease;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 500;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
`;
