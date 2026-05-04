import styled, { css } from 'styled-components';

const primaryStyles = css`
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const secondaryStyles = css`
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.border};

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.tertiary};
    color: ${(p) => p.theme.colors.tertiary};
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const dangerStyles = css`
  background: ${(p) => p.theme.colors.error};
  color: #fff;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const variantMap = { primary: primaryStyles, secondary: secondaryStyles, danger: dangerStyles };

export const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' | 'danger'; $size: 'default' | 'small'; $loading?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(p) => (p.$size === 'small' ? '0.375rem 1rem' : '0.75rem 1.75rem')};
  border-radius: 6px;
  font-family: inherit;
  font-size: ${(p) => (p.$size === 'small' ? '0.75rem' : '0.8125rem')};
  font-weight: 600;
  white-space: nowrap;
  cursor: ${(p) => (p.$loading || p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled && !p.$loading ? 0.6 : 1)};
  transition:
    opacity 0.15s,
    border-color 0.15s,
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s,
    transform 0.1s;

  ${(p) => variantMap[p.$variant]}

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Content = styled.span<{ $loading: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  visibility: ${(p) => (p.$loading ? 'hidden' : 'visible')};
`;

export const Spinner = styled.span<{ $variant: 'primary' | 'secondary' | 'danger'; $size: 'default' | 'small' }>`
  position: absolute;
  display: inline-block;
  width: ${(p) => (p.$size === 'small' ? '14px' : '16px')};
  height: ${(p) => (p.$size === 'small' ? '14px' : '16px')};
  border: 2px solid ${(p) => (p.$variant === 'secondary' ? p.theme.colors.border : 'rgba(255,255,255,0.3)')};
  border-top-color: ${(p) => (p.$variant === 'secondary' ? p.theme.colors.accent : '#fff')};
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;

  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }
`;
