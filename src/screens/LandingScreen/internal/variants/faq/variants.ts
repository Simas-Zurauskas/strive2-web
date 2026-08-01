/**
 * Copy and cuts for the FAQ candidates.
 *
 * ⚠ THE QUESTIONS AND ANSWERS THEMSELVES ARE NOT IN THIS FILE, AND MUST
 * NOT BE. `FAQ` in `../../../constants` also builds the FAQPage JSON-LD on
 * `app/(auth)/page.tsx`; a variant that reworded an answer would put the
 * page's structured data out of step with the page. Every candidate below
 * therefore renders the shipped strings verbatim and changes only how they
 * are set. What lives here is the section furniture — eyebrow, headline —
 * plus two editorial *cuts* over the existing array:
 *
 *   GROUPS (variant 04) gathers all nine questions under three concerns.
 *   Nothing is dropped, so the JSON-LD stays exactly true.
 *
 *   FEATURED (variant 05) promotes three questions to full display size and
 *   leaves the other six in a register beneath — all nine still rendered,
 *   all nine still in the DOM, so again nothing about the structured data
 *   changes. A version of 05 that actually *dropped* the six would need the
 *   JSON-LD trimmed to match; see the harness note.
 *
 * Indices point into `FAQ` in source order:
 *   0 wrapper · 1 allowance · 2 privacy · 3 generation time ·
 *   4 what can be learned · 5 own documents · 6 quiz vs recall ·
 *   7 editing · 8 mobile app
 *
 * `*word*` marks the single italic-serif emphasis per headline.
 */

export const F01 = {
  eyebrow: 'Common questions',
  headline: 'Asked, and *answered*.',
} as const;

export const F02 = {
  eyebrow: 'Common questions',
  // Deliberately not "Pick a question": the phone form drops the register
  // and prints every page, so an instruction to pick would be an
  // instruction with nothing to act on. This headline is true of both
  // drawings.
  headline: 'Every question, in *full*.',
  runningHead: 'Common questions',
} as const;

export const F03 = {
  eyebrow: 'On the record',
  headline: 'The whole *exchange*.',
  markQ: 'Q',
  markA: 'A',
} as const;

export const F04 = {
  eyebrow: 'Common questions',
  headline: 'Three things people *ask* about.',
  groups: [
    { numeral: 'I', title: 'What it is', items: [0, 4, 6] },
    { numeral: 'II', title: 'How it works', items: [3, 5, 7] },
    { numeral: 'III', title: 'The fine print', items: [1, 2, 8] },
  ],
} as const;

export const F05 = {
  eyebrow: 'Common questions',
  headline: 'Three you’ll *ask* first.',
  featured: [0, 2, 1],
  registerHead: 'Also asked',
} as const;

export const F06 = {
  eyebrow: 'Common questions',
  // Imperative on purpose. Variant 06 opens with every answer shut, and a
  // headline that tells the visitor the object in front of them is an
  // index is the shortest way to make that read as a form rather than as
  // something withheld.
  headline: 'Look it *up*.',
  // Running head of the index proper. No letter list and no count: the
  // bands are derived from the questions at render time, so any string
  // naming them would have to be maintained by hand against an array that
  // can change underneath it.
  indexHead: 'Index of questions',
  sortNote: 'A–Z',
} as const;

export const F07 = {
  eyebrow: 'Common questions',
  headline: 'The book of *enquiries*.',
  // Column heads for the ledger. `colReply` does double duty: it labels
  // the action column on desktop and becomes the small-cap label above
  // the answer on phones, where the hanging margin mark has no margin to
  // hang in.
  colNo: 'No.',
  colEnquiry: 'Enquiry',
  colReply: 'Reply',
  // Action words, not state words — they say what a click does. The state
  // itself is carried by `aria-expanded`, so these are `aria-hidden` and
  // never have to be read as a status.
  actionOpen: 'Open',
  actionClose: 'Close',
} as const;

export const F08 = {
  // Review: the section has to announce itself. "FAQ" is the label every
  // visitor already knows, and the headline states plainly what the page
  // does rather than describing the object it is drawn as — the earlier
  // "Every entry, glossed." was a caption for the design, not for the
  // reader. The folio enumeration ("Entries 01–09") went with it: a count
  // of questions is chrome, and it dated the section every time one was
  // added.
  eyebrow: 'FAQ',
  headline: 'Questions, answered.',
  runningHead: 'FAQ',
  // Standing note on the empty recto. Spatial and desktop-only, so it is
  // hidden from assistive tech; the buttons carry their own state.
  blankLeaf: 'Pick a question. The answer appears here.',
} as const;

export const F09 = {
  eyebrow: 'Common questions',
  headline: 'Unfold the one you *need*.',
  // Edition mark set into the masthead rule. The range is computed from
  // the array at render time rather than written out here, so it cannot
  // fall out of step with the questions.
  sheetMark: 'Folded sheet',
} as const;

export const F10 = {
  eyebrow: 'Common questions',
  headline: 'Notes in the *margin*.',
  // Column heads for the ruled page. Purely a reading aid — both are
  // `aria-hidden`, and "Answer" is dropped on phones where the answers
  // sit under their own query rather than in a column of their own.
  marginHead: 'Queries',
  measureHead: 'Answers',
} as const;
