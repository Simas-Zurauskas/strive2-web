'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { PLATE_CREAM, PLATE_GOLD, PLATE_INK } from './plate';
import { MEASURE, sectionRhythm } from '../../_system/section';

/* ── The Vanishing Sentence ────────────────────────────────
   One sentence, one ruler, nothing else. The composition's whole idea is
   that the *measure* and the *type* are the same object: the sentence is
   laid along a three-week scale and its ink gives out as it crosses it.

   Everything is therefore left-aligned to a single baseline grid and given
   an enormous amount of vertical air — a centred header over a card grid
   would destroy the reading, because the reading is horizontal. */

export const Wrap = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${sectionRhythm}
  background: ${PLATE_INK};
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  max-width: ${MEASURE};
  display: flex;
  flex-direction: column;
  gap: var(--space-10);

  ${(p) => p.theme.media.tabletLarge} {
    gap: var(--space-8);
  }
`;

/* The sentence is a flex row of words rather than one text node so each
   word can hold its own resting opacity. 'baseline' alignment keeps the
   wrapped lines on a proper grid at phone widths. */
export const Sentence = styled.h2`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.28em;
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  /* Capped at the hero's display maximum (4rem). This sentence is the page's
     emotional pivot and legitimately sets at display scale rather than at
     headingType — but at its old 4.75rem it rendered 76px against the hero's
     64px, so the problem section shouted louder than the page's own opening.
     A deliberate exception to the heading rank, not to the hierarchy. */
  font-size: clamp(2rem, 6.1vw, 4rem);
  line-height: 1.06;
  letter-spacing: -0.025em;
  color: ${PLATE_CREAM};
`;

export const Word = styled(motion.span)<{ $em?: boolean }>`
  display: inline-block;
  ${(p) =>
    p.$em &&
    `
    font-style: italic;
    font-weight: 500;
    color: ${PLATE_GOLD};
  `}
`;

/* ── The ruler ─────────────────────────────────────────────
   A hairline with four ticks. It is the only thing in the section that
   states a duration, and it does it as a measure rather than a sentence. */

export const Ruler = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-top: var(--space-4);
`;

export const RulerLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  transform-origin: left center;
  background: color-mix(in srgb, ${PLATE_CREAM} 26%, transparent);
`;

export const Tick = styled(motion.div)`
  position: relative;
  padding-top: var(--space-3);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: color-mix(in srgb, ${PLATE_CREAM} 52%, transparent);

  /* The mark itself — a short riser off the rule, gold on the first tick
     so the scale has an origin. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 9px;
    background: color-mix(in srgb, ${PLATE_CREAM} 34%, transparent);
  }

  &:first-child::before {
    background: ${PLATE_GOLD};
    height: 13px;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 0.5625rem;
    letter-spacing: 0.12em;
  }
`;

/* ── The returns: spaced repetition drawn on the decay's own measure ──
   Gold pins above the rule at days 1 / 3 / 7 / 14, each a riser with its
   day number — the recall schedule laid over the forgetting window it
   exists to interrupt. Day 30 is off-measure and sits at the rail. */
export const Return = styled(motion.span)`
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  padding-bottom: 14px;
  font-size: 0.625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  color: ${PLATE_GOLD};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 11px;
    background: ${PLATE_GOLD};
  }
`;

export const ReturnEdge = styled(motion.span)`
  position: absolute;
  top: -6px;
  right: 0;
  font-size: 0.625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, ${PLATE_GOLD} 72%, transparent);
`;

/* The mechanism, said in words once the pins have said it in picture.
   Emphasised at review: at 0.9375rem/68% it read as a footnote to the
   ruler, when it is the section's actual answer — so it now sits at
   reading size in near-full cream, on a measure narrow enough to hold a
   shape, with the recall ladder picked out in gold by the <strong> the
   .tsx wraps it in. */
export const Mechanism = styled(motion.p)`
  margin: 0;
  max-width: 46ch;
  font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
  line-height: 1.65;
  color: color-mix(in srgb, ${PLATE_CREAM} 88%, transparent);

  strong {
    font-weight: 600;
    color: ${PLATE_GOLD};
  }
`;

/* Sits under the ruler at the far end — the answer, still last but no longer
   whispered: display-size serif at full cream, the '*em*' word italic gold,
   with a short gold rule anchoring it to the measure above. The headline
   states the problem and fades; this line is the product's reply, and review
   feedback was that at 1rem/72% it read as a caption rather than a reply. */
export const Closer = styled(motion.p)`
  position: relative;
  margin: 0;
  align-self: flex-end;
  max-width: 22ch;
  padding-top: var(--space-4);
  text-align: right;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: clamp(1.375rem, 2.6vw, 2rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: ${PLATE_CREAM};

  /* The origin rule — same gold as the ruler's first tick, so the reply
     reads as belonging to the measure rather than floating under it. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 56px;
    height: 2px;
    background: ${PLATE_GOLD};
  }

  em {
    font-style: italic;
    font-weight: 500;
    color: ${PLATE_GOLD};
  }

  ${(p) => p.theme.media.tabletLarge} {
    align-self: flex-start;
    text-align: left;

    &::before {
      right: auto;
      left: 0;
    }
  }
`;
