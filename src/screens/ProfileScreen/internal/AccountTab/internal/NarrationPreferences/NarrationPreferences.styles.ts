import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1;   }
`;

// ── Section shell ───────────────────────────────────

export const Section = styled.section`
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem 1.375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

export const SectionTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 0.4375rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Description = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  max-width: 56ch;
`;

// ── Field rows ──────────────────────────────────────

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SubsectionLabel = styled.label`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
`;

// ── Rate chips ──────────────────────────────────────

export const RateRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

/** Locked equal-width chip. Without `width` (only `min-width`), the longer
 *  labels ("0.85×", "1.15×") rendered wider than the shorter ones ("1×")
 *  and the row read as ragged. With `width: 5rem`, every chip has the
 *  same footprint regardless of label length OR pending state — clicking
 *  one no longer reflows its neighbours. */
export const RateButton = styled.button<{ $active: boolean; $pending: boolean }>`
  position: relative;
  width: 5rem;
  height: 2.25rem;
  padding: 0 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) =>
    p.$active
      ? p.theme.colors.accentMuted
      : p.theme.colors.surface};
  color: ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.muted)};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s, opacity 0.15s;

  /* While a click is in-flight, dim the label slightly so the corner
     pulse indicator reads as "this is the one we're saving". The chip
     itself doesn't change size or content — no layout shift. */
  ${(p) => p.$pending && `opacity: 0.7;`}

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      p.$active
        ? p.theme.colors.accent
        : `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: ${(p) => (p.$pending ? 'progress' : 'not-allowed')};
    /* When the disabled state is *because* this chip is mid-save we
       don't want it to fade to 55% — the $pending opacity above is the
       intentional treatment. */
    opacity: ${(p) => (p.$pending ? 0.7 : 0.55)};
  }
`;

/** Pulse dot anchored absolutely to the chip's top-right corner.
 *  Out-of-flow positioning means rendering / hiding it never affects
 *  the chip's layout — was the source of the click-time reflow. */
export const RatePulse = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  animation: ${pulse} 1s ease-in-out infinite;
`;
