'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MEASURE } from '../_system/section';
import { displayType, eyebrowType } from '../_system/typography';

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  /* Standalone rhythm, kept only for the design-lab's bare mount of this
     component as hero variant 00. On the landing page it is overridden by
     Hero11Route's HeroHost, which centres the hero in the chase instead. The
     page rhythm is space-24 / space-16; this is deliberately not that, because
     a full-height hero should not also carry a section's worth of pad. */
  padding: var(--space-16) 0;

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) 0;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${MEASURE};
  /* Inside variant 11's chase the chase's own margin IS the page gutter, so a
     pad here would double it and push the headline off the shared axis (the
     old flat 32px put it at 192px against everyone else's 160px). Mounted bare
     — which the design lab does, as hero variant 00 — there is no chase, and
     with a flat 0 the type ran to the viewport edge between 769 and 1120px.
     So the host declares the override and this reads it, defaulting to the
     page gutter when nothing sets it. */
  padding: 0 var(--hero-gutter, var(--space-8));
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
    padding: 0 var(--hero-gutter, var(--space-5));
  }
`;

export const CopyCol = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

export const Eyebrow = styled.span`
  ${eyebrowType}
`;

export const Headline = styled.h1`
  ${displayType}
`;

// Second headline line — a serif tagline that keeps the "real course on
// anything" breadth promise prominent without the weight of a second H1.
// Reads as a calm restatement between the bold H1 and the muted subhead.
export const HeadlineSub = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 500;
  font-size: clamp(1.25rem, 2.6vw, 1.625rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  max-width: 24ch;
  text-wrap: balance;
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

export const GoalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  max-width: 460px;

  ${(p) => p.theme.media.tabletLarge} {
    max-width: none;
  }
`;

export const GoalInput = styled.textarea`
  width: 100%;
  resize: none;
  padding: var(--space-4);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-btn);
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }

  &:focus-visible {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px
      color-mix(in srgb, ${(p) => p.theme.colors.accent} 18%, transparent);
  }
`;

export const GoalHint = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.tertiaryText};
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

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentHover};
      border-color: ${(p) => p.theme.colors.accentHover};
      box-shadow: var(--shadow-btn-hover);
    }
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

export const VisualCol = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
