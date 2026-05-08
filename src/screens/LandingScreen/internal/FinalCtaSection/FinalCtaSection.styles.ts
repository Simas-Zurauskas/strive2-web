'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Page closes on the CTA — slightly more air than content sections so
     the visitor's eye can't drift past it, but not so much it floats. */
  padding: var(--space-20) var(--space-8);
  background: ${(p) => p.theme.colors.accentMuted};

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-12) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
  max-width: 640px;
`;

export const Heading = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Cta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: var(--on-accent);
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: var(--shadow-btn);
  transition: background 0.15s, border-color 0.15s, transform 0.05s, box-shadow 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
    border-color: ${(p) => p.theme.colors.accentHover};
    box-shadow: var(--shadow-btn-hover);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) => p.theme.media.mobile} {
    width: 100%;
    justify-content: center;
  }
`;

export const Microcopy = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;
