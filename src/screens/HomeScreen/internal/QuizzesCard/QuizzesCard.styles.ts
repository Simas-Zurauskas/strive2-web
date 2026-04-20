import styled, { css, keyframes } from 'styled-components';
import type { QuizMasteryTier } from '@/api/types';

const pulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.15); }
`;

export const Container = styled.button`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  text-align: left;
  cursor: pointer;
  width: 100%;
  font: inherit;
  color: inherit;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.tertiary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(p) => p.theme.colors.tertiaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.tertiary};
    outline-offset: 2px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const HeaderIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1;
`;

export const HeaderTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

export const PulseDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.warning};
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const CountBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

export const BigCount = styled.span<{ $variant: 'review' | 'fresh' }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1;
  color: ${(p) => (p.$variant === 'review' ? p.theme.colors.warning : p.theme.colors.tertiary)};
`;

export const CountLabel = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

export const Attribution = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.3;
`;

export const StakeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const tierStyles = {
  needs_review: css`
    background: ${(p) => p.theme.colors.error}1a;
    color: ${(p) => p.theme.colors.error};
  `,
  passed: css`
    background: ${(p) => p.theme.colors.tertiaryMuted};
    color: ${(p) => p.theme.colors.tertiary};
  `,
  mastered: css`
    background: ${(p) => p.theme.colors.accentMuted};
    color: ${(p) => p.theme.colors.accent};
  `,
};

export const TierBadge = styled.span<{ $tier: QuizMasteryTier }>`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  ${(p) => tierStyles[p.$tier]}
`;

export const StakeText = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Footer = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  padding-top: 0.5rem;
  border-top: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
  margin-top: 0.125rem;
`;

export const CTA = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const CTAArrow = styled.span`
  transition: transform 0.15s;

  ${Container}:hover & {
    transform: translateX(3px);
  }
`;
