'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { startPortal } from '@/api/routes/billing';
import { Button } from '@/components/Button';
import { HelpAnchor } from '@/components/HelpAnchor';
import { TopupControl } from '@/components/TopupControl';
import { ROUTES } from '@/constants/routes';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { percentAllowanceRemaining } from '@/lib/allowance';
import { formatDate } from '@/lib/formatDate';
import * as S from './BillingPanel.styles';
import type { BillingPlan, BillingSummary, PlanKey, SubscriptionStatus } from '@/api/types';

const statusTone = (status: SubscriptionStatus, cancelAtPeriodEnd: boolean): 'active' | 'warning' | 'canceled' => {
  if (cancelAtPeriodEnd) return 'warning';
  if (status === 'active') return 'active';
  if (status === 'past_due' || status === 'canceling') return 'warning';
  return 'canceled';
};

const statusLabel = (status: SubscriptionStatus, cancelAtPeriodEnd: boolean): string => {
  if (cancelAtPeriodEnd) return 'Canceling';
  if (status === 'active') return 'Active';
  if (status === 'past_due') return 'Payment issue';
  if (status === 'canceling') return 'Canceling';
  return 'Canceled';
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const daysUntil = (date: string | Date | null | undefined): number | null => {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  if (!Number.isFinite(ms)) return null;
  return Math.max(0, Math.ceil(ms / MS_PER_DAY));
};

const planDisplayName = (key: PlanKey, plans: BillingPlan[] | undefined): string =>
  plans?.find((p) => p.key === key)?.displayName ?? key;

const formatPriceWithCadence = ({
  plan,
  cadenceHint,
}: {
  plan: BillingPlan | undefined;
  cadenceHint: 'monthly' | 'annual';
}): string => {
  if (!plan) return '';
  const usd = cadenceHint === 'annual' ? plan.annualUsd : plan.monthlyUsd;
  return `$${usd.toFixed(2)}/${cadenceHint === 'annual' ? 'year' : 'month'}`;
};

/**
 * Build the renewal sentence shown beneath the plan name. Replaces the
 * previous separate colored callout — quiet text inside the plan card
 * is enough for the normal active/free path, and the warning tone on
 * the card border signals past_due / canceling visually.
 */
const buildRenewalCopy = ({
  summary,
  plans,
}: {
  summary: BillingSummary;
  plans: BillingPlan[] | undefined;
}): React.ReactNode => {
  const { plan, status, cancelAtPeriodEnd, pendingPlan, credits } = summary;
  const isPaid = plan !== 'free';
  const dateLabel = credits.periodEnd ? formatDate({ input: credits.periodEnd, format: 'long' }) : null;
  const days = daysUntil(credits.periodEnd);
  const inLabel = days === null ? '' : days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
  const dateBlock = dateLabel ? (
    <>
      <strong>{dateLabel}</strong>
      {inLabel ? ` (${inLabel})` : ''}
    </>
  ) : null;

  if (status === 'past_due') {
    return (
      <>
        Your last payment failed and Stripe is retrying. Update your card from the billing portal —
        if it doesn&rsquo;t recover in a few days, your subscription drops to Free.
      </>
    );
  }

  if (isPaid && cancelAtPeriodEnd) {
    return (
      <>
        Your subscription ends on {dateBlock}, then drops to Free. Reactivate from the billing
        portal to keep your plan running.
      </>
    );
  }

  if (isPaid && pendingPlan && pendingPlan !== plan) {
    const targetPlan = plans?.find((p) => p.key === pendingPlan);
    const targetName = planDisplayName(pendingPlan, plans);
    const targetPrice = formatPriceWithCadence({ plan: targetPlan, cadenceHint: 'monthly' });
    return (
      <>
        On {dateBlock}, your plan switches to <strong>{targetName}</strong>
        {targetPrice ? <> at <strong>{targetPrice}</strong></> : null}.
      </>
    );
  }

  if (isPaid) {
    const currentPlanDef = plans?.find((p) => p.key === plan);
    const renewalPrice = formatPriceWithCadence({ plan: currentPlanDef, cadenceHint: 'monthly' });
    return (
      <>
        Auto-renews on {dateBlock}
        {renewalPrice ? <> at <strong>{renewalPrice}</strong></> : null}. Cancel any time from the
        billing portal.
      </>
    );
  }

  // Free tier
  return (
    <>
      Your free allowance refreshes on {dateBlock}. Upgrade any time to get more capacity that
      doesn&rsquo;t reset to zero each cycle.
    </>
  );
};

/**
 * Plan + allowance + top-up. Three editorial cards stacked vertically —
 * Plan (identity + status + renewal + upgrade CTAs), Allowance (the
 * single most important number on the surface, big italic-serif), and
 * Top-up (buy more capacity that never expires). Embedded in the
 * Profile screen's Billing tab.
 */
export const BillingPanel: React.FC = () => {
  const router = useRouter();
  const { data: summary, isLoading: summaryLoading } = useBillingSummary();
  const { data: catalog } = useBillingPlans();

  const portalMutation = useMutation({
    mutationFn: startPortal,
    meta: { errorMessage: 'Could not open Stripe portal.' },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  if (summaryLoading || !summary) {
    return (
      <S.Wrap>
        <S.PeriodNote>Loading…</S.PeriodNote>
      </S.Wrap>
    );
  }

  const { plan, displayName, status, cancelAtPeriodEnd, credits } = summary;
  const pctRemaining = percentAllowanceRemaining({
    balance: credits.allowance,
    granted: credits.allowanceGranted,
  });

  const isPaid = plan !== 'free';
  const tone = statusTone(status, cancelAtPeriodEnd);
  const cardTone: 'default' | 'warning' = tone === 'warning' ? 'warning' : 'default';
  const renewalCopy = buildRenewalCopy({ summary, plans: catalog?.plans });

  // Bonus balance (credits) → USD display. Users bought top-ups in dollars,
  // so they should see the remaining value in dollars. Uses the catalog's
  // published rate so the math matches what was charged at checkout.
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;
  const bonusUsdLabel = topupRate > 0 && credits.bonus > 0 ? `$${(credits.bonus / topupRate).toFixed(2)}` : null;

  return (
    <S.Wrap>
      {/* ── Plan ────────────────────────────────────────── */}
      <S.PlanCard $tone={cardTone}>
        <S.PlanHeader>
          <S.PlanIdentity>
            <S.PlanEyebrow>Current plan</S.PlanEyebrow>
            <S.PlanName>{displayName}</S.PlanName>
          </S.PlanIdentity>
          {/* Status pill is meaningful only for paid plans — "Active" on Free
              reads as confused, since there's no subscription to be active.
              Free is the default state and shouldn't be labeled. */}
          {isPaid && (
            <S.PlanStatus $status={tone}>
              <S.StatusDot $status={tone} aria-hidden />
              {statusLabel(status, cancelAtPeriodEnd)}
            </S.PlanStatus>
          )}
        </S.PlanHeader>

        <S.PlanRenewal>{renewalCopy}</S.PlanRenewal>

        <S.PlanActions>
          <Button onClick={() => router.push(ROUTES.pricing())}>
            {isPaid ? 'Change plan' : 'See plans'}
          </Button>
          {isPaid && (
            <Button
              variant="secondary"
              onClick={() => portalMutation.mutate()}
              loading={portalMutation.isPending}
            >
              Manage billing
            </Button>
          )}
        </S.PlanActions>
      </S.PlanCard>

      {/* ── Allowance ───────────────────────────────────── */}
      <S.AllowanceCard>
        <S.AllowanceEyebrow>
          Allowance this period <HelpAnchor concept="credits" size="sm" />
        </S.AllowanceEyebrow>
        <S.AllowanceHero>
          <S.AllowanceValue>{Math.round(pctRemaining)}%</S.AllowanceValue>
          <S.AllowanceLabel>remaining</S.AllowanceLabel>
        </S.AllowanceHero>
        <S.BarTrack>
          <S.BarFill $pct={pctRemaining} />
        </S.BarTrack>
        {bonusUsdLabel && (
          <S.BonusLine>
            <S.BonusDot aria-hidden />
            Plus <strong>{bonusUsdLabel}</strong> top-up balance
            <S.BonusSep aria-hidden>·</S.BonusSep>
            never expires
          </S.BonusLine>
        )}
      </S.AllowanceCard>

      {/* ── Top up ──────────────────────────────────────── */}
      <S.TopupCard>
        <S.TopupEyebrow>Top up</S.TopupEyebrow>
        <S.TopupTitle>Buy more, anytime.</S.TopupTitle>
        <S.TopupLead>
          One-off purchases sit on top of your monthly allowance and never reset to zero. Use them
          first when generating courses or lessons.
        </S.TopupLead>
        <TopupControl />
      </S.TopupCard>
    </S.Wrap>
  );
};
