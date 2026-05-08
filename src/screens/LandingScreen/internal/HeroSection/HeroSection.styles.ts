'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Asymmetric — slightly less top, more bottom — so the headline sits
     weighted toward the upper third without floating. */
  padding: var(--space-16) 0 var(--space-20);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) 0 var(--space-12);
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1120px;
  padding: 0 var(--space-8);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: var(--space-12);
  align-items: center;

  ${(p) => p.theme.media.desktop} {
    gap: var(--space-8);
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding: 0 var(--space-5);
  }
`;

export const CopyCol = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Headline = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(2.25rem, 6.4vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;

  em {
    font-style: italic;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const Subhead = styled.p`
  font-size: 1.0625rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
`;

export const CtaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;

  ${(p) => p.theme.media.tabletLarge} {
    align-items: stretch;
  }
`;

export const PrimaryCta = styled.button`
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

  ${(p) => p.theme.media.tabletLarge} {
    width: 100%;
    justify-content: center;
  }
`;

export const Microcopy = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const SecondaryCta = styled.a`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

export const VisualCol = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
