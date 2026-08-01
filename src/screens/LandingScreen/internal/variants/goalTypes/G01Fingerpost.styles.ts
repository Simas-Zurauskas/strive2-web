'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colorsLib, themeColors } from '@/theme/theme';
import { MEASURE, headBlockRhythm, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType, ledeType, onPlate } from '../../_system/typography';

/* ── GOAL TYPES 01 · The Fingerpost ────────────────────────
   Design logic: a crossroads signpost. "Pick yours" is literally a
   direction question, so the section is built as the object that answers
   it — one post, four pointed arms alternating left and right, each plank
   bearing a reason and the goal a learner would actually type.

   Nothing here is a card, a tile or a row. The arms are cut with
   'clip-path', hang off the post at different heights, and swing into
   place from the post rather than fading in — an object being erected, not
   a grid being populated.

   The post carries the composition's height, so this is the tallest of the
   five candidates on desktop by design. Below 'tabletLarge' the crossroads
   is abandoned rather than squeezed: the post moves hard left and every
   arm points the same way, which is the only honest phone form for it. */

/* THEME-STABLE PLATE — adopted from variant 03 (The Letterbox) at review's
   request: the fingerpost's ARRANGEMENT with the letterbox's COLOUR. A post
   at dusk, not a signboard in a showroom.

   Read straight off the brand palette module rather than written as
   literals, and NOT from the inverting theme tokens: 'foreground' is
   near-black in light and near-white in dark, so a plate built from it
   would flip and the white arms would vanish. Same technique, same reason,
   as 'ProblemSection' and 'G03Letterbox'. */
const PLATE = colorsLib.primary;
const PLATE_DEEP = colorsLib.primaryHover;
const INK_CREAM = colorsLib.cream;
const INK_GOLD = themeColors.dark.tertiary;

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${sectionRhythm}
  background: ${PLATE};
`;

export const Inner = styled.div`
  width: 100%;
  /* Was 1080px, which sat the post 20px inside the page's axis. */
  max-width: ${MEASURE};
`;

export const Head = styled(motion.div)`
  ${headBlockRhythm}
  align-items: center;
  text-align: center;

  ${(p) => p.theme.media.tabletLarge} {
    align-items: flex-start;
    text-align: left;
  }
`;

/* Cream, not gold. The gold-on-plate eyebrow this replaces measured ~3.5:1
   against PLATE — below the 4.5:1 the theme's own tertiaryText token exists to
   guarantee, and a tracked 11px label is exactly the case that rule is for.
   Cream at 78% clears it comfortably while staying quieter than the heading. */
export const Eyebrow = styled.span`
  ${eyebrowType}
  ${onPlate.eyebrow(INK_CREAM)}
`;

export const Headline = styled.h2`
  ${headingType}
  ${onPlate.heading(INK_CREAM, INK_GOLD)}
`;

/* The mechanic line — the one sentence that says the four planks are a real
   wizard setting, not marketing personas (Simas, 2026-08-01). ledeType's
   muted token fails on the plate, so it takes cream at 75% — the same
   floor Bend cleared at 13px, comfortable at this 17px size. */
export const Lede = styled.p`
  ${ledeType}
  margin: 0 auto;
  color: ${`color-mix(in srgb, ${INK_CREAM} 75%, transparent)`};

  ${(p) => p.theme.media.tabletLarge} {
    margin: 0;
  }
`;

/* A two-lane grid rather than a fixed-height stage with absolutely placed
   arms. The arms used to sit at hard 'top: 8/31/54/77%' inside 540px, which
   held only while each plank was a label and one line; once the arms gained
   "who it's for" and "how it steers", they grew past their slots and
   overlapped into a single translucent block.

   Grid rows size to whatever the copy needs and can never collide, the
   alternation is 'grid-column' instead of arithmetic, and the post still
   hangs absolutely down the centre lane. */
/* motion.div: carries the section's single whileInView trigger and hands
   the variant state down to Post/Finial/Arm — see the component's ONE
   TRIGGER, NOT SIX note. */
export const Crossroads = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 14px 1fr;
  align-items: center;
  row-gap: var(--space-6);

  ${(p) => p.theme.media.tabletLarge} {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-left: 30px;
  }
`;

export const Post = styled(motion.span)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 14px;
  margin-left: -7px;
  transform-origin: center top;
  border-radius: 2px;
  background: ${`color-mix(in srgb, ${INK_CREAM} 14%, ${PLATE_DEEP})`};
  border: 1px solid ${`color-mix(in srgb, ${INK_CREAM} 22%, transparent)`};

  ${(p) => p.theme.media.tabletLarge} {
    left: 7px;
    width: 10px;
    margin-left: 0;
  }
`;

/* Finial: a small gold lozenge capping the post. */
export const Finial = styled(motion.span)`
  position: absolute;
  top: -9px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 2px;
  background: ${INK_GOLD};

  ${(p) => p.theme.media.tabletLarge} {
    left: 7px;
    margin-left: -7px;
  }
`;

/* Cut planks. The point is on the outward end; the blunt end butts against
   the post, which is also where the swing pivots from. */
export const Arm = styled(motion.div)<{ $i: 0 | 1 | 2 | 3; $right: boolean }>`
  position: relative;
  /* One row each, alternating lanes — the plank's height is its copy's
     height, so a longer "how it steers" line lengthens the plank instead
     of running it into the one below. A span-2 interleave was tried
     (011-landing Q6) and REVERTED on Simas's call 2026-08-01: with the
     mechanic lede above, the overlapped planks read as squeezed. The
     full-row rhythm is the intended look — do not re-tighten. */
  grid-row: ${(p) => p.$i + 1};
  padding: var(--space-5) var(--space-6);
  background: ${`color-mix(in srgb, ${INK_CREAM} 6%, ${PLATE})`};
  border: 1px solid ${`color-mix(in srgb, ${INK_CREAM} 20%, transparent)`};

  ${(p) =>
    p.$right
      ? `
        grid-column: 3;
        margin-left: 6px;
        padding-right: 52px;
        clip-path: polygon(0 0, calc(100% - 34px) 0, 100% 50%, calc(100% - 34px) 100%, 0 100%);
        transform-origin: left center;
      `
      : `
        grid-column: 1;
        margin-right: 6px;
        padding-left: 52px;
        clip-path: polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 50%);
        transform-origin: right center;
      `}

  ${(p) => p.theme.media.tabletLarge} {
    grid-row: auto;
    grid-column: auto;
    width: auto;
    margin: 0;
    padding: var(--space-4) 44px var(--space-4) var(--space-5);
    clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%);
    transform-origin: left center;
  }
`;

/* Two bolt heads where the plank meets the post. */
export const Bolts = styled.span<{ $right: boolean }>`
  position: absolute;
  top: 50%;
  ${(p) => (p.$right ? 'left: 14px;' : 'right: 14px;')}
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: -9px;

  &::before,
  &::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${`color-mix(in srgb, ${INK_CREAM} 30%, transparent)`};
  }

  ${(p) => p.theme.media.tabletLarge} {
    left: 10px;
    right: auto;
  }
`;

export const ArmBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  padding-left: var(--space-4);

  ${(p) => p.theme.media.tabletLarge} {
    padding-left: var(--space-4);
  }
`;

export const Label = styled.h3`
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  line-height: 1.1;
  letter-spacing: -0.016em;
  text-transform: uppercase;
  color: ${INK_CREAM};
`;

/* Who this direction is for + how it bends the whole course — added when
   review asked the section to explain the four steers, not only name them. */
export const Who = styled.p`
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid ${`color-mix(in srgb, ${INK_CREAM} 18%, transparent)`};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${INK_CREAM};
`;

export const Bend = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  /* 75%, not the 62% it shipped at: composited over the arm's own ground
     (cream 6% over PLATE) 62% measured 3.7:1 and even 70% only 4.3:1 —
     75% is the first stop past the 4.5:1 floor for 13px text
     (011-landing B6). */
  color: ${`color-mix(in srgb, ${INK_CREAM} 75%, transparent)`};
`;
