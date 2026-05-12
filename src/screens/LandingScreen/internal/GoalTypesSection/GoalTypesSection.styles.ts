'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-20) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-12) var(--space-5);
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

  em {
    font-style: italic;
    color: ${(p) => p.theme.colors.tertiary};
  }
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
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);

  ${(p) => p.theme.media.desktop} {
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-2);
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-4);
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

export const Label = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Verb = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Example = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;

  &::before {
    content: '"';
    display: block;
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.25rem;
    line-height: 1;
    color: ${(p) => p.theme.colors.tertiary};
    margin-bottom: 2px;
  }
`;
