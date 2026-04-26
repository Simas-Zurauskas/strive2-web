'use client';

import { useBillingSummary, useBillingPlans } from '@/hooks/useBilling';
import { ROUTES } from '@/constants/routes';
import { percentAllowanceRemaining } from '@/lib/allowance';
import * as S from './CreditPill.styles';

const WARNING_PCT = 20;
const DANGER_PCT = 5;

// Three mutually-exclusive states the pill can be in — each answers a
// different question for the user:
//   "bar"    → you're spending your monthly allowance (show % remaining)
//   "bonus"  → monthly is gone; you're now spending paid top-up ($X.XX)
//   "empty"  → nothing left (upgrade / top up to continue)
type PillState =
  | { kind: 'bar'; pct: number; tone: S.CreditPillTone }
  | { kind: 'bonus'; usd: string }
  | { kind: 'empty' };

const toneForPct = (pct: number): S.CreditPillTone => {
  if (pct <= DANGER_PCT) return 'danger';
  if (pct <= WARNING_PCT) return 'warning';
  return 'neutral';
};

/**
 * Top-nav allowance pill. Three states (see PillState), chosen by which
 * bucket is currently being spent from. Debit order is allowance → bonus,
 * so the state machine mirrors what the user will feel next:
 *
 *   allowance > 0             → bar of monthly %, no dollar
 *   allowance = 0, bonus > 0  → dollar value of remaining top-up
 *   both = 0                  → "Out of allowance" (danger)
 *
 * Bonus is deliberately hidden while monthly allowance is non-empty —
 * surfacing it early would create a dissonant "you have extra!" nudge
 * against a shrinking bar. It appears only when it starts being used.
 */
export const CreditPill = () => {
  const { data: summary } = useBillingSummary();
  const { data: catalog } = useBillingPlans();
  if (!summary) return null;

  const { allowance, allowanceGranted, bonus } = summary.credits;
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;

  const state: PillState = (() => {
    if (allowance > 0) {
      const pct = percentAllowanceRemaining({ balance: allowance, granted: allowanceGranted });
      return { kind: 'bar', pct, tone: toneForPct(pct) };
    }
    if (bonus > 0 && topupRate > 0) {
      return { kind: 'bonus', usd: `$${(bonus / topupRate).toFixed(2)}` };
    }
    return { kind: 'empty' };
  })();

  const ariaLabel = (() => {
    if (state.kind === 'bar') return `${Math.round(state.pct)}% monthly allowance remaining. Click to manage billing.`;
    if (state.kind === 'bonus') return `${state.usd} of top-up allowance remaining. Click to manage billing.`;
    return 'Out of allowance. Click to manage billing.';
  })();

  const tone: S.CreditPillTone =
    state.kind === 'bar' ? state.tone : state.kind === 'bonus' ? 'neutral' : 'danger';

  return (
    <S.PillLink href={ROUTES.billing()} $tone={tone} aria-label={ariaLabel}>
      {state.kind === 'bar' && (
        <>
          <S.Label>Allowance</S.Label>
          <S.BarTrack>
            <S.BarFill $pct={state.pct} $tone={state.tone} />
          </S.BarTrack>
        </>
      )}
      {state.kind === 'bonus' && (
        <>
          <S.Amount>{state.usd}</S.Amount>
          <S.Label>Allowance</S.Label>
        </>
      )}
      {state.kind === 'empty' && <S.Label>Out of allowance</S.Label>}
    </S.PillLink>
  );
};
