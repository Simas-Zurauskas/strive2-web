import Link from 'next/link';
import styled, { css } from 'styled-components';

export type BannerTone = 'warning' | 'danger';

export const BannerEl = styled.div<{ $tone: BannerTone }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.75rem 1.25rem 0;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.875rem;
  line-height: 1.45;
  flex-wrap: wrap;

  ${(p) =>
    p.$tone === 'warning' &&
    css`
      background: ${p.theme.colorsLib.amber}15;
      color: ${p.theme.colors.warning};
      border-color: ${p.theme.colorsLib.amber}40;
    `}

  ${(p) =>
    p.$tone === 'danger' &&
    css`
      background: ${p.theme.colorsLib.red}15;
      color: ${p.theme.colors.error};
      border-color: ${p.theme.colorsLib.red}40;
    `}
`;

export const Message = styled.span`
  flex: 1;
  min-width: 0;

  strong {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const ActionLink = styled(Link)`
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

export const DismissBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 1.125rem;
  line-height: 1;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.04);
  }
`;
