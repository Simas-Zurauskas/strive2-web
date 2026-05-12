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
    lessonCredits: [79, 79],
    lessonCreditsTopup: [103, 103],
    recallCardExtractionCredits: [2, 3],
    courseStructureCredits: [6, 24],
    moduleQuizCredits: [6, 8],
    mentorTurnCredits: [1, 2],
    recallReviewCredits: [0, 1],
  },
};
