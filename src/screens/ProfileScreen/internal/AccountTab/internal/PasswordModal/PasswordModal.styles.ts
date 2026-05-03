import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 90%;
  max-width: 420px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  animation: ${slideUp} 0.2s ease-out;
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ResendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: -0.25rem;
`;

// Dedicated OTP input. We don't reuse <Input/> because the wrapping component
// has caused subtle autofill leaks (password manager pasting the just-typed
// password into a generic text field). Here we get full control of every
// hint the browser uses to decide what to autofill: type=text + numeric
// inputMode + autoComplete="one-time-code" + the 1Password / LastPass /
// Bitwarden ignore attributes.
export const CodeField = styled.input`
  padding: 0.875rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 1.125rem;
  letter-spacing: 0.4em;
  text-align: center;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => p.theme.colorsLib.primary}10;
  }

  &::placeholder {
    opacity: 0.4;
    letter-spacing: normal;
  }
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:disabled {
    cursor: default;
    opacity: 0.5;
    text-decoration: none;
  }

  &:hover:not(:disabled) {
    color: ${(p) => p.theme.colors.foreground};
  }
`;
