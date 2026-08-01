'use client';

import { useBillingPlans } from '@/hooks/useBilling';
import { BASE_LESSON_FOOTNOTE, formatPlanLessonsPerMonth } from '@/lib/pricingFormat';
import type { PlanKey } from '@/api/types';

/**
 * One live-catalog adapter for all five pricing candidates.
 *
 * WHY THIS EXISTS. Every candidate needs the same four facts about the same
 * three plans, and none of them may invent any of them. Prices come from
 * `BillingPlan.monthlyUsd`; the lesson estimate comes from
 * `formatPlanLessonsPerMonth`, which is the only sanctioned translation of
 * allowance into lessons. Nothing here hardcodes a price, a plan name or a
 * lesson count, so a knob bump on the API side cascades into all five
 * variants on the next refresh, exactly as it does into the shipped teaser.
 *
 * `share` is the ONLY derived number, and it is deliberately a ratio rather
 * than a count: allowance divided by the largest anchor's allowance. Ratios
 * of allowance and ratios of lessons are identical (both divide by the same
 * reference cost), so a bar drawn from `share` is a true picture of the
 * lesson ladder without this file ever computing — or displaying — a lesson
 * number or a credit value of its own.
 *
 * VOCABULARY. Allowance is spoken of in lessons and nothing else. The word
 * "credits" does not appear in this directory.
 */

const ANCHOR_KEYS = ['free', 'starter', 'pro'] as const;

export interface PlanAnchor {
  key: PlanKey;
  /** Catalog display name — "Free", "Starter", "Pro". */
  name: string;
  /** "Free" or "$12.99". Never suffixed here; each variant sets its own. */
  price: string;
  /** '' for Free, 'a month' otherwise — so a variant can omit it. */
  per: string;
  /** e.g. "≈ 25–30 lessons* / month", straight from the sanctioned helper. */
  lessons: string;
  /**
   * The same string with a trailing "/ month" clipped, for candidates whose
   * surrounding sentence already says "a month". Presentation only — the
   * estimate, its range and its asterisk are untouched.
   */
  lessonsShort: string;
  /** 0–1 against the largest anchor. See note above. */
  share: number;
  free: boolean;
  /**
   * The catalog's own editorial blurb for the plan — the same string the
   * /pricing page prints under each plan name, authored server-side in
   * `api/src/lib/creditPricing.ts` and shipped over the billing catalog.
   *
   * Exposed at review's request: a card wants a sentence about the plan,
   * and this is the ONLY sanctioned one. Candidates must never write their
   * own — that is what produced every rejected variant in this directory.
   */
  description: string;
}

const formatPrice = (usd: number): string => {
  if (usd === 0) return 'Free';
  return `$${Number.isInteger(usd) ? usd : usd.toFixed(2)}`;
};

export const LESSON_FOOTNOTE = BASE_LESSON_FOOTNOTE;

export const usePlanAnchors = (): { ready: boolean; anchors: PlanAnchor[] } => {
  const { data, isLoading } = useBillingPlans();
  const plans = data?.plans ?? [];
  const picked = ANCHOR_KEYS.map((k) => plans.find((p) => p.key === k));
  const ready = !isLoading && !!data && picked.every(Boolean);

  if (!ready || !data) return { ready: false, anchors: [] };

  const largest = Math.max(1, ...picked.map((p) => p?.monthlyAllowance ?? 0));

  // flatMap rather than map + non-null assertion: inside the `ready` branch
  // every anchor resolved, but the narrowing is worth keeping honest.
  const anchors = picked.flatMap<PlanAnchor>((p) => {
    if (!p) return [];
    const lessons = formatPlanLessonsPerMonth(p.key, data);
    return [
      {
        key: p.key,
        name: p.displayName,
        price: formatPrice(p.monthlyUsd),
        per: p.monthlyUsd === 0 ? '' : 'a month',
        lessons,
        lessonsShort: lessons.replace(/\s*\/\s*month\s*$/, ''),
        share: p.monthlyAllowance / largest,
        free: p.monthlyUsd === 0,
        description: p.description,
      },
    ];
  });

  return { ready: true, anchors };
};
