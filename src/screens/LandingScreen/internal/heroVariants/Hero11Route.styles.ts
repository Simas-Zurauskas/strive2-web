'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

/* ═══ 11 — THE SHIPPED HERO, IN A CHASE ══════════════════════════════
   Review, twice over: 11 should be the ORIGINAL hero — its copy, its
   columns, its proportions — with nothing around it but variant 02's
   chase and the full-screen height it has now.

   So this file no longer re-implements the hero. It is a shell: a page
   margin, a two-forme border, and a host that lets the real 'HeroSection'
   render inside it untouched. Every earlier re-cut — a heavier headline,
   an even column split, an enlarged route plate, an added sources line —
   is gone. Those re-cuts were the thing being rejected, and in any case a
   hand copy of a shipped component is a component that drifts from it.
   What prints inside this frame is literally variant 00.

   TWO FORMES, SAME AS 02. Everything gold is the second forme: the inner
   rule and its four quoins, sharing one register-slip animation in the
   .tsx so the gold prints as ONE plate. Ink — the outer hairline and the
   hero itself — never moves. That slip is the only motion this file adds;
   the rest of the composition's life is the hero's own (the route
   re-charting as the example goal rotates). */

export const Wrap = styled.section`
  position: relative;
  width: 100%;
  /* One screen minus the sticky nav, so the chase meets the bar instead of
     sliding under it. '--navbar-offset' is the bar's own height token. */
  min-height: calc(100vh - var(--navbar-offset));
  /* dvh where supported — vh overstates the viewport under mobile browser
     chrome and would push the chase's foot off-screen. */
  min-height: calc(100dvh - var(--navbar-offset));
  display: flex;
  align-items: stretch;
  /* The margin the chase floats in.
     This is the page gutter, not a scaling clamp. It was clamp(14px, 2.2vw,
     30px), which only equals the flat '--space-8' every other section uses at
     one viewport width — the two agreed at 1440px and nowhere else, so the
     hero headline drifted off the page's axis by ~11px at 900px and ~14px just
     above the tabletLarge boundary. Taking the same token makes the axis hold
     at every width; the 1px absorbs the chase's own border so it is the
     content edge, not the frame edge, that lines up. */
  padding: calc(var(--space-8) - 1px);
  /* …except at the head, where the nav bar is already 56px of empty stock.
     A full gutter there stacks on top of the bar and the frame reads as
     floating in a band twice the side gutter's width — optically lopsided
     even though the four paddings were literally equal. Tucking the chase up
     under the bar makes the visible white above the rule match the white
     beside it, which is the symmetry the eye actually measures. */
  padding-top: calc(var(--space-3) - 1px);
  background: ${(p) => p.theme.colors.background};

  /* No frame below tabletLarge (see Chase/GoldFrame), so nothing here has a
     border to absorb and no mat to float in: the hero takes the plain page
     gutter and lets its own vertical rhythm do the spacing. */
  ${(p) => p.theme.media.tabletLarge} {
    padding: 0 var(--space-5);
  }
`;

/* The outer forme: one hairline holding the whole page. */
export const Chase = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 22%, transparent)`};

  /* The chase is a printer's frame around a wide, two-column forme. On a
     phone the columns stack, the frame collapses to a tall thin box hugging
     the copy, and the margin it needs eats the width the headline wants. It
     carries no information, so below tabletLarge it simply doesn't print. */
  ${(p) => p.theme.media.tabletLarge} {
    border: none;
  }
`;

/* The gold forme. One element, not four pseudo-elements, precisely so the
   slip in the .tsx moves rule and quoins together. */
export const GoldFrame = styled(motion.div)`
  position: absolute;
  inset: 7px;
  pointer-events: none;
  border: 1px solid ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 62%, transparent)`};

  /* Second forme goes with the first — quoins are its children, so they
     leave with it. The .tsx still animates a hidden element; that is a
     transform on one display:none div, not worth branching the component. */
  ${(p) => p.theme.media.tabletLarge} {
    display: none;
  }
`;

export const Quoin = styled.span<{ $c: 0 | 1 | 2 | 3 }>`
  position: absolute;
  width: 9px;
  height: 9px;
  background: ${(p) => p.theme.colors.tertiary};
  ${(p) => (p.$c === 0 ? 'top: -5px; left: -5px;' : '')}
  ${(p) => (p.$c === 1 ? 'top: -5px; right: -5px;' : '')}
  ${(p) => (p.$c === 2 ? 'bottom: -5px; left: -5px;' : '')}
  ${(p) => (p.$c === 3 ? 'bottom: -5px; right: -5px;' : '')}
`;

/* Host for the real 'HeroSection'.

   The hero renders its own <section> carrying the site's standard vertical
   rhythm — right in the page flow, wrong inside a frame that already
   supplies the margin, where it reads as a double mat. This trims that pad
   and lets the hero centre itself in whatever height the chase has. It is
   the ONLY thing overridden: grid, type scale, route plate and goal form
   are the shipped ones, inherited rather than restated. */
export const HeroHost = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;

  /* The mat between the rule and the type.

     This has to live HERE and not on the hero's own '--hero-gutter', which
     stays 0 below. That gutter is padding on an element capped at MEASURE,
     so it eats the measure and walks the headline off the page's shared
     axis — the 192-vs-160 drift the token was introduced to fix. Padding the
     host instead sits OUTSIDE that cap: it narrows the box the measure is
     centred in, and a symmetric inset does not move a centre. Above ~1250px
     there is slack to spare and the axis is bit-for-bit what it was.

     Below that the measure is what the viewport allows, so with no mat the
     type ran onto the gold rule — flush at the chase edge, the eyebrow and
     the headline's stems crossing the line. 32px is the same figure as the
     margin outside the frame, so the chase reads as an even mat on both
     faces of the rule rather than a box the content is bursting out of. */
  padding: 0 var(--space-8);

  /* Two columns are already tight against the stacking breakpoint; a full
     mat each side is width the headline can't spare there. */
  ${(p) => p.theme.media.desktop} {
    padding: 0 var(--space-6);
  }

  /* No frame below tabletLarge, so no mat — the Wrap's own gutter is the
     page gutter and the type sits on it directly. */
  ${(p) => p.theme.media.tabletLarge} {
    padding: 0;
  }

  > section {
    flex: 1;
    align-items: center;
    padding: clamp(var(--space-6), 4vh, var(--space-12)) 0;
    /* The chase margin already IS the page gutter; without this the hero's
       own gutter would stack on top of it and shift the headline off axis. */
    --hero-gutter: 0px;
  }
`;
