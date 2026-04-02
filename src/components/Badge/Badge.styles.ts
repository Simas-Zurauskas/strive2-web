import styled, { css } from 'styled-components';

const variantStyles = {
  default: css`
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.muted};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  `,
  accent: css`
    background: ${(p) => p.theme.colors.accent}1a;
    color: ${(p) => p.theme.colors.accent};
    border: 1px solid ${(p) => p.theme.colors.accent}33;
  `,
  success: css`
    background: ${(p) => p.theme.colors.success}1a;
    color: ${(p) => p.theme.colors.success};
    border: 1px solid ${(p) => p.theme.colors.success}33;
  `,
  warning: css`
    background: ${(p) => p.theme.colors.warning}1a;
    color: ${(p) => p.theme.colors.warning};
    border: 1px solid ${(p) => p.theme.colors.warning}33;
  `,
};

export const StyledBadge = styled.span<{ $variant: keyof typeof variantStyles }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;

  ${(p) => variantStyles[p.$variant]}
`;
