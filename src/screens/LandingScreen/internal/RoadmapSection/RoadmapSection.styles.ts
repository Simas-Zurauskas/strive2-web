'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-12) var(--space-8) var(--space-16);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) var(--space-5) var(--space-12);
  }
`;

export const Inner = styled(motion.div)`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: center;
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Heading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Subhead = styled.p`
  max-width: 560px;
  margin: 0 auto;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Step = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 35%, ${p.theme.colors.surfaceBorder})`};
      box-shadow: var(--shadow-card);
      transform: translateY(-1px);
    }
  }
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.accentMuted};
  color: ${(p) => p.theme.colors.accent};
  font-size: 0.8125rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

export const StepIcon = styled.span`
  display: inline-flex;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const StepTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const StepBody = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;
