/**
 * Copy for the PROBLEM section candidates.
 *
 * Deliberately NOT in the shared `constants.ts` — each candidate re-cuts the
 * section's copy to suit its own composition, and the shipped `PROBLEM`
 * strings must stay untouched while the comparison runs.
 *
 * COPY BUDGET. The shipped section carries ~47 words: a nine-word headline
 * and a 38-word body that explains the whole product ("we design the course,
 * stream the lessons, bring the ideas back"). Every candidate here is cut to
 * roughly a third. The section is the page's emotional pivot, not its
 * feature list — the argument it has to land is one sentence long, and the
 * rest of the page already makes the other three.
 *
 * CLAIMS (STRIVE_FOR_MARKETING.md §11). Forgetting is stated as a fact about
 * the reader, never as a measured figure: no retention percentage, no
 * efficacy multiplier, no "you'll remember X% more". The 1 · 3 · 7 · 14 · 30
 * recall ladder is on the sanctioned list and is the only number any
 * candidate carries. No credits, no counts of users, no outcome promise.
 *
 * The `*word*` convention marks the single italic-serif word each headline
 * is allowed.
 */

/** The sentence every candidate is a different reading of. The `*em*` span
 *  is the one italic-gold emphasis the closer is allowed (same convention as
 *  the headlines). */
const CLOSER = 'Strive is *built around* that.';

/**
 * The mechanism, said once — review asked the section to EXPLAIN spaced
 * repetition, not only allude to it. The 1·3·7·14·30 ladder is the one
 * number the claims policy sanctions here.
 */
export const MECHANISM =
  'Every lesson leaves recall cards that come back at 1, 3, 7, 14 and 30 days — each return timed to catch the curve just before it drops.';

/**
 * The same mechanism cut to each candidate's own diction, because a
 * composition that speaks in struck marks should not suddenly speak in
 * product prose. Same claim, same ladder, five registers.
 */
export const MECHANISM_BY_VARIANT = {
  // 02 already prints the ladder on its legend — this says what the five
  // struck squares MEAN rather than repeating their numbers.
  p02: 'Each struck square is a recall card returning — spaced so the next one lands just before the memory would have gone.',
  // 03 is a poster: trim-weight, one breath.
  p03: 'Recall cards return at 1 · 3 · 7 · 14 · 30 days — each timed to catch the memory just before it drops.',
  // 04 is an exam paper: the answer printed under the question.
  p04: 'Strive answers it for you — every lesson leaves recall cards that come back at 1, 3, 7, 14 and 30 days, each return timed to land just before the memory would have gone.',
  // 05 is a redaction: the corrected sentence, stated plainly.
  p05: 'So the cards come back — 1, 3, 7, 14 and 30 days — each return timed to catch the memory just before it drops.',
} as const;

/**
 * The return pins P01 draws on its ruler: day → position on the 21-day
 * measure (TODAY → WEEK 3). Day 30 lands past the measure's edge and is
 * drawn at the rail with an off-scale arrow, which is honest — the last
 * return happens after the window in which the forgetting happened.
 */
export const RETURNS: { day: number; pct: number }[] = [
  { day: 1, pct: (1 / 21) * 100 },
  { day: 3, pct: (3 / 21) * 100 },
  { day: 7, pct: (7 / 21) * 100 },
  { day: 14, pct: (14 / 21) * 100 },
];

/**
 * 01 — The Vanishing Sentence. One line of display type laid along a
 * three-week ruler; the ink gives out as the sentence crosses it. `dim` is
 * the word's resting opacity — the decay curve is hand-set rather than
 * computed so the emphasis word can hold full strength and the collapse can
 * happen *after* it, which is the whole joke.
 */
export const P01 = {
  words: [
    // Tail dims raised from 0.46/0.28/0.14 — at 0.14 the sentence's last
    // word was illegible at rest and the plate read "…is gone in ___".
    // The decay gradient survives; the sentence stays a sentence
    // (011-landing A9).
    { t: 'Most', dim: 1 },
    { t: 'of', dim: 1 },
    { t: 'what', dim: 1 },
    { t: 'you', dim: 0.94 },
    { t: 'learn', dim: 0.88 },
    { t: 'is', dim: 0.78 },
    { t: 'gone', dim: 1, em: true },
    { t: 'in', dim: 0.55 },
    { t: 'three', dim: 0.42 },
    { t: 'weeks.', dim: 0.32 },
  ],
  ticks: ['TODAY', 'WEEK 1', 'WEEK 2', 'WEEK 3'],
  closer: CLOSER,
} as const;

/**
 * 02 — The Thirty-Day Sheet. A month of squares, the ink draining out of
 * them, five struck gold. The five are the product's own recall ladder.
 */
export const P02 = {
  heading: "Three weeks later, it's *gone*.",
  closer: 'So we bring it back.',
  sheetLeft: 'DAY 1',
  sheetRight: 'DAY 30',
  legend: 'RECALL RETURNS',
  /** Sanctioned: the Leitner ladder shipped in the product. */
  returns: [1, 3, 7, 14, 30],
} as const;

/** 03 — The Wall. One word at poster scale; the sentence demoted to trim. */
export const P03 = {
  over: 'MOST OF WHAT YOU LEARN IS',
  word: 'gone',
  under: 'IN THREE WEEKS',
  closer: 'Strive is built around that fact.',
} as const;

/**
 * 04 — The Examination Paper. The claim handed to the reader as a question
 * they have to answer for themselves. "UNGRADED" is the promise that it is
 * a rhetorical device and not a gate.
 */
export const P04 = {
  sheetLeft: 'ONE QUESTION',
  sheetRight: 'UNGRADED',
  question: 'Name three things you learned last month.',
  closer: "That's the problem. Strive is built around it.",
} as const;

/**
 * 05 — The Redaction. The optimistic sentence, struck down to the true one.
 * The full string is the accessible reading and is grammatical on its own;
 * `cut: true` spans are the ones the bars cover, and what survives is the
 * shipped headline word for word.
 */
export const P05 = {
  line: [
    { t: 'You read it, you take the notes, and still', cut: true },
    { t: 'most of what you learn is' },
    { t: 'quietly', cut: true },
    { t: 'gone in' },
    { t: 'a little under', cut: true },
    { t: 'three weeks.' },
  ],
  closer: "Strive is built around what's left.",
} as const;
