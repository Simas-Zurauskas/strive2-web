/**
 * Pure UI adapter — backend accounting stays in credits end-to-end. The unit
 * is passed in from the catalog so backend allowance-unit tuning scales
 * generation headroom without shifting displayed `×` multipliers.
 */

export const creditsToAllowances = (credits: number, unit: number): number => {
  if (!Number.isFinite(unit) || unit <= 0) return 0;
  return credits / unit;
};

// 0 < raw < 1 floors to "1" so the Free card never reads "0 allowances".
export const formatAllowance = (credits: number, unit: number): string => {
  const raw = creditsToAllowances(credits, unit);
  if (raw <= 0) return '0';
  const rounded = Math.round(raw);
  return rounded < 1 ? '1' : rounded.toLocaleString();
};

export const percentAllowanceRemaining = ({ balance, granted }: { balance: number; granted: number }): number => {
  if (granted <= 0) return 0;
  const pct = (balance / granted) * 100;
  return Math.max(0, Math.min(100, pct));
};
