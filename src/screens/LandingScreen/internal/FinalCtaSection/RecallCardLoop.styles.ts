'use client';

import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';

const orbPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.55; }
  50%      { transform: scale(1.18); opacity: 1; }
`;

export const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-soft);

  ${(p) => p.theme.media.tabletLarge} {
    max-width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StatusDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.tertiary};
    ${css`
      animation: ${orbPulse} 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    `}
  }
`;

export const Stage = styled.div`
  position: relative;
  min-height: 260px;
`;

/* Two ghost cards behind the active one, suggesting more cards in queue.
   Static, nudged off-axis. They reinforce "deck of cards" without competing
   with the front-card animation. */
export const GhostCard = styled.div<{ $depth: 1 | 2 }>`
  position: absolute;
  inset: 0;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};
  border-radius: var(--radius-md);
  pointer-events: none;
  ${(p) =>
    p.$depth === 1 &&
    css`
      transform: translate(8px, 10px) rotate(1.6deg);
      opacity: 0.7;
    `}
  ${(p) =>
    p.$depth === 2 &&
    css`
      transform: translate(16px, 20px) rotate(3deg);
      opacity: 0.4;
    `}
`;

export const Card = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card-soft);
  min-height: 260px;
`;

export const MetaRow = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

export const CourseBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  padding: 0.2rem 0.55rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-sm);
  background: ${(p) => p.theme.colors.background};
`;

export const MetaSep = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const LessonBadge = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const BoxBadge = styled.span`
  margin-left: auto;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.tertiary};
  padding: 0.2rem 0.55rem;
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  border-radius: 999px;
  background: transparent;
`;

export const Prompt = styled(motion.p)`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  text-wrap: balance;
`;

export const AnswerWrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: var(--space-3);
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const AnswerLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.muted};
`;

export const Answer = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.45;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Pips = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const Pip = styled.span<{ $active: boolean }>`
  width: 18px;
  height: 2px;
  border-radius: 1px;
  background: ${(p) =>
    p.$active ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder};
  transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;
