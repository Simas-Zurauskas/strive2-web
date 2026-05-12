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
import { formatMaxSavings } from '@/lib/pricingFormat';
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

  // Bonus credits → USD using the catalog rate (matches what was charged).
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;
  const bonusUsdLabel = topupRate > 0 ? `$${(credits.bonus / topupRate).toFixed(2)}` : null;

  return (
    <S.Wrap>
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

        <S.AllowanceSection>
          <S.AllowanceEyebrow>
            Allowance this period <HelpAnchor concept="allowance" size="sm" />
          </S.AllowanceEyebrow>
          <S.AllowanceHero>
            <S.AllowanceValue>{Math.round(pctRemaining)}%</S.AllowanceValue>
            <S.AllowanceLabel>remaining</S.AllowanceLabel>
          </S.AllowanceHero>
          <S.BarTrack>
            <S.BarFill $pct={pctRemaining} />
          </S.BarTrack>
        </S.AllowanceSection>

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

      {/* ── Top up ──────────────────────────────────────── */}
      <S.TopupCard>
        <S.TopupEyebrow>Top up</S.TopupEyebrow>
        <S.TopupTitle>Buy more, anytime.</S.TopupTitle>
        <S.TopupBalance>
          Balance
          <S.BonusSep aria-hidden>·</S.BonusSep>
          <strong>{bonusUsdLabel ?? '—'}</strong>
          <S.BonusSep aria-hidden>·</S.BonusSep>
          never expires
        </S.TopupBalance>
        <S.TopupLead>
          One-off purchases sit on top of your monthly allowance and never reset to zero. Use them
          first when generating courses or lessons.
        </S.TopupLead>
        <TopupControl />
        {/* Quiet cross-link to subscription plans. Top-up rate is set
            above subscription per-credit rates so heavy users actually
            save money on a plan. The savings figure is derived live
            from the catalog — when knobs move in pricingConfig.ts,
            this copy retunes automatically. */}
        {catalog && formatMaxSavings(catalog) && (
          <S.PlanNudge>
            Heavy user? Subscription plans cost{' '}
            <strong>up to {formatMaxSavings(catalog)} less</strong> per unit of allowance.{' '}
            <S.PlanNudgeLink type="button" onClick={() => router.push(ROUTES.pricing())}>
              Compare plans →
            </S.PlanNudgeLink>
          </S.PlanNudge>
        )}
      </S.TopupCard>
    </S.Wrap>
  );
};
