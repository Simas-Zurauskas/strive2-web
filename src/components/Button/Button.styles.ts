import styled, { css } from 'styled-components';

const primaryStyles = css`
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
  }
`;

const secondaryStyles = css`
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.border};

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const StyledButton = styled.button<{ $variant: 'primary' | 'secondary'; $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: ${(p) => (p.$loading || p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading || p.disabled ? 0.6 : 1)};
  transition:
    opacity 0.15s,
    border-color 0.15s,
    background 0.15s;

  ${(p) => (p.$variant === 'primary' ? primaryStyles : secondaryStyles)}
`;

export const Spinner = styled.span<{ $variant: 'primary' | 'secondary' }>`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid ${(p) => (p.$variant === 'primary' ? 'rgba(255,255,255,0.3)' : `${p.theme.colors.border}`)};
  border-top-color: ${(p) => (p.$variant === 'primary' ? '#fff' : p.theme.colors.accent)};
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;

  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }
`;
