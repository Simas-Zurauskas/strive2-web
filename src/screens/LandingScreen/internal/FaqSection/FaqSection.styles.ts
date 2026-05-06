'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-20) var(--space-8);
  background: ${(p) => p.theme.colors.surface};
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-12) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
`;

export const SectionHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
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
