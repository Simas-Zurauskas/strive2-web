import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  position: relative;
  width: 100%;
  max-width: ${(p) => (p.$size === 'sm' ? '260px' : p.$size === 'md' ? '320px' : '360px')};
  height: ${(p) => (p.$size === 'sm' ? '170px' : p.$size === 'md' ? '200px' : '220px')};
  margin: 0 auto;
  /* Cards are absolute-positioned inside; this just gives them a stage. */
`;

/** Each ghost card sits in the same stack origin; transforms below offset
 *  the lower cards so the stack reads as 3 layered sheets. */
export const GhostCard = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  background: ${(p) => p.theme.colors.background};
  /* Soft outer shadow gives the stack physical depth. */
  box-shadow: var(--shadow-ghost);
  transform-style: preserve-3d;
  perspective: 800px;
`;

export const Eyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
  opacity: 0.75;
`;

export const Question = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0.5rem 0 0;
  text-align: left;
`;

export const Answer = styled(motion.p)`
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  text-align: left;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.04em;
`;

export const FooterDots = styled.span`
  display: inline-flex;
  gap: 4px;
`;

export const Dot = styled.span<{ $active?: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active
      ? p.theme.colors.tertiary
      : `color-mix(in oklab, ${p.theme.colors.tertiary} 25%, ${p.theme.colors.surfaceBorder})`};
`;
