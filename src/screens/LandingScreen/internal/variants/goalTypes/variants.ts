/**
 * Copy for the GOAL TYPES ("Built for any reason") candidates.
 *
 * Local to this directory on purpose — the shared `constants.ts` keeps
 * `GOAL_TYPES_SECTION` / `GOAL_TYPES` exactly as shipped for the control.
 *
 * THE CUT. The shipped rows carry three pieces of copy each: a label
 * (`Master`), a verb phrase (`Go deep on a topic`) and an example goal
 * (`Understand how transformers actually work`). The verb is the weakest
 * of the three — it restates the label in a sentence — so every candidate
 * here drops it and shows label + real goal only. That halves the section's
 * word count and, more usefully, puts the concrete thing first: a visitor
 * recognises "Pass the JEE Mains physics paper" instantly and does not need
 * to be told it means "prep for an exam".
 *
 * The four reasons and their example goals are verbatim from the shipped
 * `GOAL_TYPES`. `fluency` stays off the list for the reason recorded there:
 * language learning is the brief's explicit do-not-promote.
 *
 * CLAIMS (§11). Nothing here promises an outcome — "Pass the JEE Mains
 * physics paper" is quoted as a goal a learner states, never as a result
 * Strive delivers, and every candidate frames the four as things people
 * ask for. No counts, no testimonials, no credits.
 */

const EYEBROW = 'Built for any reason';

export interface Reason {
  key: string;
  label: string;
  example: string;
  /** The person this direction exists for, in one clause. */
  who: string;
  /**
   * How the direction bends the WHOLE course — the point of the section is
   * that these are dedicated steers on generation, not four labels over the
   * same product. Written to the claims discipline: each line describes the
   * course's shape (what leads, what order, what the quiz emphasises),
   * never an outcome.
   */
  bend: string;
}

/** Labels + examples verbatim from `GOAL_TYPES`; `who`/`bend` added when
 *  review asked the section to explain the four directions rather than
 *  only name them. */
export const REASONS: Reason[] = [
  {
    key: 'master',
    label: 'Master',
    example: 'Understand how transformers actually work',
    who: 'For going deep on a subject that matters to you.',
    bend: 'Fundamentals first, each module building on the last — and quizzes that test understanding, not trivia.',
  },
  {
    key: 'monetize',
    label: 'Monetize',
    example: 'Run Meta Ads for my jewellery store',
    who: 'For learning a skill you plan to charge for.',
    bend: 'Practical from lesson one — examples drawn from your niche, theory only where it earns its place.',
  },
  {
    key: 'pass',
    label: 'Pass',
    example: 'Pass the JEE Mains physics paper',
    who: 'For a syllabus and a date.',
    bend: 'Shaped to what the exam asks — full coverage in study order, recall keeping early topics warm.',
  },
  {
    key: 'build',
    label: 'Build',
    example: 'Ship a React Native side project',
    who: 'For shipping something concrete.',
    bend: 'Modules follow the build order, so the learning and the making stay one activity.',
  },
];

/** 01 — The Fingerpost. One post, four arms, four directions. */
export const G01 = {
  eyebrow: EYEBROW,
  headline: 'Four reasons. Pick *yours*.',
  // The mechanic, stated plainly (Simas, 2026-08-01): these four are a
  // real setting the wizard asks for, and generation aligns to the answer
  // — without this line the section read as generic persona marketing.
  // "shapes the build" describes the mechanism, never an outcome (§11).
  lede: 'This is a real choice you make when creating a course — Strive asks what you’re after, and your answer shapes the whole build: what’s covered, in what order, with which examples.',
} as const;

/** 02 — The Quadrants. One plate, crossed by two rules. */
export const G02 = {
  eyebrow: EYEBROW,
  headline: 'We tune the course to what you will *do* with it.',
  indices: ['I', 'II', 'III', 'IV'] as const,
} as const;

/** 03 — The Letterbox. A dark plate, four apertures. */
export const G03 = {
  eyebrow: EYEBROW,
  headline: 'Why are you *learning* this?',
} as const;

/** 04 — The Quotations. The goals are the section. */
export const G04 = {
  eyebrow: EYEBROW,
  headline: 'Four ways to *start*.',
} as const;

/** 05 — The Drawer. Four catalogue cards on a rod. */
export const G05 = {
  eyebrow: EYEBROW,
  headline: 'Pick the reason. The course *follows*.',
  /** The card's own printed header — design ornament, not a product label. */
  cardHead: 'REASON',
} as const;

/** 06 — The Prism. One beam in, four out at four angles. */
export const G06 = {
  eyebrow: EYEBROW,
  /**
   * States the section's argument literally, so the plate and the headline
   * make the same claim. "Different courses" is a statement about how
   * generation is steered — the `bend` lines below spell out how — and not
   * about what any course achieves.
   */
  headline: 'One goal in. Four *different* courses out.',
  /** Set over the incoming beam, before the split. */
  beamIn: 'One goal',
  /** Names the component doing the bending, under the prism. */
  splitter: 'The reason you pick',
} as const;
