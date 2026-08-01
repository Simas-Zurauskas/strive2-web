'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MEASURE, headBlockRhythm, sectionRhythm } from '../../_system/section';
import { eyebrowType, headingType } from '../../_system/typography';

/* ── FAQ · 08 — The Reading Spread ─────────────────────────
   A reference spread. Nine entries run down the verso as a register;
   choosing one sets its gloss on the facing recto, the way a
   dictionary or a critical edition pairs the entry with its note. The
   register is the composition — the section is fully scannable with
   nothing open, which is the point of the whole treatment.

   COLLAPSED BY DEFAULT. Nothing is set on the leaf until an entry is
   chosen; the recto starts as a blank leaf. There is no "first answer
   pre-opened" here (variant 02 does that) — a visitor should meet nine
   questions, not one answer plus eight questions.

   THE DESKTOP TRICK, AND WHY IT IS WORTH IT. The DOM is flat and
   interleaved — entry, leaf, entry, leaf — so keyboard and screen-reader
   order is always "question then its own answer", which is what a
   disclosure list must be. The two-column spread is then made purely in
   CSS: entries are placed in column 1, and each leaf is an
   absolutely-positioned grid child whose containing block is the column-2
   grid area. Being out of flow, a leaf cannot stretch the register's rows
   as it opens, so choosing an entry never reflows the list beside it.
   The alternative — a <Register> wrapper and a <Pages> wrapper, as in
   variant 02 — cannot interleave on a phone without `display: contents`
   plus `order`, which would leave the visual order and the accessibility
   order disagreeing. Correctness beat convenience.

   The one cost of taking the leaves out of flow is that column 2 no
   longer contributes height, so the spread carries a desktop `min-height`
   large enough for the longest gloss. The register (nine rows) is taller
   than that in practice; the min-height is the guard, not the driver.

   PHONE FORM. There is no facing page on a 360px screen — a "recto" a
   third of the viewport wide is not a reading measure, it is a column of
   orphans. Below tabletLarge the leaves drop back into normal flow
   directly beneath their own entry and the whole thing reads as an
   ordinary single-column disclosure list: same markup, same state, same
   collapsed default, a different drawing. The plate, the running head and
   the repeated title all switch off there, since the question is already
   sitting one line above. */

export const Wrap = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  ${sectionRhythm}
  background: ${(p) => p.theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${MEASURE};
`;

export const Head = styled(motion.header)`
  ${headBlockRhythm}
`;

export const Eyebrow = styled.span`
  ${eyebrowType}
`;

export const Headline = styled.h2`
  ${headingType}
`;

/* The head rule of a reference page: one heavy, one hair, running the
   full measure of the spread rather than one column. */
export const HeadRule = styled.div`
  height: 5px;
  margin-bottom: clamp(var(--space-5), 2.5vw, var(--space-8));
  border-top: 2px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 55%, transparent)`};
  border-bottom: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 16%, transparent)`};
`;

export const Spread = styled.div`
  --gutter: clamp(var(--space-6), 4vw, var(--space-12));
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.28fr);
  column-gap: var(--gutter);
  align-content: start;
  /* Reserves the recto: the leaves are out of flow and cannot do it
     themselves. Sized past the longest gloss set at this measure, so an
     open leaf never spills into the section below. */
  min-height: clamp(30rem, 42vw, 38rem);

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }
`;

export const Entry = styled(motion.button)<{ $active: boolean }>`
  position: relative;
  grid-column: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  /* More air per row now the numeral column is gone — the questions are
     the only thing in this column, so they get the room. */
  padding: var(--space-4) 0;
  border: none;
  border-bottom: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 10%, transparent)`};
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  transition: color 0.15s;

  /* The tie-line: a hairline reaching across the gutter from the chosen
     entry to its leaf, the way a reference table rules an entry to its
     gloss. Decorative only — aria-expanded carries the state. */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: calc(-1 * var(--gutter));
    width: var(--gutter);
    height: 1px;
    background: ${(p) => p.theme.colors.tertiary};
    transform: scaleX(${(p) => (p.$active ? 1 : 0)});
    transform-origin: right center;
    transition: transform 0.3s ease;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after {
      transition: none;
    }
  }

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-4) 0;

    &::after {
      display: none;
    }
  }
`;

/* The questions ARE the composition in the closed state, so they are set to
   be read, not scanned as UI: a step up in size, the heading serif, and
   full foreground colour at rest (the row's muted colour previously made
   every unselected question look disabled). Weight, not colour, marks the
   open one — colour alone would be the only state signal and it is already
   doing work here. */
export const EntryText = styled.span<{ $active: boolean }>`
  min-width: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: clamp(1.0625rem, 1.5vw, 1.1875rem);
  line-height: 1.35;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  letter-spacing: -0.012em;
  color: ${(p) => p.theme.colors.foreground};
`;

/* The leaf. Absolutely positioned into the column-2 grid area on desktop,
   back in normal flow on a phone. Open/close is the house
   `grid-template-rows: 0fr → 1fr` clip, so every answer stays in the DOM
   and in the accessibility tree whether or not it is showing. */
export const Leaf = styled.div<{ $open: boolean }>`
  position: absolute;
  grid-column: 2;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.34s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  ${(p) => p.theme.media.tabletLarge} {
    position: static;
    grid-column: 1;
  }
`;

export const LeafClip = styled.div`
  overflow: hidden;
`;

export const LeafInner = styled.div<{ $open: boolean }>`
  padding: clamp(var(--space-5), 2.4vw, var(--space-8));
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-top: 2px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 70%, transparent)`};
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transform: translateX(${(p) => (p.$open ? '0' : '-6px')});
  transition:
    opacity 0.28s ease 0.06s,
    transform 0.34s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* A plate under every row would read as nine cards; the phone form is a
     list, so the leaf loses its paper and keeps only its measure. */
  ${(p) => p.theme.media.tabletLarge} {
    padding: 0 0 var(--space-5);
    background: none;
    border: none;
  }
`;

export const RunningHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid
    ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 12%, transparent)`};

  ${(p) => p.theme.media.tabletLarge} {
    display: none;
  }
`;

export const RunningLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: ${(p) => p.theme.colors.muted};
`;

export const LeafTitle = styled.h3`
  margin: clamp(var(--space-4), 2vw, var(--space-6)) 0 var(--space-3);
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  line-height: 1.16;
  letter-spacing: -0.018em;
  color: ${(p) => p.theme.colors.foreground};

  /* Already read one line above as the trigger. */
  ${(p) => p.theme.media.tabletLarge} {
    display: none;
  }
`;

export const LeafBody = styled.p`
  margin: 0;
  max-width: 58ch;
  font-size: 1rem;
  line-height: 1.72;
  color: ${(p) => p.theme.colors.muted};

  ${(p) => p.theme.media.tabletLarge} {
    font-size: 0.9375rem;
    line-height: 1.65;
  }
`;

/* Standing note on the empty recto. Decorative and spatial ("at left"),
   and the buttons already carry their own state, so it is hidden from
   assistive tech rather than read out as an instruction that does not
   apply. */
export const BlankLeaf = styled.div`
  position: absolute;
  grid-column: 2;
  top: 0;
  left: 0;
  right: 0;
  padding: clamp(var(--space-5), 2.4vw, var(--space-8));
  border-top: 1px dashed ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 22%, transparent)`};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${(p) => `color-mix(in srgb, ${p.theme.colors.muted} 78%, transparent)`};

  ${(p) => p.theme.media.tabletLarge} {
    display: none;
  }
`;

