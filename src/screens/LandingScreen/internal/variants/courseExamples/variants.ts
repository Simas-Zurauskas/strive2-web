/**
 * Copy and data for the COURSE EXAMPLES candidates.
 *
 * The sixteen topics are copied here rather than imported from the shared
 * `constants.ts` on purpose: the control still reads `COURSE_EXAMPLES`
 * from there, another agent owns that file for the duration of the
 * comparison, and none of these candidates uses the per-topic Lucide icon
 * the shipped cards do — every one of them is typographic. Copying keeps
 * the two sets independent while the review runs; whichever candidate
 * wins folds its data back into `constants.ts` on the way in.
 *
 * WHAT GOT CUT. The shipped section shows category + title + blurb on
 * every one of sixteen cards — roughly 150 words of blurb that a visitor
 * scanning for "is my thing here?" never reads. Three of the five
 * candidates drop the blurb entirely and show the title alone; the
 * departure board keeps the category as a column; only the reel, which
 * shows one topic at a time, can afford the sentence.
 *
 * The blurbs are still carried in the data because the click behaviour
 * needs them: picking a topic stashes `"<title> — <blurb>"` as the
 * visitor's pending goal, exactly as the shipped cards do, so the wizard
 * is prefilled with something worth submitting rather than two words.
 *
 * CLAIMS (§11). "A sample of what learners have generated" is dropped
 * from every candidate — we have no learner counts to stand behind and the
 * sentence invites the reader to infer one. These are presented as topics
 * Strive builds courses for, which is all they ever were. No speed claim,
 * no outcome claim, no credits, no counts.
 */

export interface Topic {
  category: string;
  title: string;
  blurb: string;
}

/** Verbatim from the shipped `COURSE_EXAMPLES`, minus the icon key. */
export const TOPICS: Topic[] = [
  { category: 'Tech', title: 'Web Development', blurb: 'Ship a full-stack app with React, Node, and a real database.' },
  { category: 'Tech', title: 'Data Science', blurb: 'Analyse data with Python, pandas, and the statistics behind it.' },
  { category: 'Tech', title: 'AI Engineering', blurb: 'Build with LLMs, embeddings, and retrieval pipelines.' },
  { category: 'Tech', title: 'Cybersecurity', blurb: 'Threat models, penetration testing, and secure-by-design habits.' },
  { category: 'Business', title: 'Digital Marketing', blurb: 'SEO, paid ads, and content that actually converts.' },
  { category: 'Business', title: 'Investment Strategy', blurb: 'Markets, asset classes, and building a portfolio.' },
  { category: 'Business', title: 'Entrepreneurship', blurb: 'From idea validation to first paying customers.' },
  { category: 'Business', title: 'Product Management', blurb: 'Discovery, roadmaps, and shipping the right thing.' },
  { category: 'Creative', title: 'Creative Writing', blurb: 'Story structure, character, and a voice of your own.' },
  { category: 'Creative', title: 'Music Production', blurb: 'Composition, arrangement, and mixing your first track.' },
  { category: 'Creative', title: 'Digital Art', blurb: 'Illustration, concept art, and colour from the ground up.' },
  { category: 'Creative', title: 'Photography', blurb: 'Light, composition, and editing that makes shots sing.' },
  { category: 'Languages', title: 'Spanish Fluency', blurb: 'Hold a real conversation, not just memorise verbs.' },
  { category: 'Languages', title: 'Business English', blurb: 'Email, meetings, and presentations with confidence.' },
  { category: 'Skills', title: 'Public Speaking', blurb: 'Structure a talk and command the room.' },
  { category: 'Skills', title: 'Negotiation', blurb: 'Anchoring, framing, and closing without flinching.' },
];

/** The goal a picked topic stashes — identical to the shipped card's. */
export const pendingGoalFor = (topic: Topic) => `${topic.title} — ${topic.blurb}`;

const EYEBROW = 'A course for anything';

/** 01 — The Index. A back-of-book index with dot leaders and folios. */
export const C01 = {
  eyebrow: EYEBROW,
  headline: 'See yourself in one of *these*.',
  note: 'Pick one as your starting goal.',
  cta: 'Start from your own goal',
} as const;

/** 02 — The Departure Board. Rows that flip. */
export const C02 = {
  eyebrow: EYEBROW,
  headline: 'Pick a *destination*.',
  colField: 'Field',
  colCourse: 'Course',
  cta: 'Start from your own goal',
} as const;

/** 03 — The Shelf. Sixteen spines standing on a board. */
export const C03 = {
  eyebrow: EYEBROW,
  headline: 'Take one off the *shelf*.',
  cta: 'Start from your own goal',
} as const;

/** 04 — The Wall. Three ribbons drifting past. */
export const C04 = {
  eyebrow: EYEBROW,
  headline: 'Somewhere in here is *yours*.',
  cta: 'Start from your own goal',
} as const;

/** 05 — The Reel. One topic at a time, on a rail of sixteen. */
export const C05 = {
  eyebrow: EYEBROW,
  headline: 'See yourself in one of *these*.',
  pick: 'Make this my goal',
  cta: 'Start from your own goal',
} as const;
