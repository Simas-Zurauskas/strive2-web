/**
 * Build-time pricing snapshot — must mirror api/src/lib/pricingConfig.ts.
 * Used by Next.js to render concrete numbers in the SSR'd KB HTML.
 *
 * Drift safety net: `yarn kb:check` re-runs the indexer in dry mode and
 * exits non-zero if any article hash doesn't match.
 *
 * On knob change: update here, re-run `yarn kb:index` from api/, redeploy.
 */

import type { BillingCatalog } from '@/api/types';

/**
 * One-time signup grant — mirrors `pricingConfig.ts` KNOB 9
 * (`ONBOARDING_ALLOWANCE_CREDITS`). A brand-new account is created with this
 * allowance balance instead of the 200cr monthly figure; the first 30-day
 * period reset collapses it back to 200.
 *
 * It is a constant rather than a `BillingCatalog` field on purpose: the number
 * describes what a *not-yet-registered* visitor will receive, so there is no
 * authenticated catalog to read it from.
 *
 * The rule for new render sites is about GRAMMAR, not a blanket auth gate —
 * there are two today and they are correctly gated differently:
 *
 *   - Second person ("Your first course…", `PricingScreen.tsx` Free card) is a
 *     claim about the reader, so it is gated on positively being signed out
 *     (`isFree && isSignedOut`). To a signed-in viewer it would be false
 *     twice over: a free user is already past the grant, and a paid user
 *     reading it on the Free card would infer that downgrading re-triggers
 *     it, which no code path does.
 *   - Third person ("A new Free account starts with…", the pricing FAQ) is a
 *     statement about new accounts in general. It is true for every reader
 *     and is deliberately NOT auth-gated.
 *
 * So: gate the personalised phrasing, not the constant.
 *
 * The api-side `kbPricingReplacementsParity` test fails if this drifts from
 * KNOB 9 — but note it only runs where both repos are checked out, so it is
 * skipped in the api's CodeBuild deploy gate, which clones `api/` alone.
 */
export const ONBOARDING_ALLOWANCE_CREDITS = 650;

export const PRICING_SNAPSHOT: BillingCatalog = {
  plans: [
    {
      key: 'free',
      displayName: 'Free',
      description: '',
      monthlyUsd: 0,
      annualMonthlyUsd: 0,
      annualUsd: 0,
      monthlyAllowance: 200,
      maxConcurrentJobs: 3,
    },
    {
      key: 'starter',
      displayName: 'Starter',
      description: '',
      monthlyUsd: 12.99,
      annualMonthlyUsd: 10.39,
      annualUsd: Number((10.39 * 12).toFixed(2)),
      monthlyAllowance: 2000,
      maxConcurrentJobs: 3,
    },
    {
      key: 'pro',
      displayName: 'Pro',
      description: '',
      monthlyUsd: 24.99,
      annualMonthlyUsd: 19.99,
      annualUsd: Number((19.99 * 12).toFixed(2)),
      monthlyAllowance: 4400,
      maxConcurrentJobs: 3,
    },
    {
      key: 'studio',
      displayName: 'Studio',
      description: '',
      monthlyUsd: 49.99,
      annualMonthlyUsd: 39.99,
      annualUsd: Number((39.99 * 12).toFixed(2)),
      monthlyAllowance: 9600,
      maxConcurrentJobs: 3,
    },
  ],
  topupRate: {
    creditsPerUsd: 200,
    minUsd: 5,
    maxUsd: 500,
    quickPicks: [5, 10, 25, 50, 100],
  },
  allowance: {
    unit: 200,
    multipliers: { free: 1, starter: 10, pro: 22, studio: 48 },
  },
  referenceCosts: {
    // Base-lesson cost — content + mandatory supporting work only.
    // Single-point (lo === hi); asterisk in pricingFormat.ts flags the floor.
    // 2026-09-02: 79/103 → 116/152, recalibrated against 86 real lesson jobs
    // (median 116 credits). Mirrors pricingConfig.ts KNOB 6; the api-side
    // kbPricingReplacementsParity test fails if these two drift apart.
    lessonCredits: [116, 116],
    lessonCreditsTopup: [152, 152],
    recallCardExtractionCredits: [2, 3],
    courseStructureCredits: [6, 24],
    moduleQuizCredits: [6, 8],
    mentorTurnCredits: [1, 2],
    recallReviewCredits: [0, 1],
  },
};
