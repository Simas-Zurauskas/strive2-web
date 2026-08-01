'use client';

import { css } from 'styled-components';

/**
 * Landing page type scale.
 *
 * WHY THIS EXISTS. Each landing section was authored as an independent object
 * during the design-lab round, so the page accumulated 7 distinct h2 clamps
 * resolving to 6 different sizes at 1440px (40 / 44 / 52 / 56 / 72 / 76px — a
 * 1.9× spread), 5 eyebrow treatments and 3 lede declarations. Nothing was
 * wrong individually; together they read as five different documents.
 *
 * These are the roles a landing section may use for its EYEBROW, HEADING and
 * LEDE — the three that were actually in conflict. A section that needs a
 * heading size not in this file should be arguing for a change to the scale,
 * not declaring a local one; that is how the spread happened.
 *
 * Running text is deliberately NOT a role here. Every candidate site pairs its
 * size with a line-height it has a reason for (1.5 for a caption, 1.65 in a
 * pricing card, tabular numerals in an allowance row) and its own colour, so a
 * shared body role would have been adopted by nobody or, worse, adopted by
 * force and changed the rendering. The sizes themselves already agree —
 * 0.9375rem and 0.8125rem throughout — which is the part that mattered.
 *
 * WHERE THE VALUES CAME FROM. Every role below is the majority pattern already
 * present in the shipped sections, not a new invention. See
 * `wiki-strive/notes/WORKING/final-landing/AUDIT.md` §3 and §5 for the
 * evidence and the per-section counts.
 *
 * COLOUR IS NOT BAKED IN for the roles that appear on dark plates. Two
 * sections (Problem, Start learning) print on a theme-stable dark ground where
 * the theme's own `foreground`/`muted`/`tertiaryText` tokens invert and fail —
 * `tertiaryText` on `#2c5545` measures ~3.5:1, below the 4.5:1 that token
 * exists to guarantee. Those sections pass their own ink in; see `onPlate`.
 */

/* ── Roles ────────────────────────────────────────────────── */

/**
 * The small tracked label above a heading. Majority pattern; `tertiaryText`
 * rather than `tertiary` because the gold fails contrast at label sizes
 * (`theme.ts:31-37` documents exactly this).
 */
export const eyebrowType = css`
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiaryText};
`;

/**
 * Section heading (h2). One size for every section, so the page has a single
 * heading rank rather than six competing ones.
 *
 * The clamp's floor is set so the longest shipped heading — "From a goal to a
 * roadmap, in four steps." — still sets on two lines at 360px rather than
 * four.
 */
export const headingType = css`
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.875rem, 3.6vw, 2.75rem);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: ${(p) => p.theme.colors.foreground};
  text-wrap: balance;

  /* The house '*word*' convention: one italic-gold emphasis per heading. */
  em {
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

/**
 * The hero's h1. Deliberately a rank above `headingType` — it is the only
 * display type on the page and the page's LCP element. Value is the shipped
 * hero's own, unchanged.
 */
export const displayType = css`
  margin: 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-weight: 700;
  font-size: clamp(2.25rem, 6.4vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};

  em {
    font-style: italic;
    font-weight: 500;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

/**
 * The sentence under a heading. `52ch` because that is the shipped hero's
 * measure and it is the right one — a lede running the full 1120px column is
 * unreadable regardless of what the grid allows.
 */
export const ledeType = css`
  margin: 0;
  max-width: 52ch;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  text-wrap: pretty;
`;

/* ── Dark plates ──────────────────────────────────────────── */

/**
 * Ink overrides for the two theme-stable dark sections.
 *
 * These sections keep their own ground in both themes, so the theme tokens do
 * not apply to them — `foreground` is near-black in light mode and would
 * vanish. Compose as `${headingType} ${onPlate.heading(CREAM, GOLD)}` so the
 * SCALE stays shared and only the ink is local: the sections agree on size,
 * weight and rhythm while printing in their own colours.
 *
 * `eyebrow` takes cream rather than gold at 78% — gold-on-plate is the
 * contrast failure the audit found (~3.5:1 on `#2c5545`), and a tracked
 * 11px label is exactly the case the 4.5:1 rule exists for.
 */
export const onPlate = {
  eyebrow: (cream: string) => css`
    color: color-mix(in srgb, ${cream} 78%, transparent);
  `,
  heading: (cream: string, gold: string) => css`
    color: ${cream};

    em {
      color: ${gold};
    }
  `,
};
