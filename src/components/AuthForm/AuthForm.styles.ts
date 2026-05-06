import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
`;

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: ${(p) => p.theme.colors.foreground};
`;

export const FormError = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  text-align: center;
  margin: 0;
`;

export const FormFooter = styled.p`
  font-size: 0.8125rem;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FormHelperRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -0.5rem;
  font-size: 0.8125rem;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;
    opacity: 0.85;
    transition: opacity 0.15s;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

export const SubmitBtn = styled.button<{ $loading?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.accent};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${(p) => (p.$loading ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading ? 0.7 : 1)};
  box-shadow: var(--shadow-btn);
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.05s, opacity 0.15s;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    border-color: ${(p) => p.theme.colors.accentHover};
    box-shadow: var(--shadow-btn-hover);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const GoogleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.05s;

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.foreground} 20%, ${p.theme.colors.surfaceBorder})`};
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.foreground} 2%, ${p.theme.colors.surface})`};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Smooth height transition wrapper for the live PasswordRequirements
// checklist. Uses the modern grid-template-rows: 0fr → 1fr trick so the
// checklist expands/collapses cleanly without measuring heights in JS.
// Negative top-margin tightens the gap to the password input above when
// open, matching the visual cohesion of the rules-attached-to-input idiom.
export const PasswordRulesSlot = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: ${(p) => (p.$open ? '-0.25rem' : '-1rem')};

  & > div {
    overflow: hidden;
    /* PasswordRequirements has its own negative top margin to tighten
       against an input above it. Inside the overflow:hidden inner div,
       that negative margin clips the top of the first checklist row, so
       reset it. The slot's own margin-top already handles spacing. */
    & > ul {
      margin-top: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;