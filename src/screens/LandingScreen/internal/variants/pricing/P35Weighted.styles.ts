'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MEASURE, headBlockRhythm, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType } from '../../_system/typography';

/* ── PRICING · 35 — Weighted ───────────────────────────────
   Variant 16 with the bullet list replaced by the plan's own sentence, and
   the card given material presence: a defined surface, a border that is
   actually drawn rather than implied, one soft elevation at rest that
   steps up once on hover, and a denser internal rhythm than 34's.

   THREE ZONES, TWO FULL-BLEED RULES. Name and price above, the sentence in
   the middle, the estimate and the button below. The rules run edge to
   edge — negative margins equal to the card padding — so they read as
   structure holding the card together rather than as decoration set inside
   it. That is where the weight comes from; there is no tint and no badge.

   THE SENTENCE IS CLAMPED TO SEVEN LINES, ON PURPOSE. This is the
   deliberate answer to the description's variable length: at the
   three-column measure the longest catalog blurb sets in seven lines, so
   the clamp is a floor and a ceiling at once — every card's paragraph is
   the same block, exactly, and the two rules below it sit on one line
   across the row without any card having to grow. Nothing is shortened in
   JavaScript; the string is rendered whole and CSS decides how much of it
   is shown. Variant 34 is the un-clamped answer to the same question.

   BELOW THE THREE-COLUMN MEASURE THE CLAMP IS DROPPED. A clamp that hides
   half a sentence is worse than an uneven card, so from the desktop
   breakpoint down the paragraph is un-clamped and alignment is handed to
   the one growing item in the card instead — same result, no clipping.

   PHONE. One column, the sentence at full length and a wider measure, and
   the card's floor released: the floor exists to equalise a row of three,
   and at 375px there is no row. */

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  ${sectionRhythm}
  background: ${(p) => p.theme.colors.background};
`;

/* The one scroll-triggered gesture in the section, exactly as 16 has it —
   head, cards and foot rise once as a single object. */
export const Inner = styled(motion.div)`
  width: 100%;
  max-width: ${MEASURE};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Head = styled.header`
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

/* Tighter gutter than 34's: three heavy objects standing close together
   read as one row, and this variant wants the row to feel built. */
export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  /* space-6, up from space-4 — at 16px the three cards read as one slab
     (Simas, 2026-08-01: "increase gap of these horizontally a bit"). */
  gap: var(--space-6);

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`;

/* The cell: pointer target and backing sheet. It never transforms itself.

   Variant 33's stack, at review's request, with the travel pulled well in:
   33 rested at 10px and opened to 18px, which reads as a card sliding off
   its shadow. Here the plane rests at 6px and opens to 10px — the same
   layered-material idea, but a shift you notice rather than one that
   performs.

   A pseudo-element rather than a node: it carries no text and announces
   nothing, so a screen reader should not have to step over an empty div
   per card to reach the price. */
export const Frame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: ${(p) =>
      `color-mix(in srgb, ${p.theme.colors.tertiary} 10%, ${p.theme.colors.surface})`};
    border: 1px solid
      ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 34%, ${p.theme.colors.surfaceBorder})`};
    /* Whole pixels, and no text on this plane, so a permanent transform
       costs nothing in rendering quality. */
    transform: translate3d(6px, 6px, 0);
    pointer-events: none;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${(p) => p.theme.media.hover} {
    &:hover::before {
      transform: translate3d(10px, 10px, 0);
      transition-duration: 380ms;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  /* Keyboard earns exactly what the pointer earns. */
  &:has(:focus-visible)::before {
    transform: translate3d(10px, 10px, 0);
  }

  /* Motion off: the plane keeps its resting offset, so the card still
     reads as two layers — only the travel is gone. */
  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }

    /* Split deliberately: the hover half is gated behind the hover-capability
       query so a tap doesn't strand the offset, but the focus half must stay
       ungated or keyboard users lose the affordance on touch devices. */
    ${(p) => p.theme.media.hover} {
      &:hover::before {
        transform: translate3d(6px, 6px, 0);
      }
    }

    &:has(:focus-visible)::before {
      transform: translate3d(6px, 6px, 0);
    }
  }
`;

export const Card = styled.div`
  /* Above the backing plane — a static child would paint beneath an
     absolutely positioned pseudo-element and the tint would cover it. */
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  /* Safety floor only — content (fixed rows + the 4-line description
     block) governs the height at ~23.5rem. Kept a notch below that so
     flex-grow never injects blank space back into the description
     (011-landing B1; was 26rem against a 7-line reservation). */
  min-height: 23rem;
  padding: var(--space-6);
  background: ${(p) => p.theme.colors.surface};
  /* A border with a little more ink in it than the hairline 16 draws —
     the card should have an edge you can see without looking for it. */
  border: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 12%, ${p.theme.colors.surfaceBorder})`};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-soft);
  transition:
    transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 200ms ease,
    box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);

  ${(p) => p.theme.media.hover} {
    ${Frame}:hover & {
      /* Against the backing, not with it — half 33's travel, so the two
         planes part by 8px in total rather than 16px. */
      transform: translate3d(-2px, -2px, 0);
      border-color: ${(p) =>
        `color-mix(in srgb, ${p.theme.colors.tertiary} 42%, ${p.theme.colors.surfaceBorder})`};
      box-shadow: var(--shadow-lift-strong);
      /* Only while it is actually moving. */
      will-change: transform;
      transition-duration: 380ms;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  /* The keyboard gets the same step up the pointer earns. */
  ${Frame}:has(:focus-visible) & {
    transform: translate3d(-2px, -2px, 0);
    border-color: ${(p) =>
      `color-mix(in srgb, ${p.theme.colors.tertiary} 42%, ${p.theme.colors.surfaceBorder})`};
    box-shadow: var(--shadow-lift-strong);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    /* Split for the same reason as the ::before rule above — the hover half
       is gated, the focus half is not. Benign either way here (this block
       only runs under prefers-reduced-motion and its effect is to REMOVE
       motion), but kept consistent so the rule reads the same everywhere. */
    ${(p) => p.theme.media.hover} {
      ${Frame}:hover & {
        transform: none;
      }
    }

    ${Frame}:has(:focus-visible) & {
      transform: none;
    }
  }

  ${(p) => p.theme.media.tabletLarge} {
    min-height: 0;
  }
`;

export const PlanName = styled.h3`
  margin: 0;
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiaryText};
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
`;

export const Price = styled.span`
  font-size: clamp(2.125rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  /* The three prices must share stems — comparing them is the whole job. */
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Per = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.muted};
`;

/* Full-bleed: negative margins equal to the card padding. Two of these
   part the card into its three zones. */
export const Rule = styled.div`
  height: 1px;
  margin-left: calc(-1 * var(--space-6));
  margin-right: calc(-1 * var(--space-6));
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.surfaceBorder} 90%, transparent)`};
`;

export const RuleTop = styled(Rule)`
  margin-top: var(--space-5);
  margin-bottom: var(--space-5);
`;

export const RuleBottom = styled(Rule)`
  margin-top: var(--space-5);
  margin-bottom: var(--space-4);
`;

/* THE MIDDLE ZONE.

   `flex: 1 0 auto` is what holds the row together below the desktop
   breakpoint, where the clamp is dropped: the paragraph is the only
   growing item in the card, so it absorbs the grid's equal-height stretch
   and everything under it stays on one line.

   At the three-column measure the clamp does the same job more exactly —
   floor and ceiling, so all three paragraphs are one block. FIVE lines,
   not seven (011-landing B1): the 7-line reservation held ~3 blank lines
   of air in every card. Five — not four — because two catalog copies are
   in circulation: the shortened blurbs in the API working tree set ≤4
   lines here, but the catalog PRODUCTION still serves sets ≤5, and the
   landing must not clip either one whichever deploys first (011-landing
   final review, finding 1). Once the shortened API copy is live,
   re-measure and consider 4. */
export const Description = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  overflow: hidden;
  flex: 1 0 auto;
  margin: 0;
  min-height: 8.25em;
  font-size: 0.9375rem;
  line-height: 1.65;
  letter-spacing: -0.002em;
  text-wrap: pretty;
  color: ${(p) => p.theme.colors.muted};

  ${(p) => p.theme.media.desktop} {
    /* Below the three-column measure seven lines can no longer hold the
       sentence — drop the clamp rather than clip it, and let the growing
       item keep the row aligned instead. */
    display: block;
    -webkit-line-clamp: unset;
    line-clamp: unset;
    overflow: visible;
    min-height: 0;
  }

  ${(p) => p.theme.media.tabletLarge} {
    font-size: 1rem;
    line-height: 1.7;
    max-width: 60ch;
  }
`;

export const Allowance = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
`;

/* No `margin-top: auto` — an auto margin would eat the free space before
   the paragraph's flex-grow ever saw it, and the paragraph is the item
   that should be absorbing it. The button lands on the bottom edge either
   way, and the three land together. */
export const CtaSlot = styled.div`
  padding-top: var(--space-5);

  & > button {
    width: 100%;
    min-height: 2.875rem;
  }
`;

/* The sanctioned standing claim, stated once for the whole row — a line
   set inside a card would read as belonging to that tier. */
export const Claim = styled.p`
  margin: var(--space-8) 0 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  text-align: center;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Micro = styled.p`
  margin: var(--space-2) 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
`;

export const Foot = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  margin-top: var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    flex-direction: column;
    gap: var(--space-4);
  }
`;

export const Compare = styled.a`
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accentHover};
      text-decoration: underline;
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

/* ── Skeleton ───────────────────────────────────────────── */

/* The loaded card's exact geometry — min-height, padding, border weight,
   radius and resting elevation — so the catalog arriving costs zero
   layout shift. */
export const SkCard = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 23rem;
  padding: var(--space-6);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 12%, ${p.theme.colors.surfaceBorder})`};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-soft);

  ${(p) => p.theme.media.tabletLarge} {
    min-height: 0;
  }
`;

export const SkName = styled.div`
  margin-bottom: var(--space-3);
`;

/* Same floor and same growth rule as the real paragraph, so the tall
   middle zone is already the right size before the strings arrive.
   Stated in rem, not em: this div inherits the 16px root size while
   Description's em resolves against its own 0.9375rem type, so a shared
   em figure left the skeleton ~6.6px taller than the loaded card
   (011-landing final review, finding 4). 7.734375rem = Description's
   8.25em × 0.9375rem, exactly. */
export const SkDesc = styled.div`
  flex: 1 0 auto;
  min-height: 7.734375rem;
  display: flex;
  flex-direction: column;
  gap: 0.62rem;

  ${(p) => p.theme.media.desktop} {
    min-height: 0;
  }
`;

export const SkCta = styled.div`
  padding-top: var(--space-5);
`;
