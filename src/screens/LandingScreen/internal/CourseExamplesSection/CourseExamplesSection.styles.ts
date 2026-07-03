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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

// Whole card is the click target → a real <button> for keyboard + a11y.
export const Card = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: var(--space-2);
  padding: var(--space-4);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) =>
        `color-mix(in oklab, ${p.theme.colors.tertiary} 40%, ${p.theme.colors.surfaceBorder})`};
      box-shadow: var(--shadow-card);
      transform: translateY(-1px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CardTop = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const IconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
`;

// Sits top-right, faint at rest, warms on hover — the "this is clickable" cue.
export const GoArrow = styled.span`
  display: inline-flex;
  color: ${(p) => p.theme.colors.muted};
  opacity: 0.5;
  transition: color 0.15s, opacity 0.15s, transform 0.15s;

  ${Card}:hover & {
    color: ${(p) => p.theme.colors.tertiary};
    opacity: 1;
    transform: translate(2px, -2px);
  }
`;

export const Category = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-top: var(--space-1);
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 600;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const Blurb = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Footnote = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const FootnoteCta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.accent};
  cursor: pointer;
  transition: color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;
