/**
 * Copy for the PRICING candidates.
 *
 * WHAT IS NOT IN THIS FILE: prices, plan names, allowances and lesson
 * counts. Every one of those is read live from the billing catalog through
 * `usePlanAnchors`. Only the editorial voice lives here, so a catalog
 * change never needs a copy change.
 *
 * CLAIMS DISCIPLINE (§11), binding. Allowance is spoken of in lessons and
 * never in credits — the word does not appear anywhere in this directory.
 * "Every plan unlocks every feature" is on the sanctioned list. "Free tier,
 * no credit card" is sanctioned. No plan is flagged most-popular or
 * most-chosen in any candidate: a popularity flag is a soft social-proof
 * claim, and §11 rules out ratings and user counts. Nothing here states a
 * generation time or an outcome.
 *
 * `*word*` marks the single italic-serif emphasis per headline.
 */

/** Shared — the CTA and its microcopy are the product's, not the variant's. */
export const COMPARE_CTA = 'Compare all four plans';
export const START_CTA = 'Start free';
export const MICRO = 'Free tier included. No credit card.';

/** 01 — The Gauge. The lesson ladder drawn to scale. */
export const P01 = {
  eyebrow: 'Plans',
  headline: 'Measured in *lessons*.',
} as const;

/** 02 — The Marquee. Free set as the headline act; the rest is the bill. */
export const P02 = {
  rule: 'Every plan unlocks every feature',
  headline: 'Start *free*.',
  billHead: 'The full bill',
} as const;

/** 03 — The Table. Small, dense, ruled; nothing but the figures. */
export const P03 = {
  eyebrow: 'Plans',
  headline: 'Every plan unlocks *every* feature.',
  cols: ['Plan', 'A month', 'Lessons'],
  rowCta: 'Start',
} as const;

/** 04 — The Packets. Three printed envelopes on a shelf line. */
export const P04 = {
  eyebrow: 'Plans',
  headline: 'Start free. Grow when you *need* to.',
  panel: 'Contains',
  ctas: {
    free: 'Start free',
    starter: 'Choose Starter',
    pro: 'Choose Pro',
  },
} as const;

/** 05 — The Sentence. One line, the figures glossed beneath. */
export const P05 = {
  lead: 'Start',
  joinFirst: '— then',
  joinSecond: 'or',
  tail: 'a month.',
  emphasis: 'free',
} as const;

/**
 * SHARED BY 11 AND 14 — the entries a subscription holds whatever it costs.
 *
 * Verbatim from the sanctioned set the "Under the hood" candidates use
 * (`featureBento/variants.ts` B01/B02), because this is the one place a
 * pricing section is tempted to invent a feature in order to fill a column.
 * Not one line here is new: curriculum from your answers, streamed lessons,
 * TeX/Mermaid/code set in line, six voices, 3–5 cards on the 1·3·7·14·30
 * schedule. No provider is named and nothing states a time or an outcome.
 *
 * It is a flat list rather than a per-tier matrix ON PURPOSE — the tiers do
 * not differ on any of it, and a list that could be split into columns is a
 * list a designer will eventually split into columns.
 */
export const HELD_IN_COMMON = [
  'Curriculum generated from your answers',
  'Lessons streamed onto the page, block by block',
  'Code, TeX and Mermaid set in line',
  'Six narration voices',
  '3–5 recall cards per lesson · 1 · 3 · 7 · 14 · 30 days',
] as const;

/**
 * 11 — The Standard. The conventional three-column pricing row, written
 * plainly because the layout is doing the explaining.
 *
 * The headline names the ONE thing a visitor is actually choosing, and
 * `lede` is the sanctioned standing claim followed by the single axis the
 * tiers differ on — stated once, above all three cards, so no card has to
 * repeat it and turn it into a per-tier feature.
 *
 * `allowanceHead` carries the period ("each month"), which is why the cards
 * render the catalog's `lessonsShort` rather than the full string.
 * `includedHead` heads the flat `HELD_IN_COMMON` list beneath the cards: a
 * list that sits under all three at once cannot be misread as belonging to
 * one of them. `ctaPaid` is a verb — the catalog's own display name is
 * appended at render time, so no plan name is spelled in this file; the
 * free tier reuses the shared `START_CTA`.
 */
export const P11 = {
  eyebrow: 'Pricing',
  headline: 'Choose how much you *generate*.',
  lede: 'Every plan unlocks every feature. The plan you pick sets how many lessons you generate in a month, and nothing else.',
  allowanceHead: 'Included each month',
  includedHead: 'On every plan',
  ctaPaid: 'Get',
} as const;

/**
 * 12 — The Comparison. A comparison table split into two labelled row
 * groups, where the split is the argument.
 *
 * `rows` are the only two facts that differ across the columns. `same` are
 * facts whose three cells are identical, and they are in the table PRECISELY
 * so a visitor can see that the cheapest column is not missing anything —
 * the honest inverse of a feature-gating matrix. Every line of `same` is the
 * /pricing FAQ's own answer, compressed: features are not gated by tier;
 * courses, notes, quiz attempts and recall progress stay with the account on
 * any plan and after a cancellation; a failed generation is refunded in
 * full; cancellation is available at any time. Nothing is softened, nothing
 * is added.
 *
 * `tickLabel` is what the tick glyph says out loud — a table cell that is
 * only an icon has to announce something. `cornerLabel` names the blank
 * top-left cell for the same reason.
 */
export const P12 = {
  eyebrow: 'Compare plans',
  headline: 'The plans differ in *two* rows.',
  lede: 'Price, and how many lessons you can generate in a month. Everything else on this table is the same whichever plan you pick.',
  cornerLabel: 'Plan',
  groupChanges: 'What changes',
  groupSame: 'The same on every plan',
  rows: { price: 'Price a month', lessons: 'Lessons a month' },
  same: [
    'Every feature unlocked',
    'Everything you generate stays yours',
    'A failed generation is refunded in full',
    'Cancel any time',
  ],
  tickLabel: 'Included',
  ctaPaid: 'Get',
} as const;

/**
 * 13 — The Band. The compact one: one line of head, one row of three, and
 * done.
 *
 * There is no lede because there is no room for one and nothing that needs
 * saying twice — `claim` is the sanctioned standing claim set beside the
 * headline, stated once for the whole band rather than inside each segment.
 * The headline says what the band shows: the tiers are three rates on one
 * product, not three products.
 *
 * `ctaPaid` follows the house pattern — a verb with the catalog's display
 * name appended at render time; the free tier reuses `START_CTA`.
 */
export const P13 = {
  headline: 'Three plans, *one* product.',
  claim: 'Every plan unlocks every feature',
  ctaPaid: 'Get',
} as const;

/**
 * 14 — Free First. Conventional pricing arranged around the action the
 * product actually wants: start free, with the paid tiers as a ladder.
 *
 * The headline is the sanctioned standing claim turned toward the free
 * tier, which is where it does the most work: a visitor's first suspicion
 * about a free plan is that it is a crippled demo, and the one thing worth
 * saying is that it is not. `lede` states the claim plainly and names the
 * only axis the tiers differ on.
 *
 * `micro` is the /pricing FAQ's own "No credit card required to start",
 * clipped to fit under a button. `cols` states the period once at the head
 * of the ladder, which is why the cells render `lessonsShort`.
 *
 * `commonHead` heads the flat `HELD_IN_COMMON` list. It says "including the
 * free one" for the same reason the headline does — the list would
 * otherwise be read as belonging to whatever tier it sits nearest.
 */
export const P14 = {
  eyebrow: 'Plans',
  headline: 'Every feature, on the *free* plan too.',
  lede: 'Every plan unlocks every feature. The plan you pick settles how many lessons you generate in a month, and nothing else.',
  micro: 'No credit card required.',
  ladderHead: 'If you need more in a month',
  cols: ['Plan', 'A month', 'Lessons a month'],
  commonHead: 'On every plan, including the free one',
} as const;

/**
 * 15 — The Lineup. The restrained one: three tiers, generous air, alignment
 * instead of boxes.
 *
 * The headline invites a choice without recommending one — no tier is
 * named, ranked or preferred anywhere in this object, which is the whole
 * discipline of this candidate. `lede` is the sanctioned standing claim
 * followed by the single axis of difference.
 *
 * `metaLabel` states the period once above the estimate so each column can
 * render `lessonsShort` and the three values keep the same shape down the
 * row. `ctaPaid` is a verb with the catalog's own display name appended at
 * render time — the /pricing page's wording — so no plan name is spelled
 * here; the free tier reuses the shared `START_CTA`.
 */
export const P15 = {
  eyebrow: 'Plans',
  headline: 'Pick the plan that fits your *month*.',
  lede: 'Every plan unlocks every feature. The only difference is how many lessons you can generate in a month.',
  metaLabel: 'Each month',
  commonHead: 'On every plan',
  ctaPaid: 'Get',
} as const;

/**
 * 19 — The Split. Free as the primary panel, the two paid tiers as a
 * compact list beside it.
 *
 * A heading and an eyebrow, and that is the whole editorial budget. There
 * is no lede, no column label, no per-tier note and no CTA verb: the
 * layout states the offer, the catalog states the figures, and anything
 * this file added on top of that would be a word the visitor has to read
 * before reaching a price.
 *
 * The paid buttons carry the catalog's own display name, so no plan name
 * is spelled here; the free panel reuses the shared `START_CTA` and the
 * shared `MICRO`. The columns render `plan.lessons` — the estimate with
 * its period and asterisk intact — which is exactly why no label is
 * needed above it. `HELD_IN_COMMON` runs once beneath both halves under
 * `P13.claim`, the sanctioned standing line.
 */
export const P19 = {
  eyebrow: 'Plans',
  headline: 'Simple pricing. Start free.',
} as const;

/**
 * 20 — The Card. One bordered container, three hairline-divided segments.
 *
 * Same editorial budget as 19 and for the same reason, minus even the
 * shared-capabilities list: this candidate is the compact one, and the
 * only thing it owes the visitor at this scroll position is three prices
 * on one baseline with a way in under each.
 */
export const P20 = {
  eyebrow: 'Plans',
  headline: 'Simple pricing. Start free.',
} as const;

/**
 * 16 · 17 · 18 — three layouts, one editorial budget.
 *
 * These three candidates differ in layout ONLY, so they carry identical
 * copy: an eyebrow and a heading, and nothing else. Everything else on
 * screen is the billing catalog's own — plan name, price, the "a month"
 * suffix, and `plan.lessons`, the sanctioned estimate with its period and
 * asterisk intact. Rendering the full estimate rather than the clipped one
 * is deliberate: it means no column heading, allowance label or caption
 * has to be written to make the line read.
 *
 * The buttons are the shared `START_CTA` on the free tier and the
 * catalog's own display name on the two paid tiers, so no button prose is
 * composed anywhere. Beneath the tiers each candidate shows the shared
 * `MICRO` once, then the shared lesson footnote and `COMPARE_CTA`.
 */
export const P16 = {
  eyebrow: 'Plans',
  headline: 'Simple pricing. Start free.',
} as const;

export const P17 = {
  eyebrow: 'Plans',
  headline: 'Simple pricing. Start free.',
} as const;

export const P18 = {
  eyebrow: 'Plans',
  headline: 'Simple pricing. Start free.',
} as const;

/**
 * 24 · 25 — refinements of 16, and therefore NOT new copy objects.
 *
 * Both are variant 16 re-drawn: 24 by subtraction, 25 by weight. Neither
 * changes a single word, so both import `P16` directly rather than
 * declaring a `P24`/`P25` of their own. A duplicated pair of strings is a
 * pair of strings that can drift, and the point of these two candidates is
 * that the client is comparing craft against a fixed text.
 *
 * The rest is as it is for 16 · 17 · 18 above: the catalog supplies the
 * plan name, the price, the "a month" suffix and the full `plan.lessons`
 * estimate; the buttons are the shared `START_CTA` and the catalog's own
 * display names; beneath the tiers, the shared `MICRO`, the shared lesson
 * footnote and `COMPARE_CTA`.
 */

/**
 * 21 · 22 · 23 — the same arrangement, and for the same reason.
 *
 * Three more refinements of 16 — by weight, by the placement of the brand
 * gold, and by giving the free tier the row's only filled surface. All
 * three are craft studies against a fixed text, so all three import `P16`
 * and declare no `P21`/`P22`/`P23` of their own. Every other string they
 * render is the catalog's (name, price, period, `plan.lessons`) or one of
 * the shared exports at the top of this file.
 *
 * In particular: none of them adds a caption, a column label, a per-tier
 * note or a badge, and none of them flags a tier as popular or
 * recommended. 23's free tier is emphasised by surface and elevation only
 * — a door that costs nothing is a fact about the offer, and the moment it
 * needs a word to explain it, it has become a claim.
 */
