import styled from 'styled-components';
import { media } from '@/theme/theme';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.625rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 999px;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

  svg {
    width: 13px;
    height: 13px;
  }

  /* Wrapped so a tap on touch does not leave the hover state stuck. */
  ${media.hover} {
    &:hover:not(:disabled) {
      color: ${(p) => p.theme.colors.foreground};
      border-color: ${(p) => p.theme.colors.border};
      background: ${(p) => p.theme.colors.surface};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
