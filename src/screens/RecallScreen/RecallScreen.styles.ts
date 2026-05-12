import styled from 'styled-components';

// ── Empty / done shell (editorial hero + card) ───────
// The editorial hero — italic serif title, muted subtitle — is reserved
// for empty and done states. During active review the screen flips to a
// focused practice mode (see ActiveWrap below).

export const ContentWrap = styled.div`
  padding-top: 4vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100dvh - 56px);
`;

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

  ${(p) => p.theme.media.mobile} {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0;
  max-width: 60ch;
`;

// ── Active session shell ─────────────────────────────
// No editorial hero. The session strip carries the page identity, the
// card is the hero. Generous max-width + vertical centering so the card
// reads as a focal object on a quiet stage.

export const ActiveWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2.25rem;
  padding-bottom: 2rem;
  min-height: calc(100dvh - 56px);
  width: 100%;
  max-width: 640px;
  margin: 0 auto;

  ${(p) => p.theme.media.tablet} {
    padding-top: 1.25rem;
    gap: 1rem;
  }

  ${(p) => p.theme.media.mobile} {
    padding-top: 1rem;
    padding-bottom: 1.25rem;
    gap: 0.875rem;
  }
`;

export const CardStage = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

// ── Empty / done editorial block ─────────────────────

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
  width: 100%;

  ${(p) => p.theme.media.tablet} {
    padding: 2.5rem 1.5rem;
  }

  ${(p) => p.theme.media.mobile} {
    padding: 2rem 1.125rem;
  }
`;

export const EmptyPreviewSlot = styled.div`
  width: 100%;
  margin-bottom: 1.25rem;
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

export const EmptyDateline = styled.p`
  position: relative;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.005em;
  line-height: 1.6;
  margin: 1.75rem 0 0;
  padding-top: 1.25rem;

  ${(p) => p.theme.media.mobile} {
    font-size: 0.875rem;
  }

  /* Hairline gold rule above the dateline so the stats read as a
     quiet record set off from the body copy. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    height: 1px;
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 60%, ${p.theme.colors.surfaceBorder})`};
  }
`;

export const DatelineStrong = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: 1.0625rem;
  margin-right: 0.1875rem;
`;

export const DatelineSep = styled.span`
  margin: 0 0.625rem;
  opacity: 0.55;

  ${(p) => p.theme.media.mobile} {
    margin: 0 0.375rem;
  }
`;

// ── Interim retry-screen action row ──────────────────
// Sits below the dateline on the "X cards ask for another pass" beat
// between batches. Primary button continues into the retry batch;
// secondary text-link bails out and the user comes back tomorrow.

export const InterimActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  /* Stack vertically on narrow widths so the primary button gets
     full width and isn't cramped next to the secondary link. */
  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    /* Make the primary button (rendered as a child of this row) span
       the full row on mobile. The Button component wraps its content
       — target its first child. */
    & > *:first-child {
      width: 100%;
      max-width: 22rem;
    }
  }
`;

export const InterimSecondaryButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 0.25rem;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  cursor: pointer;
  transition: color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &:focus-visible {
    outline: none;
    color: ${(p) => p.theme.colors.foreground};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
