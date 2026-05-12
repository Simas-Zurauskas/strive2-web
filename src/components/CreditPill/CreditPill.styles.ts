import Link from 'next/link';
import styled, { css } from 'styled-components';

const toneStyles = {
  neutral: css`
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.foreground};
    border-color: ${(p) => p.theme.colors.surfaceBorder};
  `,
  warning: css`
    background: ${(p) => p.theme.colorsLib.amber}15;
    color: ${(p) => p.theme.colors.warning};
    border-color: ${(p) => p.theme.colorsLib.amber}40;
  `,
  danger: css`
    background: ${(p) => p.theme.colorsLib.red}15;
    color: ${(p) => p.theme.colors.error};
    border-color: ${(p) => p.theme.colorsLib.red}40;
  `,
};

export type CreditPillTone = keyof typeof toneStyles;

export const PillLink = styled(Link)<{ $tone: CreditPillTone }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  transition: transform 120ms ease, box-shadow 120ms ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      transform: translateY(-1px);
    }
  }

  ${(p) => toneStyles[p.$tone]}
`;

export const Label = styled.span`
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

export const BarTrack = styled.span`
  position: relative;
  display: inline-block;
  width: 72px;
  height: 6px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  overflow: hidden;
`;

const fillColor = {
  neutral: (theme: { colors: { accent: string } }) => theme.colors.accent,
  warning: (theme: { colors: { warning: string } }) => theme.colors.warning,
  danger: (theme: { colors: { error: string } }) => theme.colors.error,
};

export const BarFill = styled.span<{ $pct: number; $tone: CreditPillTone }>`
  display: block;
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => fillColor[p.$tone](p.theme)};
  border-radius: inherit;
  transition: width 200ms ease;
`;

export const Amount = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.01em;
`;
