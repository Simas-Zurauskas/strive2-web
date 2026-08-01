'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

/* The page's single dark moment: the emotional pivot of the whole argument
   ("everything you learn evaporates") set as a full-bleed print pull-quote —
   cream ink on deep forest. Theme-stable literals on purpose: the band is
   dark in both themes, like a printed plate, so light-theme tokens must not
   leak in. */
const BAND_INK = '#1e3d31';
const BAND_CREAM = '#faf9f7';
const BAND_GOLD = '#c4a265';

export const Wrap = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-16) var(--space-8);
  background: ${BAND_INK};
  overflow: hidden;

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-10) var(--space-5);
  }
`;

export const Inner = styled(motion.div)`
  position: relative;
  max-width: 880px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  text-align: center;
`;

/* Oversized printers' quotation mark — decorative plate ornament.

   Deliberately in flow (it used to be absolutely positioned at
   'top: -0.55em'). A negative lift is measured against the ornament's own
   font-size, which grows with the viewport, while the band's top padding is
   fixed — at 4rem desktop and 2.5rem below the tabletLarge breakpoint the
   lift outgrew it, the glyph crossed the band's top edge, and 'overflow:
   hidden' on Wrap sheared it flat. In flow, the band's padding always
   contains the ornament at every width.

   The tuck under the heading is recovered with a negative bottom margin
   instead: the glyph's ink only occupies the top ~30% of its line box, so
   the rest is dead space that would otherwise read as a gap. */
export const QuoteMark = styled.span`
  display: block;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: clamp(5rem, 11vw, 8rem);
  line-height: 0.7;
  margin-bottom: calc(-0.28em - var(--space-5));
  color: ${BAND_GOLD};
  opacity: 0.3;
  pointer-events: none;
  user-select: none;
`;

export const Heading = styled.h2`
  position: relative;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(2.25rem, 5.5vw, 3.75rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: ${BAND_CREAM};
  margin: 0;
  text-wrap: balance;

  em {
    font-style: italic;
    color: ${BAND_GOLD};
  }
`;

export const Body = styled.p`
  font-size: 1.0625rem;
  line-height: 1.65;
  color: ${BAND_CREAM};
  opacity: 0.78;
  margin: 0 auto;
  max-width: 600px;
`;
