'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MEASURE, headBlockRhythm, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType, ledeType } from '../../_system/typography';

/* ── ROADMAP 04 · The Strip ────────────────────────────────
   Design logic: physicality. The four steps are not four items in a
   layout — they are four stubs of one printed docket, divided by
   perforations, punched at each seam, tilted half a degree off true and
   dropping a real shadow. The numerals are struck as rotated stamps.

   The argument the object makes is "these are parts of one thing", which
   is exactly the thing a row of four separate cards fails to say.

   The punched notches are filled with the band's own background colour, so
   the expression is repeated verbatim in 'NOTCH_FILL' — if the band tint
   changes, the punches must change with it or they stop reading as holes. */

const NOTCH_FILL = (tertiary: string, background: string) =>
  `color-mix(in srgb, ${tertiary} 6%, ${background})`;

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${sectionRhythm}
  background: ${(p) => NOTCH_FILL(p.theme.colors.tertiary, p.theme.colors.background)};
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Inner = styled.div`
  width: 100%;
  /* Was 1160px — 40px wider than every other section, which put the docket's
     edges 20px outside the page's axis on each side. */
  max-width: ${MEASURE};
`;

export const Head = styled(motion.div)`
  ${headBlockRhythm}
  align-items: center;
  text-align: center;
`;

export const Eyebrow = styled.span`
  ${eyebrowType}
`;

export const Headline = styled.h2`
  ${headingType}
  max-width: 24ch;
`;

/* One docket. The inset hairline is the ticket's own safety rule. */
export const Strip = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lift-strong);

  &::after {
    content: '';
    position: absolute;
    inset: 7px;
    pointer-events: none;
    border: 1px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 26%, transparent)`};
    border-radius: 2px;
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Stub = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-10) var(--space-6) var(--space-8);
  min-width: 0;

  /* Stacked docket (phone): the seal moves beside the step title instead
     of sitting alone on its own row — the number reads with its step at a
     glance and each stub sheds ~65px of air. The line keeps the full stub
     measure beneath both (011-landing, mobile pass). */
  ${(p) => p.theme.media.tabletLarge} {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: var(--space-4);
    row-gap: var(--space-2);
    padding: var(--space-6);
  }
`;

/* The seam: a dashed rule with a punch at each end. Vertical between
   stubs on the docket, horizontal once the docket stacks. */
export const Perf = styled(motion.span)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  border-left: 2px dashed ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 20%, transparent)`};

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: -9px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(p) => NOTCH_FILL(p.theme.colors.tertiary, p.theme.colors.background)};
  }
  &::before {
    top: -9px;
  }
  &::after {
    bottom: -9px;
  }

  ${(p) => p.theme.media.tabletLarge} {
    top: 0;
    bottom: auto;
    left: 0;
    right: 0;
    width: auto;
    height: 0;
    border-left: none;
    border-top: 2px dashed
      ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 20%, transparent)`};

    &::before,
    &::after {
      top: -9px;
      bottom: auto;
      left: auto;
    }
    &::before {
      left: -9px;
    }
    &::after {
      right: -9px;
    }
  }
`;

/* Struck, not set: a rotated oval seal with a double ring. */
export const Stamp = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 48px;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  box-shadow:
    inset 0 0 0 2px ${(p) => p.theme.colors.surface},
    inset 0 0 0 3px ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 40%, transparent)`};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiaryText};
  font-variant-numeric: tabular-nums;

  ${(p) => p.theme.media.tabletLarge} {
    margin-bottom: 0;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 600;
  font-size: 1.375rem;
  line-height: 1.15;
  letter-spacing: -0.012em;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Line = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};

  ${(p) => p.theme.media.tabletLarge} {
    grid-column: 1 / -1;
  }
`;

/* The shipped subhead. Sits under the heading on the same measure, one step
   down in weight — the docket below is the picture, this is the sentence
   that tells you what you are looking at. */
export const Subhead = styled.p`
  ${ledeType}
`;
