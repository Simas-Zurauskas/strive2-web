'use client';

import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useBillingSummary } from '@/hooks/useBilling';
import * as S from './LowCreditBanner.styles';
import type { PlanKey } from '@/api/types';

const daysUntil = (date: string | Date | null | undefined): number => {
  if (!date) return 0;
  const ms = new Date(date).getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
};

/**
 * Shown on protected pages when the user is running low on allowance.
 *
 * Tiers:
 *   - 0 remaining → danger, persistent, directs to pricing (free) or top-up
 *     (paid tiers)
 *   - < 20% of monthly allowance → warning, dismissible for the session
 *
 * Dismiss state is in-memory only (no localStorage): if the user dismisses
 * a warning but the balance keeps decreasing below zero, the danger tier
 * remounts with a fresh dismissal state — they still see the critical
 * version. If we persisted dismissal, a user who ignored one warning
 * would silently hit 402s for the rest of the period.
 */
export const LowCreditBanner = () => {
  const { data: summary } = useBillingSummary();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismiss when the balance changes — a new period grant (0 → full)
  // should NOT stay dismissed forever; nor should a top-up that lifts the
  // user out of the warning zone. Effect keys off total so any movement
  // re-evaluates. The setState-in-effect is intentional: the parent
  // doesn't know the dismissal lives here, so we can't lift it out, and
  // a `key`-based remount would require parent coupling we don't want.
  useEffect(() => {
    setDismissed(false); // eslint-disable-line react-hooks/set-state-in-effect -- reset on balance change is the intent
  }, [summary?.credits.total]);

  if (!summary) return null;
  const { total, allowanceGranted, periodEnd } = summary.credits;
  const plan: PlanKey = summary.plan;

  // Danger: total = 0. Not dismissible.
  if (total === 0) {
    const days = daysUntil(periodEnd);
    const resetText = days > 0
      ? ` Allowance refreshes ${days === 1 ? 'tomorrow' : `in ${days} days`}.`
      : '';
    const upgradeTarget = plan === 'studio' ? ROUTES.billing() : ROUTES.pricing();
    const upgradeLabel = plan === 'studio' ? 'Buy top-up' : plan === 'free' ? 'See plans' : 'Upgrade';
    return (
      <S.BannerEl $tone="danger" role="alert">
        <S.Message>
          <strong>You&rsquo;re out of allowance.</strong>{resetText}
        </S.Message>
        <S.ActionLink href={upgradeTarget}>{upgradeLabel} →</S.ActionLink>
      </S.BannerEl>
    );
  }

  // Warning: < 20% of monthly grant AND not dismissed.
  const percentRemaining = allowanceGranted > 0 ? total / allowanceGranted : 1;
  const belowThreshold = percentRemaining < 0.2 && total > 0;
  if (!belowThreshold || dismissed) return null;

  const pctLabel = Math.max(1, Math.round(percentRemaining * 100));

  return (
    <S.BannerEl $tone="warning">
      <S.Message>
        <strong>{pctLabel}%</strong> of your allowance left this period
        {plan !== 'studio' && <> — consider upgrading for more headroom.</>}
      </S.Message>
      <S.ActionLink href={plan === 'studio' ? ROUTES.billing() : ROUTES.pricing()}>
        {plan === 'studio' ? 'Top up' : 'Upgrade'} →
      </S.ActionLink>
      <S.DismissBtn onClick={() => setDismissed(true)} aria-label="Dismiss">×</S.DismissBtn>
    </S.BannerEl>
  );
};
