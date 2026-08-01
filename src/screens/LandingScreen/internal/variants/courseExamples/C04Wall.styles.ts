'use client';

import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { MEASURE, headBlockRhythm, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType } from '../../_system/typography';

/* ── COURSE EXAMPLES 04 · The Wall ─────────────────────────
   Design logic: quantity, in motion. Three ribbons of topics drift past at
   different speeds in alternating directions, set at display size in serif
   with a gold lozenge between each. The section's message is "there is a
   lot of this", and continuous drift says that in a way sixteen static
   tiles cannot.

   THE HONEST PART. A moving click target is a bad click target, so the
   drift is switched off wherever tapping is the primary input or motion is
   unwelcome: under 'prefers-reduced-motion' and on touch devices the
   ribbons stop, the duplicate run is removed, and the words wrap into a
   still typographic block with every topic present and reachable. That is
   also the phone design — a wrapped word wall at 360px reads better than a
   marquee ever would, and it needs no horizontal scrolling.

   The drift is a CSS animation rather than a framer one on purpose: it has
   to be cancellable by a media query, which a JS-driven loop cannot be
   without branching the tree at hydration. */

/**
 * How many identical runs sit in one track.
 *
 * Two was enough while the wall was inset to a 1240px measure, because one
 * run of even the shortest ribbon out-measured the visible box. Full bleed
 * broke that: the middle ribbon carries five topics, one run of it is now
 * narrower than a wide viewport, and the tail of the loop showed as a gap
 * of empty paper before the duplicate arrived.
 *
 * With N equal runs the seam is at exactly 100/N percent of the track, and
 * the loop is gapless as long as (N-1) runs out-measure the viewport. Four
 * clears a 2560px screen on the shortest ribbon with room to spare.
 *
 * Exported so the .tsx renders exactly this many and the two can never
 * disagree — a mismatch here is precisely the bug above.
 */
export const MARQUEE_COPIES = 4;

/* translate3d, not translateX: it keeps the track on its own compositor
   layer for the whole loop. With translateX the ribbons were re-rasterising
   on the main thread and stuttering against each other. */
const driftLeft = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-25%, 0, 0); }
`;

const driftRight = keyframes`
  from { transform: translate3d(-25%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
`;

/* Applied by both the reduced-motion and the touch query — one definition
   so the two can never drift apart.

   The stilled wall is a static block, so it takes the page's Measure
   geometry back (the Wrap zeroed its gutter for the bleed): without this
   the wrapped words started at viewport x=0 underneath the Wall's edge
   feather, which washed out every row's first letters on phones —
   "Web Development" read "Veb Development" (011-landing B4). */
const stilled = css`
  animation: none;
  width: 100%;
  flex-wrap: wrap;
  max-width: calc(${MEASURE} + (2 * var(--space-8)));
  margin: 0 auto;
  padding: 0 var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    max-width: calc(${MEASURE} + (2 * var(--space-5)));
    padding: 0 var(--space-5);
  }
`;

/* The section keeps its vertical rhythm but drops its horizontal pad: the
   drifting ribbons run edge to edge, so the wall has no visible end and the
   claim ("there is a LOT of this") is made by the horizon rather than by
   the word count. The head keeps a measure — only the wall goes full bleed. */
export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  /* Same vertical rhythm as every other section; the horizontal gutter is
     deliberately zero so the ribbons can run to the viewport edge. The head
     and foot get it back via Measure below, so the type still lands on the
     page's shared axis and only the wall escapes it. */
  ${sectionRhythm}
  padding-left: 0;
  padding-right: 0;
  background: ${(p) => p.theme.colors.background};

  /* sectionRhythm's own tabletLarge block re-declares the shorthand, which
     puts the gutter back. Zero it there too or the wall stops bleeding below
     tabletLarge — and the head then sits at 40px against everyone else's 20. */
  ${(p) => p.theme.media.tabletLarge} {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const Inner = styled.div`
  width: 100%;
`;

/* Head and foot stay on the page's measure and keep the pad the Wrap gave
   up, so only the ribbons are full-bleed. */
export const Measure = styled.div`
  width: 100%;
  /* Was 1240px — the widest container on the page, which put this section's
     head 28px outside everyone else's left edge. */
  max-width: calc(${MEASURE} + (2 * var(--space-8)));
  margin: 0 auto;
  padding: 0 var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    max-width: calc(${MEASURE} + (2 * var(--space-5)));
    padding: 0 var(--space-5);
  }
`;

export const Head = styled(motion.div)`
  ${headBlockRhythm}
`;

export const Eyebrow = styled.span`
  ${eyebrowType}
`;

export const Headline = styled.h2`
  ${headingType}
`;

export const Wall = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border-top: 1px solid ${(p) => p.theme.colors.border};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  padding: var(--space-10) 0;

  /* Full bleed means a word is always mid-exit at each edge, so both ends
     are feathered — the wall reads as continuing past the frame instead of
     being sliced by it.

     Done with two painted gradients rather than a mask-image: a mask on
     this element composites the entire moving wall through an extra layer
     every frame, which is what made the drift stutter. These are static
     overlays the compositor can leave alone, and they read the theme's own
     background token so they work in light and dark without knowing which
     one they are in. */
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    width: clamp(48px, 7vw, 160px);
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(
      90deg,
      ${(p) => p.theme.colors.background} 0%,
      transparent 100%
    );
  }

  &::after {
    right: 0;
    background: linear-gradient(
      270deg,
      ${(p) => p.theme.colors.background} 0%,
      transparent 100%
    );
  }

  ${(p) => p.theme.media.tabletLarge} {
    gap: var(--space-4);
    padding: var(--space-6) 0;
  }

  /* The feathers exist to soften words mid-exit at the bleed edges. In
     the stilled, wrapped form nothing moves and nothing bleeds — the
     same gradients just sat on top of the first and last characters of
     every row (011-landing B4). */
  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      display: none;
    }
  }

  ${(p) => p.theme.media.touch} {
    &::before,
    &::after {
      display: none;
    }
  }
`;

export const Ribbon = styled.div`
  overflow: hidden;
`;

export const Track = styled.div<{ $right: boolean; $seconds: number }>`
  display: flex;
  width: max-content;
  will-change: transform;
  /* Pins the layer and stops the half-pixel shimmer on the serif edges. */
  backface-visibility: hidden;
  animation: ${(p) => (p.$right ? driftRight : driftLeft)} ${(p) => p.$seconds}s linear infinite;

  ${(p) => p.theme.media.hover} {
    ${Ribbon}:hover & {
      animation-play-state: paused;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ${stilled}
  }

  ${(p) => p.theme.media.touch} {
    ${stilled}
  }
`;

export const Run = styled.div<{ $ghost: boolean }>`
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  gap: var(--space-6);
  padding-right: var(--space-6);

  @media (prefers-reduced-motion: reduce) {
    flex-wrap: wrap;
    flex-shrink: 1;
    ${(p) => p.$ghost && 'display: none;'}
  }

  ${(p) => p.theme.media.touch} {
    flex-wrap: wrap;
    flex-shrink: 1;
    ${(p) => p.$ghost && 'display: none;'}
  }
`;

const wordType = css`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 600;
  letter-spacing: -0.018em;
  line-height: 1.15;
  white-space: nowrap;
`;

export const Word = styled.button<{ $size: string }>`
  ${wordType}
  padding: 0;
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  font-size: ${(p) => p.$size};
  color: ${(p) => p.theme.colors.foreground};
  transition: color 0.15s, border-color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.tertiaryText};
      border-bottom-color: ${(p) => p.theme.colors.tertiary};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 3px;
  }
`;

/* The duplicated run exists only so the loop has no seam; it is never a
   click target and never reaches the accessibility tree. */
/* The loop's second run. It used to be a span, which meant half the words
   on screen at any moment were dead to the pointer — a wall of clickable
   topics where every other one silently did nothing.

   It is now the same button as the real run (so it inherits the hover and
   focus treatment verbatim) but held out of the accessibility tree and the
   tab order by the .tsx. Every visible word is clickable; each topic is
   still announced and tabbed to exactly once. */
export const Ghost = styled(Word)``;

/* Separators earn their place in a single running line; in the wrapped,
   stilled form they only strand lozenges at the ends of lines. */
export const Sep = styled.span`
  flex-shrink: 0;
  align-self: center;
  font-size: 0.5rem;
  color: ${(p) => p.theme.colors.tertiary};

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }

  ${(p) => p.theme.media.touch} {
    display: none;
  }
`;

export const Foot = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  padding-top: var(--space-10);
`;

export const Cta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: ${(p) => p.theme.colors.accent};
  border-bottom: 1px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.accent} 45%, transparent)`};
  transition: color 0.15s, border-color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accentHover};
      border-bottom-color: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 3px;
  }
`;
