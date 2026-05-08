import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colorsLib } from '@/theme';

export const Wrap = styled.div`
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem 1.25rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  background: ${(p) => p.theme.colors.background};
  box-shadow: var(--shadow-ghost);
`;

export const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
  opacity: 0.75;
`;

export const ProgressDots = styled.span`
  display: inline-flex;
  gap: 4px;
`;

export const ProgressDot = styled.span<{ $tone: 'active' | 'idle' }>`
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: ${(p) =>
    p.$tone === 'active'
      ? p.theme.colors.tertiary
      : `color-mix(in oklab, ${p.theme.colors.tertiary} 20%, ${p.theme.colors.surfaceBorder})`};
`;

export const Question = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  text-align: left;
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Option = styled(motion.div)<{ $state: 'idle' | 'correct' }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.3;
  color: ${(p) => p.theme.colors.foreground};
  border: 1px solid
    ${(p) =>
      p.$state === 'correct'
        ? `color-mix(in oklab, ${colorsLib.green} 60%, ${p.theme.colors.surfaceBorder})`
        : p.theme.colors.surfaceBorder};
  border-radius: 10px;
  background: ${(p) =>
    p.$state === 'correct'
      ? `color-mix(in oklab, ${colorsLib.green} 12%, ${p.theme.colors.background})`
      : p.theme.colors.background};
  text-align: left;
  transition: background 0.4s ease, border-color 0.4s ease;
`;

export const Bullet = styled.span<{ $state: 'idle' | 'correct' }>`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid
    ${(p) =>
      p.$state === 'correct'
        ? colorsLib.green
        : `color-mix(in oklab, ${p.theme.colors.muted} 50%, ${p.theme.colors.surfaceBorder})`};
  background: ${(p) => (p.$state === 'correct' ? colorsLib.green : 'transparent')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.background};
    opacity: ${(p) => (p.$state === 'correct' ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;
