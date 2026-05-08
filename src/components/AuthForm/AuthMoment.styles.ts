import styled, { css, keyframes } from 'styled-components';
import { onAccent } from '@/theme';

/**
 * Shared editorial vocabulary for post-action "moment" screens in the
 * auth flow — CheckEmail (post-signup), VerifyEmail (success / error /
 * expired), ForgotPassword (sent confirmation). Pattern: short gold
 * hairline → uppercase tertiary eyebrow → italic-serif headline →
 * muted body paragraph → primary action.
 *
 * Lives in the AuthForm component family so the auth-flow vocabulary
 * stays co-located. Don't reach for these primitives from in-app
 * screens — they have their own EmptyRule/EmptyEyebrow set.
 */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Centring shell for the small-card auth screens (forgot/reset/verify
 *  /check-email/signup-check-email). The (auth) layout no longer
 *  flex-centres its children — the landing page needs full width — so
 *  each card-screen wraps itself in this. */
export const Centered = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100%;
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 420px;
  padding: 1rem 0;
  animation: ${fadeIn} 0.22s ease-out;
`;

export const Rule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  margin: 0.25rem 0 0.625rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.125rem 0 0.5rem;
`;

export const Lead = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 36ch;
`;

const slide = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

/** Indeterminate progress — replaces a spinner for in-flight states. */
export const VerifyingTrack = styled.span`
  display: block;
  width: 64px;
  height: 1px;
  margin: 0.25rem 0 0.625rem;
  background: ${(p) => p.theme.colors.surfaceBorder};
  position: relative;
  overflow: hidden;
`;

export const VerifyingFill = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${(p) => p.theme.colors.tertiary} 50%,
    transparent 100%
  );
  animation: ${slide} 1.4s ease-in-out infinite;
`;

const buttonBase = css`
  margin: 1.125rem 0 0.25rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.05s;
  min-width: 220px;
  text-align: center;
  text-decoration: none;
  display: inline-block;

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

/** Primary forward action — forest fill. */
export const PrimaryButton = styled.button`
  ${buttonBase};
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => (p.theme.scheme === 'dark' ? p.theme.colors.background : onAccent)};

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    border-color: ${(p) => p.theme.colors.accentHover};
  }
`;

/** Secondary surface action — surface bg, hairline border. Used when
 *  the moment is itself the destination (e.g. "Resend") and the user
 *  shouldn't be pulled toward another screen. */
export const SecondaryButton = styled.button<{ $loading?: boolean }>`
  ${buttonBase};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  cursor: ${(p) => (p.$loading ? 'wait' : 'pointer')};

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
    color: ${(p) => p.theme.colors.tertiary};
  }

  &:disabled {
    opacity: ${(p) => (p.$loading ? 0.7 : 0.55)};
  }
`;

export const FootLine = styled.p`
  margin: 0.625rem 0 0;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/** Bare-button rendered as a link — used when the action is JS-side
 *  (e.g. signOut + navigate) rather than a plain href. */
export const InlineLinkButton = styled.button`
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: ${(p) => p.theme.colors.accent};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/** Inline highlight pill — used to echo back a value (e.g. the email
 *  the user just submitted). */
export const InlineMark = styled.span`
  display: inline-block;
  padding: 0.0625rem 0.4375rem;
  border-radius: var(--radius-sm);
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 10%, transparent)`};
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.005em;
  word-break: break-all;
`;

/** Smaller hint paragraph — used for spam-folder reminders, etc. */
export const Hint = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0.875rem 0 0;
  max-width: 36ch;
`;
