'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-16) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
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
  color: ${(p) => p.theme.colors.tertiaryText};
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

/* The trail: four columns whose seals sit on one dotted route line.
   Desktop draws the line horizontally through the seal centers (top: 21px
   = half the 42px seal); mobile rotates the trail vertical down the left
   edge — the same shape as the product's course sidebar. */
export const Track = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);

  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: 40px;
    right: 40px;
    border-top: 2px dotted
      ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 1fr;
    gap: var(--space-8);

    &::before {
      top: 21px;
      bottom: 21px;
      left: 21px;
      right: auto;
      border-top: none;
      border-left: 2px dotted
        ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 55%, transparent)`};
    }
  }
`;

export const Step = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  ${(p) => p.theme.media.tabletLarge} {
    display: grid;
    grid-template-columns: 42px 1fr;
    column-gap: var(--space-4);
    row-gap: var(--space-1);
  }
`;

/* Numbered map seal: serif numeral in a double-ringed gold circle, opaque
   so the trail appears to pass behind it. */
export const Seal = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: var(--space-2);
  border-radius: var(--radius-pill);
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: inset 0 0 0 3px ${(p) => p.theme.colors.background},
    inset 0 0 0 4px
      ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 45%, transparent)`};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiaryText};
  font-variant-numeric: tabular-nums;

  ${(p) => p.theme.media.tabletLarge} {
    grid-row: span 2;
    margin-bottom: 0;
  }
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

  ${(p) => p.theme.media.tabletLarge} {
    grid-column: 2;
    align-self: center;
  }
`;

export const StepBody = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;

  ${(p) => p.theme.media.tabletLarge} {
    grid-column: 2;
  }
`;
