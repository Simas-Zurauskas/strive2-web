'use client';

import styled, { keyframes } from 'styled-components';

const backdropFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const dialogPop = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeOnly = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  /* The scrim CSS variable is theme-aware (lighter under light, deeper
     under dark) so we no longer need a separate dark-mode override. */
  background: var(--scrim-light);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: ${backdropFade} 0.18s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  ${(p) => p.theme.media.mobile} {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lift);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  gap: var(--space-4);
  animation: ${dialogPop} 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  ${(p) => p.theme.media.mobile} {
    max-width: none;
    max-height: none;
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
    border: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeOnly} 0.12s linear;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
`;

export const Wordmark = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const TabList = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  margin-bottom: var(--space-4);
`;

export const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-3) var(--space-2);
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  cursor: pointer;
  transition: color 0.15s;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
    transition: background 0.15s;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

// Stable height between sign-in/sign-up so the dialog doesn't jolt during
// tab switches. Tuned for the sign-up form rendered with PasswordRequirements
// fully visible — the taller of the two layouts.
export const FormArea = styled.div`
  position: relative;
  min-height: 480px;
  display: flex;
  flex-direction: column;

  ${(p) => p.theme.media.mobile} {
    min-height: 0;
  }
`;

export const FormSlot = styled.div<{ $active: boolean }>`
  position: ${(p) => (p.$active ? 'relative' : 'absolute')};
  inset: 0;
  display: ${(p) => (p.$active ? 'flex' : 'none')};
  flex-direction: column;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 0.12s linear;
`;

export const FinePrint = styled.p`
  margin-top: var(--space-3);
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  line-height: 1.5;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
