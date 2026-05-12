import styled from 'styled-components';

// ── Editorial status banner (cards exist) ──────────────
//
// Quiet typographic statement, not a pill. Mirrors the "Lesson finished"
// banner pattern: small gold eyebrow + italic-serif statement + a
// help anchor sitting at the same baseline. No count — the user can
// see their cards in /recall; this surface just confirms they're there.

export const StatusBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  margin: 2rem auto 0;
  padding: 1.25rem 1rem 0;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  max-width: 36rem;
  text-align: center;
`;

export const StatusBannerEyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StatusBannerText = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.0625rem;
  line-height: 1.35;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  max-width: 32ch;

  ${(p) => p.theme.media.mobile} {
    font-size: 0.9375rem;
  }
`;

/** HelpAnchor wrapper — tiny top margin so the "?" sits below the
 *  italic line at a calmer baseline than inline. */
export const StatusBannerHelp = styled.span`
  display: inline-flex;
  margin-top: 0.125rem;
  opacity: 0.85;
`;

// ── Empty-state card (no cards yet — CTA path) ──────────

export const EmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.375rem 1.375rem;
  margin: 2rem 0 0;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 38%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 6%, ${p.theme.colors.surface})`};

  ${(p) => p.theme.media.mobile} {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

export const EmptyEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.1875rem;
  letter-spacing: -0.005em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.25rem 0 0;
`;

export const EmptyBody = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const EmptyAction = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 55%, transparent)`};
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 14%, ${p.theme.colors.surface})`};
  color: ${(p) => p.theme.colors.tertiaryHover};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s ease;

  & svg {
    flex-shrink: 0;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 22%, ${p.theme.colors.surface})`};
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 75%, transparent)`};
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;
