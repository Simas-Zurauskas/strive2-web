'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colorsLib, themeColors } from '@/theme/theme';
import { MEASURE, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType, onPlate } from '../../_system/typography';

/* ── START LEARNING · 04 — The Plate ───────────────────────
   The page turns on ink at 'ProblemSection' — "most of what you learn is
   gone in three weeks" — and this closes on ink, so the argument is
   bracketed rather than trailing off into cream. It is the only candidate
   in the set built for scale: a full-bleed band, a headline at up to
   4.5rem, and a ruled register of three clauses at the foot.

   THEME-STABLE, like 'ProblemSection': the plate is dark in both themes,
   the way a printed plate is, so light-theme tokens must not leak in. The
   three constants below are read from 'theme/theme.ts' rather than typed
   as literals — same values 'ProblemSection' uses, one source. */

const INK = colorsLib.primaryHover;
const CREAM = colorsLib.cream;
const GOLD = themeColors.dark.tertiary;

export const Wrap = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${sectionRhythm}
  background: ${INK};

  /* One soft gold wash behind the headline. Atmospheric only. */
  &::before {
    content: '';
    position: absolute;
    inset: -30% -10%;
    pointer-events: none;
    background: radial-gradient(
      42% 46% at 50% 42%,
      color-mix(in srgb, ${GOLD} 14%, transparent) 0%,
      transparent 70%
    );
  }
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  /* Was 900px, which put this section's content box 110px inside every other
     section's on each side — the closing plate's Rule stopped short of the
     axis the whole page runs on. The composition is centred, so the wider
     measure costs it nothing; the copy keeps its own reading width below. */
  max-width: ${MEASURE};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Rule = styled(motion.div)`
  width: 100%;
  height: 1px;
  transform-origin: center;
  background: linear-gradient(90deg, transparent 0%, ${GOLD} 50%, transparent 100%);
  opacity: 0.55;
`;

/* Cream rather than gold, for the same contrast reason as the goal-types
   plate: a tracked 11px gold label on this ground does not clear 4.5:1. */
export const Eyebrow = styled(motion.span)`
  ${eyebrowType}
  ${onPlate.eyebrow(CREAM)}
  margin: clamp(var(--space-8), 4vw, var(--space-12)) 0 var(--space-3);
`;

/* Was clamp(2.25rem, 6.4vw, 4.5rem) — 72px at 1440px, larger than the hero's
   64px, so the page's closing line shouted louder than its opening one. On the
   shared heading rank now; the plate gives it presence, not size. */
export const Headline = styled(motion.h2)`
  ${headingType}
  ${onPlate.heading(CREAM, GOLD)}
  max-width: 20ch;
`;

export const Close = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin: clamp(var(--space-8), 4vw, var(--space-12)) 0;
  width: 100%;
`;

export const Cta = styled.button`
  padding: 0.9375rem var(--space-8);
  border: none;
  border-radius: var(--radius-md);
  background: ${CREAM};
  color: ${INK};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: var(--shadow-btn);

  ${(p) => p.theme.media.hover} {
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-btn-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid ${GOLD};
    outline-offset: 3px;
  }

  ${(p) => p.theme.media.tabletLarge} {
    width: 100%;
  }
`;

export const Micro = styled.span`
  font-size: 0.8125rem;
  color: ${CREAM};
  opacity: 0.7;
`;

export const Secondary = styled.a`
  margin-top: var(--space-1);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${GOLD};

  ${(p) => p.theme.media.hover} {
    &:hover {
      text-decoration: underline;
    }
  }

  &:focus-visible {
    outline: 2px solid ${GOLD};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

/* Ruled register at the foot of the plate — three clauses, gold lozenges
   between them, stacking on phones. */
export const Register = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-3) var(--space-5);
  margin-bottom: clamp(var(--space-8), 4vw, var(--space-12));

  ${(p) => p.theme.media.tabletLarge} {
    flex-direction: column;
    gap: var(--space-2);
  }
`;

export const Clause = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-5);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${CREAM};
  opacity: 0.62;

  &:not(:last-child)::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 1px;
    transform: rotate(45deg);
    background: ${GOLD};
  }

  ${(p) => p.theme.media.tabletLarge} {
    gap: 0;

    &:not(:last-child)::after {
      display: none;
    }
  }
`;
