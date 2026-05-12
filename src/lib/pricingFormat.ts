/**
 * Pricing formatters — derived from BillingCatalog. UI must route through
 * these, never compute inline; a knob bump on the API side cascades to every
 * mounted view on next refresh.
 */

import type { BillingCatalog, PlanKey } from '@/api/types';

const plan = (catalog: BillingCatalog, key: PlanKey) =>
  catalog.plans.find((p) => p.key === key) ?? null;

// mode='bonus' translates top-up dollars/bonus balances — uses the higher
// `lessonCreditsTopup` ref, since bonus credits pay the higher lesson markup.
const lessonRange = (
  credits: number,
  catalog: BillingCatalog,
  mode: 'allowance' | 'bonus' = 'allowance',
): [number, number] => {
  if (!Number.isFinite(credits) || credits <= 0) return [0, 0];
  const [lo, hi] = mode === 'bonus'
    ? (catalog.referenceCosts.lessonCreditsTopup ?? catalog.referenceCosts.lessonCredits)
    : catalog.referenceCosts.lessonCredits;
  if (!hi || !lo) return [0, 0];
  return [Math.max(0, Math.floor(credits / hi)), Math.max(0, Math.floor(credits / lo))];
};

const fmtRange = (range: [number, number], unit: string): string => {
  const [lo, hi] = range;
  if (lo === hi) return `≈ ${lo} ${unit}${lo === 1 ? '' : 's'}`;
  return `≈ ${lo}–${hi} ${unit}s`;
};

// Disambiguates the lesson unit on every "≈ N lessons*" chip. Surface once
// per page so the asterisks resolve.
export const BASE_LESSON_FOOTNOTE =
  'Estimates reflect a standard lesson. Optional enrichments — hero image, curated links, audio narration — draw a bit more from your allowance when enabled.';

export const formatPlanLessonsPerMonth = (key: PlanKey, catalog: BillingCatalog): string => {
  const p = plan(catalog, key);
  if (!p) return '';
  const range = lessonRange(p.monthlyAllowance, catalog);
  if (range[1] === 0) return '';
  // Trailing asterisk → see BASE_LESSON_FOOTNOTE.
  if (range[0] === range[1]) return `≈ ${range[0]} lesson${range[0] === 1 ? '' : 's'}* / month`;
  return `≈ ${range[0]}–${range[1]} lessons* / month`;
};

// "1×" reads as confused on a comparison row, so suppress for Free.
export const formatPlanMultiplier = (key: PlanKey, catalog: BillingCatalog): string => {
  if (key === 'free') return '';
  const mult = catalog.allowance.multipliers[key];
  if (!mult) return '';
  return `${mult}×`;
};

export const planUsdPerCredit = (key: PlanKey, catalog: BillingCatalog): number => {
  const p = plan(catalog, key);
  if (!p || p.monthlyAllowance === 0 || p.monthlyUsd === 0) return 0;
  return p.monthlyUsd / p.monthlyAllowance;
};

export const topupUsdPerCredit = (catalog: BillingCatalog): number => {
  const rate = catalog.topupRate?.creditsPerUsd;
  if (!rate || rate <= 0) return 0;
  return 1 / rate;
};

export const formatTopupLessons = (usd: number, catalog: BillingCatalog): string => {
  const rate = catalog.topupRate?.creditsPerUsd ?? 0;
  if (!rate || !Number.isFinite(usd) || usd <= 0) return '';
  // 'bonus' mode — top-up credits pay the higher lesson markup.
  const base = fmtRange(lessonRange(usd * rate, catalog, 'bonus'), 'lesson');
  return `${base}*`;
};

export const formatTopupYardstick = (catalog: BillingCatalog): string | null => {
  const rate = catalog.topupRate?.creditsPerUsd ?? 0;
  if (!rate) return null;
  return BASE_LESSON_FOOTNOTE;
};

export const planSavingsVsTopup = (key: PlanKey, catalog: BillingCatalog): number => {
  const planRate = planUsdPerCredit(key, catalog);
  const topupRate = topupUsdPerCredit(catalog);
  if (planRate === 0 || topupRate === 0) return 0;
  return Math.max(0, 1 - planRate / topupRate);
};

export const maxPlanSavingsVsTopup = (catalog: BillingCatalog): number => {
  const paidKeys: PlanKey[] = ['starter', 'pro', 'studio'];
  const best = Math.max(0, ...paidKeys.map((k) => planSavingsVsTopup(k, catalog)));
  return Math.round(best * 20) / 20;
};

export const formatMaxSavings = (catalog: BillingCatalog): string => {
  const pct = maxPlanSavingsVsTopup(catalog);
  if (pct === 0) return '';
  return `~${Math.round(pct * 100)}%`;
};
