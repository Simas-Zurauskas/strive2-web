import styled, { css } from 'styled-components';

// Container only — no padding/max-width. The outer screen or tab is
// responsible for page-level layout; BillingPanel just stacks its three
// editorial blocks (plan / allowance / top-up).
export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// ── Shared card chrome ─────────────────────────────────

const cardBase = css`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.625rem 1.625rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem 1.25rem 1.375rem;
  }
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 0.625rem;
`;

// ── Plan card ──────────────────────────────────────────

export const PlanCard = styled.section<{ $tone: 'default' | 'warning' }>`
  ${cardBase}

  /* Soft warning tint when the user is on past_due / canceling — the
     border/bg becomes the danger signal so the status pill doesn't have
     to scream. Hairline only, never a solid red border. */
  ${(p) =>
    p.$tone === 'warning' &&
    css`
      border-color: color-mix(in oklab, ${p.theme.colors.warning} 32%, ${p.theme.colors.surfaceBorder});
      background: color-mix(in oklab, ${p.theme.colors.warning} 5%, ${p.theme.colors.surface});
    `}
`;

export const PlanHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.875rem;
`;

export const PlanIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`;

export const PlanEyebrow = styled(Eyebrow)``;

export const PlanName = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.05;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

/** Status pill — hairline + color-mix tint. Used to be reading from
 *  `theme.colorsLib.{green,amber,red}` which doesn't exist on the theme;
 *  the previous CSS was silently invalid. Now backed by the canonical
 *  semantic tokens (success / warning / error). */
export const PlanStatus = styled.span<{ $status: 'active' | 'warning' | 'canceled' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-pill);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;

  ${(p) => {
    const semantic =
      p.$status === 'active'
        ? p.theme.colors.success
        : p.$status === 'warning'
          ? p.theme.colors.warning
          : p.theme.colors.error;
    return css`
      border: 1px solid color-mix(in oklab, ${semantic} 32%, transparent);
      background: color-mix(in oklab, ${semantic} 12%, transparent);
      color: ${semantic};
    `;
  }}
`;

export const StatusDot = styled.span<{ $status: 'active' | 'warning' | 'canceled' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$status === 'active'
      ? p.theme.colors.success
      : p.$status === 'warning'
        ? p.theme.colors.warning
        : p.theme.colors.error};
`;

export const PlanRenewal = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.125rem;
  max-width: 60ch;

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const PlanActions = styled.div`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
`;

// ── Allowance section (inside PlanCard) ────────────────
// Used to be its own card; merged into PlanCard so the plan identity,
// allowance state, renewal date, and upgrade CTAs all live on one
// surface — the allowance IS the plan's allowance, two cards were
// two views of the same story.

export const AllowanceSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1.125rem;
  margin-top: 0.25rem;
  margin-bottom: 1.125rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const AllowanceEyebrow = styled(Eyebrow)``;

export const AllowanceHero = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.625rem;
  margin: 0.25rem 0 0.875rem;
`;

export const AllowanceValue = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 3.25rem;
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: ${(p) => p.theme.colors.foreground};
  font-variant-numeric: tabular-nums;

  ${(p) => p.theme.media.mobile} {
    font-size: 2.625rem;
  }
`;

export const AllowanceLabel = styled.span`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
`;

export const BarTrack = styled.div`
  height: 8px;
  border-radius: var(--radius-pill);
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 65%, ${p.theme.colors.background})`};
  overflow: hidden;
`;

export const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: var(--radius-pill);
  transition: width 320ms ease;
`;

export const BonusSep = styled.span`
  opacity: 0.55;
`;

// ── Top-up card ────────────────────────────────────────

export const TopupCard = styled.section`
  ${cardBase}
`;

export const TopupEyebrow = styled(Eyebrow)``;

export const TopupTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0 0 0.4375rem;
`;

/** Top-up balance line — "Balance · $X.XX · never expires" with the dollar
 *  amount rendered in the editorial italic-serif treatment so it reads as
 *  important data the user should notice without having to hunt. Always
 *  rendered, including at $0, so users always know what they have
 *  available beyond the renewing allowance. */
export const TopupBalance = styled.p`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-family: var(--font-heading-serif), Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 1.625rem;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
`;

export const TopupLead = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1.125rem;
  max-width: 56ch;
`;

/** Quiet cross-link from the top-up section to the subscription plans.
 *  Sits below the TopupControl as a soft footer note — we want users
 *  to know plans exist (and are cheaper per credit) without making the
 *  top-up surface feel like a sales pitch. */
export const PlanNudge = styled.p`
  margin: 1rem 0 0;
  padding-top: 0.875rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
`;

export const PlanNudgeLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: ${(p) => p.theme.colors.tertiary};
  cursor: pointer;
  font-weight: 600;
  transition: color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.tertiaryHover};
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &:focus-visible {
    outline: none;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

// ── Loading state ──────────────────────────────────────

export const PeriodNote = styled.div`
  ${cardBase}
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;
