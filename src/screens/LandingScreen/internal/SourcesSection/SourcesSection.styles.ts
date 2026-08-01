'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MEASURE, sectionRhythm } from '../_system/section';
import { displayType, eyebrowType, ledeType } from '../_system/typography';

/**
 * The four thumbnails the pile draws. Declared here rather than in the
 * component because it is a styling variant before it is anything else —
 * it selects a hue, in the manner of `CreditPillTone` / `StepIndex`. It
 * is NOT the upload contract: the real accepted-format list is
 * `SOURCE_DOCUMENT_EXTENSIONS` in `components/FileDropzone`, of which
 * these four are the recognisable representatives.
 */
export type FileKind = 'pdf' | 'doc' | 'image' | 'audio';

/* ── The transformation band ───────────────────────────────
   The landing page is a long run of centred headers over evenly-spaced
   grids (GoalTypes, CourseExamples, FeatureBento). A fourth one would
   vanish into it, so this section is built as a plate instead: a
   full-bleed tinted band, hairline-ruled top and bottom, with the copy
   pushed into a narrow left column and one large asymmetric composition
   filling the rest. ProblemSection is the page's other band and is
   deliberately dark; this one is warm and light so the two read as
   different moments rather than a pair.

   'overflow: hidden' is load-bearing, not cosmetic — the file cards are
   rotated and the wash is inset past the edges, and this is what
   guarantees 'document.scrollWidth === window.innerWidth' at 360px. */

export const Wrap = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  ${sectionRhythm}
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 5%, ${p.theme.colors.background})`};
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  /* Two soft washes — gold behind the course that comes out, forest behind
     the material that goes in. Purely atmospheric; nothing legible depends
     on it, so it needs no reduced-motion or contrast handling. */
  &::before {
    content: '';
    position: absolute;
    inset: -20% -12%;
    pointer-events: none;
    background:
      radial-gradient(
        44% 52% at 74% 48%,
        ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 20%, transparent)`} 0%,
        transparent 68%
      ),
      radial-gradient(
        40% 46% at 12% 62%,
        ${(p) => `color-mix(in srgb, ${p.theme.colors.accent} 13%, transparent)`} 0%,
        transparent 70%
      );
  }
`;

export const Inner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${MEASURE};
  display: grid;
  /* Near parity, from an original 0.8 : 1.5. The copy column carries a
     64px display head now and needs the room to set it; the stage lost
     width in the same move, which is what brought the pages down to a
     size that reads as a supporting cluster instead of the main event. */
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.25fr);
  align-items: center;
  gap: var(--space-12);

  ${(p) => p.theme.media.desktop} {
    gap: var(--space-8);
  }

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-8);
  }
`;

/* Left-aligned on every width. Centring it would put the section straight
   back into the page's default rhythm, and at phone widths a left column
   reads perfectly well on its own. */
export const Copy = styled(motion.div)`
  display: flex;
  flex-direction: column;
  /* The shared eyebrow→heading→lede gap. Not 'headBlockRhythm': this is the
     left column of a two-up grid, not a head sitting over a body, so the
     helper's head→body padding would be a gap to nothing. Was '--space-4',
     one of the four values the audit counted. */
  gap: var(--space-3);
  min-width: 0;
`;

export const Eyebrow = styled.span`
  ${eyebrowType}
`;

/**
 * The display rank, not the section rank.
 *
 * `headingType` (44px) is what the other seven sections use and is where
 * this started. It is the correct default — but it left this heading
 * reading a rank down from everything around it, because a 44px head in a
 * side column next to a full-height composition carries far less weight
 * than the same 44px centred over a grid. `displayType` (64px) is the
 * scale's OTHER existing rank, already used by the hero, so this is a
 * choice between two roles the type system offers rather than a local size
 * invented for one section — which is the thing `typography.ts` warns
 * against. This plate and the hero are the page's two full-bleed moments.
 */
export const Heading = styled.h2`
  ${displayType}
`;

export const Lede = styled.p`
  ${ledeType}
  max-width: 32ch;
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

/* ── The composition ───────────────────────────────────────
   Three cells on one axis: the material you already have, the seam it
   passes through, the course that comes out. Horizontal on desktop,
   vertical below tabletLarge — the seam is drawn direction-free (a line
   that grows outward from its own centre) precisely so the same motion
   works in both orientations without a JS breakpoint. */

export const Stage = styled.div`
  position: relative;
  min-width: 0;
  display: grid;
  /* The outline takes the larger share. It is the payoff of the sentence
     the section is making — material goes in, a COURSE comes out — and
     when the pile was the bigger object the picture argued the opposite.
     The pile is a supporting cluster; the course is the point. */
  grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1.05fr);
  align-items: center;

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 44px auto;
  }
`;

/* ── In: the material ────────────────────────────────────
   Four files and one link, dropped as a loose pile. Absolutely-positioned
   children contribute no height, so the pile is given one per breakpoint
   and everything inside is placed in percentages of it — which is also
   what lets the whole cluster scale by 'aspect-ratio' alone once the
   composition goes vertical and the column stops being narrow.

   Rotation lives in the framer props rather than here — framer writes the
   whole 'transform', so a CSS rotate would be overwritten the moment a
   card animates. */
export const Pile = styled.div`
  position: relative;
  /* Still the taller of the two stage objects, so this number sets the
     height of the whole band — 96px of section padding either side of it.
     Keep it in step with 'Outline': at 400 the section measured 594px
     against a 639–1019 spread for every other section on the page, which
     is the thin-strip problem coming back. (Single quotes, not backticks:
     this comment is inside a template literal.) */
  height: 390px;
  min-width: 0;

  ${(p) => p.theme.media.desktop} {
    height: 345px;
  }

  /* Single-column now. The first mobile cut kept the desktop's tall 2×2
     ratio and just capped the width — which still rendered four
     half-screen-wide pages stacked down ~550px of phone, and read as the
     desktop diagram fallen over (Simas, 2026-08-01: files far too huge on
     mobile). The phone gets its own composition instead: a LOW BAND —
     the four pages as a compact overlapping fan across one row, the
     browser card tucked beneath — so the whole "in" side is ~250px and
     the outline stays the biggest object on screen. FileCard and
     LinkCard carry matching tabletLarge slot overrides below. */
  ${(p) => p.theme.media.tabletLarge} {
    width: 100%;
    max-width: 360px;
    height: auto;
    aspect-ratio: 360 / 250;
    margin-inline: auto;
  }
`;

/**
 * Per-format hue. Kept local to this composition rather than promoted to
 * the theme: nothing else in the product colour-codes a file type, and the
 * palette here exists to make four thumbnails tell themselves apart at
 * 90px, not to become a token set.
 *
 * Light values are dark enough to carry white ink; the dark-theme values
 * are the same hues lifted to read on `gray800`, and there they carry dark
 * ink instead. Both directions clear 4.5:1 on their own band.
 */
const KIND_HUE: Record<FileKind, string> = {
  pdf: '#b3452f',
  doc: '#3f6187',
  image: '#2c5545',
  audio: '#8a6d2f',
};

const KIND_HUE_DARK: Record<FileKind, string> = {
  pdf: '#d2765f',
  doc: '#7ba0c6',
  image: '#5da383',
  audio: '#c4a265',
};

/* Two by two, with the browser card on its own line underneath. The tops
   are staggered a few percent so the grid still reads as a pile rather
   than a table. Percentages of the pile, so the arrangement survives
   `aspect-ratio` sizing untouched. */
const SLOTS = [
  'left: 3%;   top: 1%;',
  'left: 54%;  top: 0%;',
  'left: 6%;   top: 40%;',
  'left: 57%;  top: 38%;',
] as const;

/* The phone fan: one low row, each page overlapping the next by a couple
   of percent, tops staggered so the alternating rots (-5/+4/-3/+5) read
   as a hand of papers rather than a misaligned grid. Percentages of the
   360/250 mobile pile box. */
const MOBILE_SLOTS = [
  'left: 2%;   top: 12%;',
  'left: 26%;  top: 4%;',
  'left: 50%;  top: 10%;',
  'left: 74%;  top: 2%;',
] as const;

export const FileCard = styled(motion.div)<{ $slot: 0 | 1 | 2 | 3; $kind: FileKind }>`
  position: absolute;
  ${(p) => SLOTS[p.$slot]}
  z-index: ${(p) => p.$slot + 1};
  width: 37%;

  ${(p) => p.theme.media.tabletLarge} {
    width: 26%;
    ${(p) => MOBILE_SLOTS[p.$slot]}
  }

  --kind: ${(p) => KIND_HUE[p.$kind]};
  --kind-ink: #ffffff;

  [data-theme='dark'] & {
    --kind: ${(p) => KIND_HUE_DARK[p.$kind]};
    --kind-ink: #241f1c;
  }
`;

/**
 * The page itself, drawn rather than boxed.
 *
 * A div with a border cannot cut its own corner and keep the border
 * running around the cut, and `clip-path` would take the shadow with it.
 * One SVG solves both: the silhouette is a single path, the shadow is a
 * `drop-shadow` filter so it follows the fold instead of a rectangle, and
 * the whole thumbnail stays crisp at any size. The glyph is lucide's own
 * `File` — the icon set the product already uses — enlarged so the fold
 * still reads at 90px.
 */
export const Thumb = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  /* Follows the folded silhouette instead of a box, which is half of why
     the shape reads. Deepened on the dark ground, where a 10% black lift
     is invisible and the pages would separate on their hairline alone. */
  filter: drop-shadow(0 5px 14px rgba(0, 0, 0, 0.1));

  [data-theme='dark'] & {
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45));
  }

  .page {
    fill: ${(p) => p.theme.colors.surface};
    stroke: ${(p) => p.theme.colors.surfaceBorder};
    stroke-width: 1.4;
  }

  /* The dog-ear. Filled as an open path — SVG closes it along the cut
     diagonal for the fill but never strokes that closing line, so the
     elbow is drawn and the diagonal is not. */
  .fold {
    fill: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 7%, ${p.theme.colors.surface})`};
    stroke: ${(p) => p.theme.colors.surfaceBorder};
    stroke-width: 1.4;
    stroke-linejoin: round;
  }

  /* Ruled lines stand in for body text on every page in this composition.
     Nothing here is meant to be read; the shape is the message. */
  .rule {
    fill: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 13%, transparent)`};
  }

  .head {
    fill: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 26%, transparent)`};
  }

  .headTint {
    fill: ${() => `color-mix(in srgb, var(--kind) 55%, transparent)`};
  }

  .well {
    fill: ${() => `color-mix(in srgb, var(--kind) 12%, transparent)`};
  }

  .sun {
    fill: ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 62%, transparent)`};
  }

  .hill {
    fill: ${() => `color-mix(in srgb, var(--kind) 46%, transparent)`};
  }

  .bar {
    fill: ${() => `color-mix(in srgb, var(--kind) 52%, transparent)`};
  }

  /* The format band. Solid, bottom-left, exactly where a file manager
     puts it — this is the single element doing most of the recognising. */
  .band {
    fill: var(--kind);
  }

  .bandInk {
    fill: var(--kind-ink);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
`;

/* ── The link ──────────────────────────────────────────────
   Links are the other half of what you can bring, and they are not files.
   A pill with a chain glyph was the first attempt and it read as a tag or
   a tooltip — small, and ambiguous about what it even was. This is a
   browser window instead: chrome bar, traffic lights, an address field
   with a globe in it, and a page under it. Nothing else on the landing
   page looks like this, and a browser is the one picture of "a web page"
   that needs no caption.

   It gets the SAME surface, hairline and lift as the pages so it reads as
   another thing you brought — but the chrome, not a folded corner, is
   what tells you which kind. RFC 2606 reserved domain, so it cannot read
   as a claim about a real site. */
export const LinkCard = styled(motion.div)`
  position: absolute;
  left: 4%;
  top: 76%;
  z-index: 5;
  width: 86%;
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lift);

  /* Under the fan in the 360/250 phone box (the fan's pages bottom out
     around 62%). */
  ${(p) => p.theme.media.tabletLarge} {
    left: 7%;
    top: 64%;
    width: 86%;
  }
`;

export const LinkChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 4%, ${p.theme.colors.surface})`};
`;

/* The three traffic lights. Neutral rather than red/amber/green — a real
   stoplight would be the loudest colour in a composition whose whole job
   is to let four format bands do the talking. */
export const LinkDots = styled.span`
  flex-shrink: 0;
  display: flex;
  gap: 3px;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 20%, transparent)`};
  }
`;

export const LinkBar = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 7%, transparent)`};

  svg {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    color: ${(p) => p.theme.colors.accent};
  }
`;

export const LinkUrl = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.muted};

  ${(p) => p.theme.media.desktop} {
    font-size: 0.625rem;
  }
`;

export const LinkBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 11px 10px 13px;
`;

export const LinkHead = styled.span`
  width: 46%;
  height: 7px;
  border-radius: var(--radius-pill);
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 26%, transparent)`};
`;

export const LinkRule = styled.span<{ $w: number }>`
  width: ${(p) => p.$w}%;
  height: 5px;
  border-radius: var(--radius-pill);
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 13%, transparent)`};
`;

/* ── The seam ──────────────────────────────────────────── */

export const Seam = styled.div`
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* The colour stops hold across the middle rather than peaking at a single
   point. With a two-stop fade the line is only ever fully itself at one
   pixel, which was survivable over the old 255px seam and washes out over
   this one — the taller pile stretched the same gradient across 372px. */
export const SeamLine = styled(motion.div)`
  width: 1px;
  height: 76%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    ${(p) => p.theme.colors.tertiary} 26%,
    ${(p) => p.theme.colors.tertiary} 74%,
    transparent 100%
  );

  ${(p) => p.theme.media.tabletLarge} {
    width: 62%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(p) => p.theme.colors.tertiary} 50%,
      transparent 100%
    );
  }
`;

/* The still centre of the composition — a small gold lozenge sitting on
   the seam. It is the one element that stays put while everything else
   moves through it. */
export const SeamNode = styled(motion.div)`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 1px;
  background: ${(p) => p.theme.colors.tertiary};
`;

/* One-shot bloom at the moment the material crosses. Not rendered under
   reduced motion. */
export const SeamBloom = styled(motion.div)`
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 42%, transparent)`} 0%,
    transparent 68%
  );
`;

/* ── Out: the course ───────────────────────────────────── */

/**
 * The course that comes out — and, since the rebalance, the tallest object
 * in the stage and therefore what sets the height of the whole band.
 *
 * It is deliberately the biggest thing here. The section's sentence is
 * "material in, course out", and for one round the pile of files was the
 * largest object on the plate, which argued the reverse. Everything in
 * this card is a step up from the version that sat beside a dominant pile:
 * larger module type, taller rules, more air, four modules instead of two.
 */
export const Outline = styled(motion.div)`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lift-strong);
`;

export const OutlineGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
`;

export const OutlineModule = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: ${(p) => p.theme.colors.foreground};

  &::before {
    content: '▾';
    font-size: 0.75rem;
    line-height: 1;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const OutlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 18px;
  min-width: 0;
`;

export const RowBullet = styled.span`
  flex-shrink: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.tertiary} 70%, transparent)`};
`;

/* Draws itself left-to-right as the material arrives — the closest thing
   the composition has to "the course being written". Under reduced motion
   it starts at full width and only fades. */
export const RowRule = styled(motion.div)<{ $w: number }>`
  flex: 0 1 auto;
  width: ${(p) => p.$w}%;
  min-width: 16px;
  height: 5px;
  border-radius: var(--radius-pill);
  transform-origin: left center;
  background: ${(p) => `color-mix(in srgb, ${p.theme.colors.foreground} 14%, transparent)`};
`;

/* Verbatim from 'components/SourceProvenanceBadge' — the product's own
   per-lesson provenance pill. */
export const DocumentsPill = styled(motion.span)`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  background: ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 16%, transparent)`};
  color: ${(p) => p.theme.colors.tertiaryText};
`;

/* ── Sparks ────────────────────────────────────────────── */

/* Three flecks that leave the pile, cross the seam and land as the lesson
   rows draw themselves. This is the literal sentence of the section, so it
   is decoration only in the technical sense — but it is also the one part
   that cannot survive a vertical layout or a reduced-motion preference, so
   the composition is legible without it in both cases. */
export const SparkLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;

  ${(p) => p.theme.media.tabletLarge} {
    display: none;
  }
`;

export const Spark = styled(motion.div)`
  position: absolute;
  height: 5px;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, transparent 0%, ${(p) => p.theme.colors.tertiary} 100%);
`;
