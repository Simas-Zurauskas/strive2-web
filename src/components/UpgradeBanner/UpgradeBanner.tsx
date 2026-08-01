'use client';

import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { analytics } from '@/lib/analytics';
import * as S from './UpgradeBanner.styles';

const DISMISS_KEY = 'strive.upgradeBannerDismissed';

/**
 * Pre-wall upgrade surface. Production showed both real paying customers
 * converted at the exact moment they ran out of allowance — but the only
 * pitch in the product was the 402 failure modal, which had fired once
 * ever. This banner puts a calm, dismissible upgrade line in the learning
 * flow *before* the failure: free-plan users whose remaining balance no
 * longer covers one standard lesson.
 *
 * Free plan only — paying users below threshold already know the drill and
 * get the pill + modal; nagging subscribers is a churn risk, not a pitch.
 * No credit numbers anywhere (house rule): the unit is lessons.
 * Dismiss is per-session (sessionStorage), not permanent — the condition
 * that triggered it is still true next session.
 */
export const UpgradeBanner = () => {
  const { data: summary } = useBillingSummary();
  const { data: catalog } = useBillingPlans();
  // Lazy initializer, not a mount effect: sessionStorage is absent during
  // SSR (default hidden there), and visibility also waits on the billing
  // queries, so the first client render is null either way — no flash, no
  // hydration mismatch.
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const shownTrackedRef = useRef(false);

  const plan = summary?.plan ?? null;
  const credits = summary?.credits ?? null;
  // High end of a standard lesson's allowance cost — same catalog source
  // the pricing surfaces use, so a server-side knob change cascades here.
  const lessonCostHigh = catalog?.referenceCosts?.lessonCredits?.[1] ?? null;

  const belowOneLesson =
    plan === 'free' &&
    credits !== null &&
    lessonCostHigh !== null &&
    lessonCostHigh > 0 &&
    credits.allowance + credits.bonus < lessonCostHigh;

  const visible = belowOneLesson && !dismissed;

  useEffect(() => {
    if (!visible || shownTrackedRef.current) return;
    shownTrackedRef.current = true;
    analytics.track('upgrade_banner_shown', {});
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // State alone hides it for this mount; next mount shows it again.
    }
  };

  return (
    <S.Bar role="status">
      <S.Text>
        You&rsquo;ve used your free lessons for this month. Upgrade to keep going — plans from
        $12.99/mo, and everything you&rsquo;ve generated stays yours.
      </S.Text>
      <S.Actions>
        <S.UpgradeLink
          as={Link}
          href={ROUTES.pricing()}
          onClick={() => analytics.track('upgrade_banner_clicked', {})}
        >
          See plans
          <ArrowRight size={14} aria-hidden="true" />
        </S.UpgradeLink>
        <S.DismissButton type="button" aria-label="Dismiss" onClick={dismiss}>
          <X size={16} aria-hidden="true" />
        </S.DismissButton>
      </S.Actions>
    </S.Bar>
  );
};
