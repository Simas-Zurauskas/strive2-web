/**
 * Copy for the "START LEARNING" candidates (the section currently shipped
 * as `FinalCtaSection`).
 *
 * The shipped closer runs an eyebrow, a headline, a 38-word subhead, two
 * CTAs and a rotating three-card visual. Every candidate below cuts the
 * subhead entirely: by the time a visitor reaches the last screen of the
 * page they have been told what Strive is four times, and a fifth telling
 * is the thing that reads as filler. What replaces it differs per variant —
 * an ornament, the product's own recall card, a schedule, a register, a
 * set of directions — but never another paragraph.
 *
 * CLAIMS DISCIPLINE (§11), binding. No generation-speed claim; no outcome
 * or efficacy claim; no user counts, ratings or testimonials; no provider
 * named; the word credits appears nowhere. "Recall at 1 · 3 · 7 · 14 · 30",
 * "modules, lessons, quizzes", "one sentence" and "free tier, no credit
 * card" are all on the sanctioned list. Variant 02 shows a real recall card
 * whose content is `FINAL_CTA.recallSamples[0]` verbatim, and its two chrome
 * labels are lifted from the shipped `RecallCardLoop`.
 *
 * `*word*` marks the single italic-serif emphasis per headline.
 */

/** Shared — the CTA is the product's, not the variant's. */
export const CTA = 'Build my first course — free';
export const CTA_SHORT = 'Build my first course';
export const MICRO = 'Free tier included. No credit card.';
export const SECONDARY = 'See pricing';

/** 01 — The Colophon. The quiet close: an ornament, a rule, one line. */
export const T01 = {
  ornament: '❧',
  line: 'Here the page *ends*. The course begins.',
} as const;

/** 02 — The Slip. The product's own recall card, set at display size. */
export const T02 = {
  eyebrow: 'Start learning',
  headline: 'Tomorrow’s *review*, already scheduled.',
  note: 'Recall at 1 · 3 · 7 · 14 · 30 days',
  cardEyebrow: 'From your recall queue',
  cardStatus: 'Auto-scheduled',
  answerLabel: 'Answer',
} as const;

/** 03 — The Schedule. The five return dates, drawn to a true timeline. */
export const T03 = {
  eyebrow: 'Start learning',
  headline: 'Learn it once. See it *five* more times.',
  origin: 'today',
  unit: 'days',
  /** Leitner intervals, in days. Positions are derived from these. */
  days: [1, 3, 7, 14, 30],
} as const;

/** 04 — The Plate. The page closes on ink, as it turned on ink. */
export const T04 = {
  eyebrow: 'Start learning',
  headline: 'One sentence is *enough* to start.',
  // Two clauses, not three: 'Free tier. No credit card.' duplicated the
  // shared MICRO rendered 130px above it on the same plate (011-landing A2).
  clauses: ['Modules, lessons, quizzes', 'Recall at 1 · 3 · 7 · 14 · 30'],
} as const;

/** 05 — The Directions. A printed label: how the thing is taken. */
export const T05 = {
  mark: 'Strive',
  sub: 'Directions for *use*.',
  directions: [
    'State the goal in your own words.',
    'Read the lessons as they are written.',
    'Answer the cards when they return.',
  ],
} as const;
