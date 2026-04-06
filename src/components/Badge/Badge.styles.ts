import styled, { css } from 'styled-components';

const variantStyles = {
  default: css`
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.muted};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  `,
  accent: css`
    background: ${(p) => p.theme.colorsLib.primary}15;
    color: ${(p) => p.theme.colors.accent};
    border: 1px solid ${(p) => p.theme.colorsLib.primary}30;
  `,
  gold: css`
    background: ${(p) => p.theme.colorsLib.secondary}20;
    color: ${(p) => p.theme.colorsLib.secondary};
    border: 1px solid ${(p) => p.theme.colorsLib.secondary}40;
  `,
  success: css`
    background: ${(p) => p.theme.colorsLib.green}15;
    color: ${(p) => p.theme.colors.success};
    border: 1px solid ${(p) => p.theme.colorsLib.green}30;
  `,
  warning: css`
    background: ${(p) => p.theme.colorsLib.amber}15;
    color: ${(p) => p.theme.colors.warning};
    border: 1px solid ${(p) => p.theme.colorsLib.amber}30;
  `,
};

export const StyledBadge = styled.span<{ $variant: keyof typeof variantStyles }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;

  ${(p) => variantStyles[p.$variant]}
`;
