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

/* Table-of-contents treatment: hairline-separated rows, no cards. */
export const Toc = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: baseline;
  gap: var(--space-6);
  padding: var(--space-5) var(--space-2);
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 48px 1fr;
    row-gap: var(--space-1);
  }
`;

export const Numeral = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 500;
  line-height: 1;
  color: ${(p) => p.theme.colors.tertiary};
  font-variant-numeric: tabular-nums;

  ${(p) => p.theme.media.tabletLarge} {
    grid-row: span 2;
    align-self: start;
  }
`;

export const RowMain = styled.div`
  /* Fixed label column: the small-cap type labels vary in width
     (MASTER vs MONETIZE), and inline flow left every serif title starting
     at a different x. A 104px column fits the widest label at this size
     and gives all titles one shared left edge. */
  display: grid;
  grid-template-columns: 104px 1fr;
  align-items: baseline;
  gap: var(--space-4);
  min-width: 0;

  ${(p) => p.theme.media.mobile} {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

export const Label = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiaryText};
  flex-shrink: 0;
`;

export const RowTitle = styled.h3`
  position: relative;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.25rem, 2.2vw, 1.5rem);
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  width: fit-content;

  /* Gold underline draws in on row hover — the "route" gesture at
     typographic scale. Hover-gated so touch taps don't stick. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 1px;
    background: ${(p) => p.theme.colors.tertiary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${(p) => p.theme.media.hover} {
    ${Row}:hover &::after {
      transform: scaleX(1);
    }
  }
`;

/* The example goal as italic marginalia, right-aligned like a page note. */
export const Example = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  text-align: right;
  max-width: 300px;

  ${(p) => p.theme.media.tabletLarge} {
    grid-column: 2;
    text-align: left;
    max-width: none;
  }
`;
