'use client';

import { css } from 'styled-components';

/**
 * Landing page layout system: one vertical rhythm, one content axis.
 *
 * WHY THIS EXISTS. Before this file the nine sections produced **seven
 * different left edges** at a 1440px viewport (130 / 132 / 140 / 160 / 180 /
 * 192 / 270px) from six declared max-widths, and four different section
 * paddings. Nothing lined up with anything, including the nav bar.
 *
 * Note that the shell it replaces was already written and then abandoned:
 * `LandingScreen.styles.ts` declared a `SectionInner` at exactly this measure
 * since the beginning and nothing ever imported it. Its first version here
 * repeated the mistake — a `SectionWrap`/`SectionInner`/`HeadBlock` set that
 * read like a system and had zero importers, because every section genuinely
 * needs its own `<section>` (backgrounds, `overflow: hidden`, plate grounds,
 * `position: relative`) and a shared wrapper only gets re-wrapped.
 *
 * So this file exports **values and `css` fragments, not containers**. Those
 * compose into whatever element a section already has, which is why they are
 * actually used.
 *
 * See `wiki-strive/notes/WORKING/final-landing/AUDIT.md` §4 for the
 * measurements and §5 for why each value below is the majority pattern rather
 * than a preference.
 */

/**
 * The content measure. 1120px is the nav bar's own axis and the max-width
 * already used by 8 of the 10 shipped sections, so adopting it aligns the page
 * to its own chrome instead of to a number someone picked.
 */
export const MEASURE = '1120px';

/**
 * Space between sections: 96px desktop, 64px from tabletLarge down.
 *
 * This is a deliberate step up from the shipped 64/40 house pad. That value
 * was set for a 13-section page; this page has 9 sections carrying much
 * heavier objects, and six of the nine already assumed 96px. Approved
 * 2026-07-31.
 *
 * The gutter lives here, on the outer element, and the inner container has NO
 * horizontal padding. That ordering is what makes the axis predictable: every
 * section's content edge is `(viewport - min(MEASURE, viewport - 2×gutter)) / 2`
 * and nothing else.
 */
export const sectionRhythm = css`
  padding: var(--space-24) var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: var(--space-16) var(--space-5);
  }
`;

/* ── Intra-section rhythm ─────────────────────────────────── */

/**
 * The head block: eyebrow → heading → lede, then the gap down to the section
 * body. Composed rather than provided as a component, because every section's
 * head is a `motion` element with its own alignment — a shared styled.div
 * would be re-wrapped by all of them and adopted by none. (It was, and it was.)
 *
 * The nine sections carried four different eyebrow→heading gaps (8 / 12 / 16 /
 * 20px) and two head→body gaps (40 / 48px). 12px and 48px are the middle and
 * the most common, and they are what R04 — the section whose head is the
 * shipped heading and subhead — already used.
 *
 * Alignment is deliberately NOT set here: centred and left-aligned heads are
 * both legitimate compositions, and that is the one thing a section should
 * still decide for itself.
 */
export const headBlockRhythm = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-12);

  ${(p) => p.theme.media.tabletLarge} {
    padding-bottom: var(--space-10);
  }
`;
