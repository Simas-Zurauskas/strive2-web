'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Bar = styled(motion.div)`
  width: 100%;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Inner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-6);

  ${(p) => p.theme.media.mobile} {
    padding: var(--space-3) var(--space-4);
    gap: var(--space-3);
  }
`;

export const Copy = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Eyebrow = styled.p`
  margin: 0 0 0.125rem 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiaryText};
`;

export const Text = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;

    ${(p) => p.theme.media.hover} {
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Dismiss = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 36px keeps the tap target at the accessible minimum on touch. */
  width: 36px;
  height: 36px;
  margin: -0.25rem -0.5rem -0.25rem 0;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.background};
    }
  }
`;
