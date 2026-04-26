/**
 * User-facing allowance unit. 1 allowance is defined as "what the Free tier
 * grants per month" — currently 130 credits, matching `PLANS.free.monthlyAllowance`
 * (the `ALLOWANCE_UNIT` constant) in [api/src/lib/creditPricing.ts]. All
 * display math divides raw credits by this to avoid leaking implementation-
 * unit numbers to users.
 *
 * Backend accounting stays in credits end-to-end (reserve / debit / refund /
 * top-up ledger rows are all credit-denominated). This file is a pure UI
 * adapter — nothing in the API or data layer should import it.
 *
 * If `PLANS.free.monthlyAllowance` ever changes on the server, update this
 * constant in lockstep. The tight coupling is intentional: one number, one
 * unit definition, no hidden conversion table.
 */
export const CREDITS_PER_ALLOWANCE = 130;

export const creditsToAllowances = (credits: number): number =>
  credits / CREDITS_PER_ALLOWANCE;

/**
 * Display helper for headline allowance counts ("~5 allowances/month",
 * "33 allowances"). Rounds to the nearest whole allowance since fractional
 * allowances read as noise on marketing surfaces. For <1 allowance returns
 * "1" (avoids "0 allowances" on the Free card when its exact value is 1.00).
 */
export const formatAllowance = (credits: number): string => {
  const raw = creditsToAllowances(credits);
  if (raw <= 0) return '0';
  const rounded = Math.round(raw);
  return rounded < 1 ? '1' : rounded.toLocaleString();
};

/**
 * Percentage of the period's granted allowance still remaining. Clamped to
 * [0, 100]. Returns 0 when no allowance was granted (shouldn't happen for
 * authed users but is the safe default).
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
