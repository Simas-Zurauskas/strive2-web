/**
 * Usage ledger rows store cost as integer microcents (1 ¢ = 10 000 μ¢) to
 * stay precise when summing thousands of sub-cent LLM calls into an
 * allowance balance (see `api/src/lib/pricing.ts`). The UI never shows
 * microcents — it picks a readable unit per magnitude.
 *
 * - ≥ $1 (1 000 000 μ¢): dollars with 2 decimals, e.g. "$12.34"
 * - ≥ 1 ¢ (10 000 μ¢):   dollars with 4 decimals, e.g. "$0.1234" (the
 *                        sweet spot for lesson-level totals)
 * - < 1 ¢:               fractional cents, e.g. "0.45¢" (individual
 *                        haiku calls are often sub-cent)
 *
 * A negative input clamps to 0 — storing negative costs is already
 * rejected by the API, but we stay defensive rather than render "$-0.05".
 */

const MICROCENTS_PER_CENT = 10_000;
const MICROCENTS_PER_DOLLAR = 100 * MICROCENTS_PER_CENT;

export const formatMicroCents = (microCents: number): string => {
  const mc = Math.max(0, Math.round(microCents));
  if (mc === 0) return '$0.00';
  if (mc >= MICROCENTS_PER_DOLLAR) {
    return `$${(mc / MICROCENTS_PER_DOLLAR).toFixed(2)}`;
  }
  if (mc >= MICROCENTS_PER_CENT) {
    return `$${(mc / MICROCENTS_PER_DOLLAR).toFixed(4)}`;
  }
  return `${(mc / MICROCENTS_PER_CENT).toFixed(2)}¢`;
};
