/**
 * Copy for the ROADMAP section candidates.
 *
 * Deliberately NOT in the shared `constants.ts` — each candidate re-cuts
 * the section's copy to suit its own composition, and the shipped
 * `ROADMAP_SECTION` / `ROADMAP_STEPS` must stay untouched while the
 * comparison runs.
 *
 * COPY BUDGET. The shipped section carries ~85 words: a heading, a
 * subhead, four titles and four full-sentence bodies. Every candidate here
 * is cut to roughly a third of that, on the principle that the shipped
 * bodies restate what the titles already say ("Define your goal" / "Say
 * what you want to learn … in one sentence"). What survives is the part a
 * skimming visitor could not infer: that it is one sentence in, that what
 * comes out is modules/lessons/quizzes, that it can be argued with before
 * you commit, and that recall brings it back later.
 *
 * CLAIMS (STRIVE_FOR_MARKETING.md §11). No generation-speed wording of any
 * kind — "streams onto the page" describes the mechanism, never its
 * duration. No outcome or efficacy claim, no counts of users, no credits.
 * "Modules, lessons and quizzes" and the 1/3/7/14/30-day recall ladder are
 * both on the sanctioned list.
 *
 * The `*word*` convention marks the single italic-serif word each headline
 * is allowed.
 */

import { ROADMAP_SECTION } from '../../../constants';

const EYEBROW = 'How it works';

/** 01 — The Broadsheet. Folios, a masthead rule, four ruled columns. */
export const R01 = {
  eyebrow: EYEBROW,
  headline: 'From a goal to a *roadmap*.',
  columns: [
    { folio: 'I', title: 'Say the goal', line: 'One sentence.' },
    { folio: 'II', title: 'Read the roadmap', line: 'Modules, lessons, quizzes.' },
    { folio: 'III', title: 'Adjust it', line: 'Depth and length, by chat.' },
    { folio: 'IV', title: 'Begin', line: 'Lessons stream. Recall brings them back.' },
  ],
} as const;

/** 02 — The Drafting Sheet. A datum, four stations, leader-line annotation. */
export const R02 = {
  eyebrow: EYEBROW,
  headline: 'A goal in. A *roadmap* out.',
  /** Figure caption for the drawing, not a product label. */
  figure: 'FIG. 1',
  figureNote: 'GOAL → ROADMAP',
  stations: [
    { n: '01', label: 'Goal', note: 'One sentence.' },
    { n: '02', label: 'Roadmap', note: 'Modules, lessons, quizzes.' },
    { n: '03', label: 'Refinement', note: 'Depth and length, by chat.' },
    { n: '04', label: 'Lessons', note: 'Streamed, then recalled.' },
  ],
  dimension: 'STEP 01 — 04',
} as const;

/** 03 — The Stair. Four monumental numerals descending across the plate. */
export const R03 = {
  eyebrow: EYEBROW,
  headline: 'Four steps to the first *lesson*.',
  steps: [
    { n: '1', title: 'Say it', line: 'One sentence.' },
    { n: '2', title: 'See it', line: 'Modules, lessons, quizzes.' },
    { n: '3', title: 'Shape it', line: 'Depth and length, by chat.' },
    { n: '4', title: 'Start', line: 'Lessons stream onto the page.' },
  ],
} as const;

/**
 * 04 — The Strip. One perforated docket, four stubs, four stamps.
 *
 * Copy rewritten at review: the first cut clipped every stub to a noun and
 * a fragment ("Goal / One sentence.", "Read / Lessons stream in."), which
 * read as a filing code rather than an explanation — a visitor learned the
 * shape of the process but not what it does. So the titles and lines now
 * follow the SHIPPED section (`ROADMAP_SECTION` / `ROADMAP_STEPS` in
 * constants.ts): its four step titles verbatim, and its bodies trimmed to
 * the one clause a stub can hold. Same headline promise as the shipped
 * subhead, too — "you describe the destination, Strive builds the path" —
 * so the docket says what the control says, in a docket's voice.
 */
export const R04 = {
  eyebrow: EYEBROW,
  /**
   * 04 alone keeps the SHIPPED head — heading and subhead both — at review's
   * instruction: the docket is being judged as a replacement for the live
   * section, so its title must be the live title. Read from
   * `ROADMAP_SECTION` rather than copied, so it cannot drift from variant 00.
   * No `*word*` emphasis: the shipped heading carries none, and inventing one
   * here would make it a different line.
   */
  headline: ROADMAP_SECTION.heading,
  subhead: ROADMAP_SECTION.subhead,
  stubs: [
    {
      n: '01',
      title: 'One sentence',
      line: 'Say what you want to learn. That is the entire brief.',
    },
    {
      n: '02',
      title: 'Your curriculum',
      // "no catalogue to browse" lives in the subhead directly above this
      // strip (ROADMAP_SECTION.subhead) — repeating it here read as filler
      // (011-landing A1).
      line: 'Modules and lessons, in the order you’ll learn them.',
    },
    {
      n: '03',
      title: 'Refine, or begin',
      line: 'Reshape depth and length by chat — or just start reading.',
    },
    {
      n: '04',
      title: 'Made to stick',
      // The 1·3·7·14·30 ladder is spelled out where it is argued (P01's
      // ruler) and recapped once at the close (T04). Three spellings on
      // one page read as repetition, not rhetoric (011-landing A5, Q1).
      line: 'A quiz closes each module. Recall keeps bringing it back.',
    },
  ],
} as const;

/** 05 — The Rail. One spine, four stations, a scroll-linked marker. */
export const R05 = {
  eyebrow: EYEBROW,
  headline: 'You describe the destination. Strive builds the *path*.',
  stations: [
    { n: '01', title: 'Define your goal', line: 'One sentence, and where you start.' },
    { n: '02', title: 'Get your roadmap', line: 'Modules, lessons, quizzes.' },
    { n: '03', title: 'Customise the path', line: 'Refine depth and length by chat.' },
    { n: '04', title: 'Start learning', line: 'Lessons stream; recall brings them back.' },
  ],
} as const;
