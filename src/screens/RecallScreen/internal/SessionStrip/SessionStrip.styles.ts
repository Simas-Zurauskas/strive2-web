import styled from 'styled-components';

export const Wrap = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
  flex-wrap: wrap;
`;

export const LeftCluster = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  row-gap: 0.375rem;
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Sep = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.6;
  line-height: 1;
`;

export const Progress = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.005em;
  line-height: 1.2;
`;

export const ProgressStrong = styled.span`
  font-style: normal;
  font-family: var(--font-sans), system-ui, sans-serif;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ProgressOf = styled.span`
  color: ${(p) => p.theme.colors.muted};
  font-family: var(--font-sans), system-ui, sans-serif;
  font-style: normal;
  font-weight: 400;
`;

/** Quiet gold pill that surfaces the in-session retry queue size.
 *  Tells the user "you'll see N cards come back this session because
 *  you pressed Again" — without that signal the Anki-style re-queue
 *  feels like a bug. */
export const RetryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.4375rem;
  border-radius: var(--radius-pill);
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 40%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 10%, transparent)`};
  color: ${(p) => p.theme.colors.tertiaryHover};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  margin-left: 0.25rem;
  white-space: nowrap;
`;

export const Counts = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;

  /* On mobile, let the counts wrap to the next line under the
     progress count rather than fight for space on a single row. */
  ${(p) => p.theme.media.mobile} {
    flex-basis: 100%;
    text-align: left;
    letter-spacing: 0.06em;
  }
`;

export const Bar = styled.div`
  position: relative;
  height: 6px;
  border-radius: var(--radius-pill);
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 100%, transparent)`};
  overflow: hidden;
`;

export const Fill = styled.div<{ $pct: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-pill);
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;
