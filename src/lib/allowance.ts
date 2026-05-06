/**
 * User-facing allowance unit. 1 allowance is defined as "what the Free tier
 * grants per month" — i.e. `PLANS.free.monthlyAllowance` on the API. The
 * unit is passed in by callers (read from the billing catalog response)
 * rather than hardcoded here, so backend tuning of `ALLOWANCE_UNIT` in
 * api/src/lib/creditPricing.ts silently scales actual generation headroom
 * without shifting the displayed `×` multipliers (1×, 5×, 12×, 30×).
 *
 * Backend accounting stays in credits end-to-end (reserve / debit / refund /
 * top-up ledger rows are all credit-denominated). This file is a pure UI
 * adapter — nothing in the API or data layer should import it.
 */

export const creditsToAllowances = (credits: number, unit: number): number => {
  if (!Number.isFinite(unit) || unit <= 0) return 0;
  return credits / unit;
};

/**
 * Display helper for headline allowance counts ("5", "12", "30"). Rounds
 * to the nearest whole allowance since fractional allowances read as noise
 * on marketing surfaces. For 0 < raw < 1 returns "1" so the Free card
 * never displays "0 allowances" if its exact value rounds down.
 *
 * @param credits  Raw credit count (typically `plan.monthlyAllowance` from
 *                 the catalog response).
 * @param unit     Credits per 1 allowance — pass `freePlan.monthlyAllowance`
 *                 from the same catalog so the multiplier is self-consistent
 *                 with whatever `ALLOWANCE_UNIT` the backend currently uses.
 */
export const formatAllowance = (credits: number, unit: number): string => {
  const raw = creditsToAllowances(credits, unit);
  if (raw <= 0) return '0';
  const rounded = Math.round(raw);
  return rounded < 1 ? '1' : rounded.toLocaleString();
};

/**
 * Percentage of the period's granted allowance still remaining. Clamped to
 * [0, 100]. Returns 0 when no allowance was granted (shouldn't happen for
 * authed users but is the safe default).
 *
 * Unit-free: both `balance` and `granted` are denominated in credits, so
 * this helper doesn't need the `ALLOWANCE_UNIT` knob.
 */
export const percentAllowanceRemaining = ({
  balance,
  granted,
}: {
  balance: number;
  granted: number;
}): number => {
  if (granted <= 0) return 0;
  const pct = (balance / granted) * 100;
  return Math.max(0, Math.min(100, pct));
};
