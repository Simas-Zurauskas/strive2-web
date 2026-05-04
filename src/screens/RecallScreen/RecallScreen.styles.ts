import styled from 'styled-components';

export const ContentWrap = styled.div`
  padding-top: 4vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 56px);
`;

// ── Editorial hero ──────────────────────────────────
// Mirrors /help and /quizzes pattern: gold eyebrow → italic serif title
// (full sentence with period) → muted body-size subtitle that teaches
// what the page is about.

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0;
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

// ── Card area ───────────────────────────────────────

export const CardArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
  max-width: 720px;
  width: 100%;
`;

// ── Empty / done editorial block ─────────────────────
// Matches the lesson screen "Ready to generate" placeholder: gold rule
// + uppercase eyebrow + italic serif title + muted lead. No filled icon
// circle — the rule + typography carries the moment.

export const EmptyState = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.75rem;
  padding: 3.5rem 2rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  background: ${(p) => p.theme.colors.surface};
  max-width: 720px;
  width: 100%;
  align-self: center;

  ${(p) => p.theme.media.tablet} {
    padding: 2.5rem 1.5rem;
  }
`;

export const EmptyRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin-bottom: 0.5rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

/** Non-italic serif — the page hero above already carries the single
 *  italic moment, and the empty-state card sits beneath it. Keeping
 *  this italic too crowded the screen with two italic serif lines. */
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
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 44ch;
`;

export const EmptyAction = styled.div`
  margin-top: 1rem;
`;

/** Dateline replacing the 3-card stat block. Reads as a quiet record
 *  ("Reviewed 12 today · 248 all time · 5 due this week") rather than a
 *  productivity dashboard. */
export const EmptyDateline = styled.p`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.005em;
  line-height: 1.5;
  margin: 1.25rem 0 0;
`;

export const DatelineStrong = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;
`;

export const DatelineSep = styled.span`
  margin: 0 0.5rem;
  opacity: 0.6;
`;
