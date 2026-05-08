import styled from 'styled-components';

// ── Standard section ───────────────────────────────────

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.5rem 1.375rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

/** Section heading — italic serif, matches the editorial pattern used by
 *  NarrationPreferences and the Recall page. The previous uppercase-muted
 *  treatment drifted from the rest of the app where the section's *title*
 *  is editorial and the metadata above it is the eyebrow. */
export const SectionTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 0.75rem 0;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
  }
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const Value = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

/** Legal-row anchor — the whole row is the link, replacing the previous
 *  muted-label + disconnected "View" pairing. Foreground text + a quiet
 *  ArrowUpRight on the right reads as a single navigational unit and
 *  harmonises with the rest of the settings stack. */
export const LegalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 0.75rem 0;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.15s;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
  }

  & svg {
    flex-shrink: 0;
    opacity: 0.45;
    transition: opacity 0.15s, transform 0.15s;
  }

  &:hover {
    color: ${(p) => p.theme.colors.tertiary};
  }

  &:hover svg {
    opacity: 1;
    transform: translate(1px, -1px);
  }
`;

/** Provider chip — hairline pill with a faint tertiary tint to mark these
 *  as "identity" fields (matches the bookmark/saved semantic gold). */
export const ProviderTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 8%, transparent)`};
  border: 1px solid ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 24%, transparent)`};
  color: ${(p) => p.theme.colors.tertiary};
`;

// ── Danger zone ───────────────────────────────────────
// Soft red tint with a hairline, not a full red border. The previous
// solid `error` border read as an alarm; the action is destructive but
// the surface itself doesn't need to scream — the button does the work.

export const DangerZone = styled.section`
  border: 1px solid
    ${(p) => `color-mix(in oklab, ${p.theme.colors.error} 28%, ${p.theme.colors.surfaceBorder})`};
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.5rem 1.375rem;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.error} 4%, ${p.theme.colors.surface})`};
  margin-bottom: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

export const DangerTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 0.4375rem;
  color: ${(p) => p.theme.colors.error};
`;

export const DangerText = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem;
  max-width: 56ch;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const DangerButton = styled.button<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  cursor: ${(p) => (p.$loading || p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading || p.disabled ? 0.6 : 1)};
  transition: opacity 0.15s, background 0.15s, box-shadow 0.15s;
  background: ${(p) => p.theme.colors.error};
  color: var(--on-accent);
  border: 1px solid transparent;
  box-shadow: var(--shadow-card);

  &:hover:not(:disabled) {
    opacity: 0.92;
    box-shadow: 0 2px 6px ${(p) =>
      `color-mix(in srgb, ${p.theme.colors.error} 18%, transparent)`};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.error};
    outline-offset: 2px;
  }
`;

/** OTP / confirmation input. Tabular-nums + monospace-ish digit feel via
 *  letter-spacing makes the 6-digit code legible. `display: block` forces
 *  the resend link to wrap to a new line below — without it, an `<input>`
 *  is inline and sits flush against the next sibling text. Focus border
 *  becomes the error color (matching the danger-zone semantic) so the
 *  user understands they're confirming a destructive action. */
export const ConfirmInput = styled.input`
  display: block;
  width: 100%;
  max-width: 16rem;
  padding: 0.6875rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.18em;
  margin-bottom: 0.625rem;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    letter-spacing: 0;
    color: ${(p) => p.theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.error};
    box-shadow: 0 0 0 3px ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.error} 16%, transparent)`};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const CodeHint = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 0.625rem;
  line-height: 1.5;
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-variant-numeric: tabular-nums;

  &:disabled {
    cursor: default;
    opacity: 0.5;
    text-decoration: none;
  }

  &:hover:not(:disabled) {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Forfeit warning shown before delete confirmation ────
// Soft amber surface — important enough to read carefully, not loud
// enough to be alarming. (Bug fix: previously referenced
// `theme.colorsLib.amber` which doesn't exist on the theme — the tint
// was silently rendering invalid CSS.)

export const ForfeitWarning = styled.div`
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.warning} 8%, transparent)`};
  border: 1px solid ${(p) => `color-mix(in oklab, ${p.theme.colors.warning} 30%, transparent)`};
  border-radius: var(--radius-lg);
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
`;

export const ForfeitTitle = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.warning};
  margin-bottom: 0.5rem;
`;

export const ForfeitList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.55;

  li {
    margin: 0.15rem 0;
  }

  strong {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;
