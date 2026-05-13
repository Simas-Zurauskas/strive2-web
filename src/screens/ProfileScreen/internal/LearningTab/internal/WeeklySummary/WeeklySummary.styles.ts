import styled from 'styled-components';

/**
 * Weekly summary strip — five cells with italic serif numbers (matches the
 * StatBento on Home and the StatTiles in RecallActivityCard for editorial
 * consistency). One outer card with hairline-divided cells; deltas live
 * inside each cell as small color-mix chips. The eyebrow "vs last week"
 * sits once on the section header, not repeated per cell.
 */

export const Wrap = styled.section`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1rem;
  overflow: hidden;
`;

export const Header = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem 0.5rem;
`;

export const Eyebrow = styled.h3`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin: 0;
`;

export const Sub = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.005em;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  /* Hairline dividers between cells. */
  & > * + * {
    border-left: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(3, 1fr);

    & > * + * {
      border-left: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    }

    /* When the 4th cell wraps to a new row, its left border is the only
       dividing line on that row's leading edge — kill it so it doesn't
       double up against the card's outer border. */
    & > *:nth-child(4) {
      border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    }
    & > *:nth-child(5) {
      border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    }

    /* Orphan trailing cell: span the empty column so the top divider runs
       fully across the row instead of stopping mid-card. */
    & > *:nth-child(5):last-child {
      grid-column: 2 / -1;
    }
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);

    & > *:nth-child(2n+1) {
      border-left: none;
    }
    & > *:nth-child(n+3) {
      border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    }

    /* Orphan trailing cell on an odd row count fills the empty second
       column so the row's top divider isn't a half-width line. */
    & > *:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }
`;

export const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4375rem;
  padding: 0.875rem 1rem 1rem;
  min-height: 5.25rem;
`;

export const Label = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Value = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.625rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
`;

/** Inline delta chip. Hairline + color-mix tint matches the trend chips
 *  used across recall / quiz widgets. The "neutral" path renders as
 *  dim muted text without chip chrome — no need to draw attention to a
 *  zero-change row. */
export const Delta = styled.span<{ $positive: boolean; $neutral: boolean }>`
  ${(p) =>
    p.$neutral
      ? `
        font-size: 0.6875rem;
        color: ${p.theme.colors.muted};
        opacity: 0.6;
      `
      : `
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.4375rem;
        border-radius: var(--radius-pill);
        font-size: 0.625rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        font-variant-numeric: tabular-nums;
        border: 1px solid ${
          p.$positive
            ? `color-mix(in oklab, ${p.theme.colors.success} 28%, transparent)`
            : `color-mix(in oklab, ${p.theme.colors.error} 28%, transparent)`
        };
        background: ${
          p.$positive
            ? `color-mix(in oklab, ${p.theme.colors.success} 10%, transparent)`
            : `color-mix(in oklab, ${p.theme.colors.error} 10%, transparent)`
        };
        color: ${p.$positive ? p.theme.colors.success : p.theme.colors.error};
      `}
`;
