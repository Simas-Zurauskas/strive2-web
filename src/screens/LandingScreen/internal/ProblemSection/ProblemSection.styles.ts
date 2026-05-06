'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Shallow content (heading + 2-line body, max-width 720) — keep tighter
     than dense sections so the text doesn't float in empty air. */
  padding: var(--space-16) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  text-align: center;
`;

export const Heading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;

  em {
    font-style: italic;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const Body = styled.p`
  font-size: 1.0625rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;
