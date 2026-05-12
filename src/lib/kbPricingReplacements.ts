/**
 * KB markdown placeholder substitution — CLIENT MIRROR of
 * api/src/lib/kbPricingReplacements.ts. Must stay in lockstep: same
 * placeholder names, same formatting, so the rendered article matches the
 * text that Pinecone embedded.
 */

import type { BillingCatalog, PlanKey } from '@/api/types';

const NUM_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  20: 'twenty',
  25: 'twenty-five',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
};

const numWord = (n: number): string => NUM_WORDS[n] ?? String(n);
const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

const fmtUsd = (n: number): string => {
  if (n === 0) return '$0';
  if (Number.isInteger(n)) return `$${n}`;
  return `$${n.toFixed(2)}`;
};

const fmtLessonRange = ([lo, hi]: [number, number]): string => {
  if (lo <= 0 && hi <= 0) return 'a few lessons';
  if (lo === hi) return `${lo} lesson${lo === 1 ? '' : 's'}`;
  return `${lo}–${hi} lessons`;
};

const fmtRoundedPct = (frac: number): string => {
  const pct = Math.round((frac * 100) / 5) * 5;
  return `~${pct}%`;
};

const ALL_PLANS: PlanKey[] = ['free', 'starter', 'pro', 'studio'];

const lessonRangeFromCredits = (credits: number, catalog: BillingCatalog): [number, number] => {
  if (!Number.isFinite(credits) || credits <= 0) return [0, 0];
  const [lo, hi] = catalog.referenceCosts.lessonCredits;
  if (!hi || !lo) return [0, 0];
  return [Math.max(0, Math.floor(credits / hi)), Math.max(0, Math.floor(credits / lo))];
};

const monthlyAllowanceFor = (key: PlanKey, catalog: BillingCatalog): number =>
  catalog.allowance.unit * catalog.allowance.multipliers[key];

const usdPerCreditFor = (key: PlanKey, catalog: BillingCatalog): number => {
  const plan = catalog.plans.find((p) => p.key === key);
  if (!plan || plan.monthlyAllowance === 0 || plan.monthlyUsd === 0) return 0;
  return plan.monthlyUsd / plan.monthlyAllowance;
};

const topupUsdPerCredit = (catalog: BillingCatalog): number => {
  const rate = catalog.topupRate?.creditsPerUsd ?? 0;
  if (rate <= 0) return 0;
  return 1 / rate;
};

export const buildKbPricingReplacementsFromCatalog = (
  catalog: BillingCatalog,
): Record<string, string> => {
  const r: Record<string, string> = {};

  for (const key of ALL_PLANS) {
    const plan = catalog.plans.find((p) => p.key === key);
    if (!plan) continue;
    r[`${key}MonthlyUsd`] = fmtUsd(plan.monthlyUsd);
    if (key !== 'free') {
      r[`${key}AnnualMonthlyUsd`] = fmtUsd(plan.annualMonthlyUsd);
    }

    const mult = catalog.allowance.multipliers[key];
    r[`${key}Multiplier`] = `${mult}×`;

    const word = numWord(mult);
    const unitWord = mult === 1 ? 'unit' : 'units';
    r[`${key}AllowanceUnits`] = `${cap(word)} ${unitWord} / month`;
    r[`${key}AllowanceUnitsLower`] = `${word} ${unitWord}`;

    r[`lessonsPer${cap(key)}`] = fmtLessonRange(
      lessonRangeFromCredits(monthlyAllowanceFor(key, catalog), catalog),
    );
  }

  r['topupMinUsd'] = fmtUsd(catalog.topupRate.minUsd);
  r['topupMaxUsd'] = fmtUsd(catalog.topupRate.maxUsd);
  r['topupCreditsPerDollar'] = `${catalog.topupRate.creditsPerUsd} credits`;

  const starterPerCredit = usdPerCreditFor('starter', catalog);
  const topupPerCredit = topupUsdPerCredit(catalog);
  if (starterPerCredit > 0 && topupPerCredit > starterPerCredit) {
    r['topupVsStarterMarkupPct'] = fmtRoundedPct(
      (topupPerCredit - starterPerCredit) / starterPerCredit,
    );
  } else {
    r['topupVsStarterMarkupPct'] = '~25%';
  }

  // Catalog doesn't expose freePeriodDays today; surface on /api/billing/plans
  // if it ever needs to change.
  r['freePeriodDays'] = `30-day`;

  return r;
};

export const substitutePricingPlaceholders = (
  body: string,
  replacements: Record<string, string>,
): string => {
  let out = body;
  for (const [token, value] of Object.entries(replacements)) {
    out = out.replaceAll(`{{${token}}}`, value);
  }
  return out;
};
