'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  cancelSubscription,
  scheduleDowngrade,
  startCheckout,
  startPortal,
} from '@/api/routes/billing';
import type { BillingPlan, ClientApiError, PlanKey } from '@/api/types';
import { AlertDialog, Button, TopupControl } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { formatAllowance } from '@/lib/allowance';
import { formatDate } from '@/lib/formatDate';
import { QKeys } from '@/types';
import * as S from './PricingScreen.styles';

type Cadence = 'monthly' | 'annual';

// Allowance rank — used to compute upgrade vs downgrade for UX labels.
// Doesn't affect backend behavior; both directions use the same
// cancel-and-replace Checkout flow so the user gets explicit payment
// confirmation on every plan switch.
const PLAN_RANK: Record<PlanKey, number> = { free: 0, starter: 1, pro: 2, studio: 3 };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const buildCheckoutCta = ({
  planKey,
  currentPlan,
  isAuthenticated,
}: {
  planKey: PlanKey;
  currentPlan: PlanKey | undefined;
  isAuthenticated: boolean;
}): {
  label: string;
  /**
   *  - 'upgrade'   → Checkout cancel-and-replace (user pays now)
   *  - 'downgrade' → Scheduled downgrade at period end (no charge)
   *  - 'cancel'    → Scheduled cancellation at period end (no charge)
   *  - 'checkout'  → Fresh subscription for a currently-free user
   *  - 'signup'    → Route unauth'd visitor to signup first
   *  - 'current'   → Button disabled, user is already on this plan
   */
  action: 'signup' | 'checkout' | 'upgrade' | 'downgrade' | 'cancel' | 'current' | 'hidden';
} => {
  // Public visitor → always "Get started" that bounces through signup.
  if (!isAuthenticated) {
    if (planKey === 'free') return { label: 'Get started', action: 'signup' };
    return { label: `Get ${cap(planKey)}`, action: 'signup' };
  }

  // Same plan → disabled marker.
  if (planKey === currentPlan) return { label: 'Current plan', action: 'current' };

  // Targeting Free from a paid plan → native cancel flow (at period end).
  if (planKey === 'free') {
    return { label: 'Cancel subscription', action: 'cancel' };
  }

  // Free user picking a paid plan → new Checkout.
  if (currentPlan === 'free' || !currentPlan) {
    return { label: `Get ${cap(planKey)}`, action: 'checkout' };
  }

  // Paid → paid: direction dictates mechanism.
  //   - Upgrade: immediate, via Checkout cancel-and-replace (user confirms
  //     payment explicitly for the new higher tier).
  //   - Downgrade: scheduled at period end with no charge — user keeps the
  //     higher plan until it naturally ends.
  const isUpgrade = PLAN_RANK[planKey] > PLAN_RANK[currentPlan];
  return {
    label: isUpgrade ? `Upgrade to ${cap(planKey)}` : `Downgrade to ${cap(planKey)}`,
    action: isUpgrade ? 'upgrade' : 'downgrade',
  };
};

interface PendingConfirm {
  type: 'downgrade' | 'cancel';
  planKey: PlanKey;
}

export const PricingScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: summary } = useBillingSummary();
  const { data: catalog, isLoading: isCatalogLoading } = useBillingPlans();
  const [cadence, setCadence] = useState<Cadence>('monthly');

  const isAuthenticated = Boolean(user);
  const currentPlan = summary?.plan;
  // Tracks the specific plan card whose CTA is mid-flight, so only that
  // button shows the spinner. The others stay enabled-but-disabled (no
  // visual loading) — clicking another mid-redirect would race the Stripe
  // Checkout flow anyway, so disabling them is the right behavior.
  const [busyPlan, setBusyPlan] = useState<PlanKey | null>(null);
  // Confirmation dialog state for the two "no-charge, scheduled at period
  // end" actions (downgrade + cancel). Both need user confirmation because
  // they're semi-destructive — the user is giving up something at period
  // boundary without immediate feedback.
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);

  const portalMutation = useMutation({
    mutationFn: startPortal,
    meta: { errorMessage: 'Could not open billing portal — please try again.' },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: startCheckout,
    // Suppress the generic toast — we handle the 409 case ourselves by
    // auto-redirecting to Portal. All other errors still toast via the
    // explicit onError below.
    meta: { silent: true },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) => {
      const apiError = err as ClientApiError;
      // Server guard: customer already has an active subscription. Bounce
      // them to Stripe Portal where they can change plans cleanly — this
      // is the exact same flow as if our DB had known they were subscribed.
      // String-compare since the generated ErrorCode union won't include the
      // new code until codegen re-runs; the backend emits the exact value.
      if (apiError.status === 409 && (apiError.errorCode as string) === 'SUBSCRIPTION_ALREADY_EXISTS') {
        toast.info('You already have a subscription — opening billing portal to switch plans…');
        portalMutation.mutate();
        return;
      }
      toast.error(apiError.message || 'Could not start checkout — please try again.');
    },
  });

  // Navigate back to wherever the user came from (typically Profile >
  // Billing). Falls back to /profile?tab=billing if there's no history
  // (e.g. direct link to /pricing) — nothing worse than back() doing
  // nothing while the button sits there re-activated.
  const returnToReferrer = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.billing());
    }
  };

  const downgradeMutation = useMutation({
    mutationFn: scheduleDowngrade,
    meta: { errorMessage: 'Could not schedule downgrade — please try again.' },
    onSuccess: ({ scheduledPlan, periodEnd }) => {
      const dateLabel = periodEnd ? formatDate({ input: periodEnd, format: 'long' }) : 'your next billing date';
      toast.success(`Downgrade to ${cap(scheduledPlan)} scheduled for ${dateLabel}.`);
      queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
      setPendingConfirm(null);
      returnToReferrer();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    meta: { errorMessage: 'Could not schedule cancellation — please try again.' },
    onSuccess: ({ periodEnd }) => {
      const dateLabel = periodEnd ? formatDate({ input: periodEnd, format: 'long' }) : 'your next billing date';
      toast.success(`Subscription will end on ${dateLabel}. You'll stay on your current plan until then.`);
      queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
      setPendingConfirm(null);
      returnToReferrer();
    },
  });

  const handleCtaClick = (plan: BillingPlan) => {
    const cta = buildCheckoutCta({ planKey: plan.key, currentPlan, isAuthenticated });
    if (cta.action === 'signup') {
      router.push(`${ROUTES.signup()}?redirect=${encodeURIComponent(ROUTES.pricing())}`);
      return;
    }

    // Downgrade + cancel are destructive at period end — pop a confirmation
    // dialog with exact date + next-plan copy, then fire on confirm.
    if (cta.action === 'downgrade' || cta.action === 'cancel') {
      setPendingConfirm({ type: cta.action, planKey: plan.key });
      return;
    }

    setBusyPlan(plan.key);
    // Reset the busy plan if a mutation finishes without redirecting
    // (errors). The success paths redirect to Stripe so the page unmounts —
    // no need to clear state in that branch.
    const done = () => setBusyPlan((curr) => (curr === plan.key ? null : curr));

    if (cta.action === 'checkout' || cta.action === 'upgrade') {
      // Both flows use the same Checkout mutation; `replaceCurrentSubscription`
      // tells the server to skip the duplicate-subscription guard and cancel
      // the existing sub when the new one activates (upgrade path only).
      checkoutMutation.mutate(
        {
          plan: plan.key as 'starter' | 'pro' | 'studio',
          cadence,
          ...(cta.action === 'upgrade' ? { replaceCurrentSubscription: true } : {}),
        } as Parameters<typeof checkoutMutation.mutate>[0],
        { onSettled: done },
      );
      return;
    }
    // 'current' / 'hidden' are non-actions; the button is disabled so this
    // branch shouldn't fire — defensive no-op.
  };

  // Fired by the confirmation dialog's primary button. Pulls the action out
  // of state so the caller doesn't need to thread plan+type through props.
  const handleConfirm = () => {
    if (!pendingConfirm) return;
    if (pendingConfirm.type === 'cancel') {
      cancelMutation.mutate();
      return;
    }
    if (pendingConfirm.type === 'downgrade') {
      downgradeMutation.mutate({
        plan: pendingConfirm.planKey as 'starter' | 'pro',
        cadence,
      });
      return;
    }
  };

  // True while ANY plan card is mid-flight — used to disable the OTHER cards
  // (so the user doesn't fire a second redirect on top of an in-flight one).
  // The CARD that's loading uses `busyPlan === plan.key` to show its spinner.
  const anyBusy = busyPlan !== null;

  return (
    <S.Layout>
      <S.Header>
        <S.Title>One app. Pick your allowance.</S.Title>
        <S.Subtitle>
          Every plan unlocks the entire platform — the only thing that changes is how much monthly allowance you get. Allowance is used up as you generate courses, lessons, and quizzes, and refunded in full on any failure.
        </S.Subtitle>

        <S.CadenceToggle role="tablist" aria-label="Billing cadence">
          <S.CadenceBtn $active={cadence === 'monthly'} onClick={() => setCadence('monthly')} role="tab" aria-selected={cadence === 'monthly'}>
            Monthly
          </S.CadenceBtn>
          <S.CadenceBtn $active={cadence === 'annual'} onClick={() => setCadence('annual')} role="tab" aria-selected={cadence === 'annual'}>
            Annual
            <S.SavingsChip>Save 20%</S.SavingsChip>
          </S.CadenceBtn>
        </S.CadenceToggle>
      </S.Header>

      {!isCatalogLoading && catalog && (
        <S.Grid>
          {catalog.plans.map((plan) => {
            const priceMonthly = cadence === 'monthly' ? plan.monthlyUsd : plan.annualMonthlyUsd;
            const cta = buildCheckoutCta({ planKey: plan.key, currentPlan, isAuthenticated });
            const isPro = plan.key === 'pro';
            const allowanceLabel = formatAllowance(plan.monthlyAllowance);
            // "×" suffix on paid plans compares to Free (1× by definition).
            // Free shows just "1" without the multiplier since there's nothing
            // to compare against.
            const isFree = plan.key === 'free';

            return (
              <S.Card key={plan.key} $highlighted={isPro}>
                {isPro && <S.HighlightRibbon>Most popular</S.HighlightRibbon>}
                <S.PlanName>{plan.displayName}</S.PlanName>
                <S.PlanDescription>{plan.description}</S.PlanDescription>

                <S.PriceRow>
                  {isFree ? (
                    <S.Price>$0</S.Price>
                  ) : (
                    <>
                      <S.Price>${priceMonthly.toFixed(2)}</S.Price>
                      <S.PriceMeta>/ month</S.PriceMeta>
                    </>
                  )}
                </S.PriceRow>

                <S.AllowanceBlock>
                  <S.AllowanceNumber>
                    {isFree ? allowanceLabel : <>{allowanceLabel}<S.AllowanceMultiplier>×</S.AllowanceMultiplier></>}
                  </S.AllowanceNumber>
                  <S.AllowanceUnit>
                    {isFree ? 'Baseline usage / month' : 'Baseline usage'}
                  </S.AllowanceUnit>
                </S.AllowanceBlock>

                <S.CardFooter>
                  <Button
                    variant={isPro ? 'primary' : 'secondary'}
                    disabled={cta.action === 'current' || cta.action === 'hidden' || anyBusy || isAuthLoading}
                    loading={busyPlan === plan.key}
                    onClick={() => handleCtaClick(plan)}
                  >
                    {cta.label}
                  </Button>
                </S.CardFooter>
              </S.Card>
            );
          })}
        </S.Grid>
      )}

      {catalog && (
        <S.TopupsSection>
          <S.TopupsTitle>Need more mid-month? Top up any amount</S.TopupsTitle>
          <S.Subtitle style={{ margin: 0, textAlign: 'left' }}>
            Available on any plan. Pay once — the allowance never expires and is used after your monthly allowance runs out. Pay-as-you-go is priced ~25% above Starter's per-credit rate; subscriptions remain the cheaper recurring option.
          </S.Subtitle>
          {isAuthenticated ? (
            <TopupControl />
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                toast.info('Sign in to purchase allowance.');
                router.push(`${ROUTES.signup()}?redirect=${encodeURIComponent(ROUTES.pricing())}`);
              }}
            >
              Sign in to top up
            </Button>
          )}
        </S.TopupsSection>
      )}

      <S.FaqSection>
        <S.FaqTitle>Common questions</S.FaqTitle>

        <S.FaqItem>
          <summary>What's the difference between the plans?</summary>
          <p>
            Only the monthly allowance. Every plan unlocks the same features — course generation, hero images, curated
            links, interactive exercises, and spaced-review cards. Pick the tier that matches how much you plan to generate each month.
          </p>
        </S.FaqItem>

        <S.FaqItem>
          <summary>How does allowance work?</summary>
          <p>
            Every AI-generated piece of content — a course outline, a lesson, a quiz — draws from your monthly allowance.
            A full lesson uses about a third of one allowance unit; a whole course design uses about half. Your allowance
            refreshes at the start of each billing period. Top-up allowance never expires and is used after your monthly
            pool runs out.
          </p>
        </S.FaqItem>

        <S.FaqItem>
          <summary>What happens if a generation fails?</summary>
          <p>
            Allowance is fully refunded on any failure — network, provider outage, timeout, or cancellation. You only pay
            for generations that finish and persist.
          </p>
        </S.FaqItem>

        <S.FaqItem>
          <summary>Can I cancel anytime?</summary>
          <p>
            Yes. Cancel from the billing portal and you retain access plus your remaining allowance through the end of your
            current billing period, then drop to the Free tier. No partial-month refunds.
          </p>
        </S.FaqItem>

        <S.FaqItem>
          <summary>What about taxes?</summary>
          <p>
            Prices are in USD. Stripe handles any applicable VAT or sales tax at checkout based on your billing address.
          </p>
        </S.FaqItem>
      </S.FaqSection>

      {/* Confirmation for the two no-charge, scheduled-at-period-end actions */}
      <AlertDialog
        open={pendingConfirm !== null}
        title={pendingConfirm?.type === 'cancel'
          ? 'Cancel subscription?'
          : `Downgrade to ${pendingConfirm ? cap(pendingConfirm.planKey) : ''}?`}
        description={(() => {
          if (!pendingConfirm || !summary) return null;
          const periodEndLabel = summary.credits.periodEnd
            ? formatDate({ input: summary.credits.periodEnd, format: 'long' })
            : 'your next billing date';

          if (pendingConfirm.type === 'cancel') {
            return (
              <>
                You'll keep full <strong>{summary.displayName}</strong> access until{' '}
                <strong>{periodEndLabel}</strong>. After that your account drops to Free.{' '}
                No refund for the current period.
              </>
            );
          }

          const targetPlan = catalog?.plans.find((p) => p.key === pendingConfirm.planKey);
          const priceLabel = targetPlan ? `$${targetPlan.monthlyUsd.toFixed(2)}/month` : '';

          return (
            <>
              You'll keep your <strong>{summary.displayName}</strong> plan until{' '}
              <strong>{periodEndLabel}</strong>, then switch to{' '}
              <strong>{cap(pendingConfirm.planKey)}</strong>
              {priceLabel ? <> at <strong>{priceLabel}</strong></> : ''}.{' '}
              No charge today.
            </>
          );
        })()}
        confirmLabel={pendingConfirm?.type === 'cancel' ? 'Confirm cancellation' : 'Confirm downgrade'}
        cancelLabel={pendingConfirm?.type === 'cancel' ? 'Keep my plan' : 'Keep current plan'}
        // Both actions use neutral confirm styling. Matches industry
        // convention (Stripe, Netflix, Apple, Notion, Figma): red is
        // reserved for irreversible/data-destructive actions (delete
        // account). Cancel + downgrade are reversible plan changes —
        // neutral is the professional tone here.
        variant="neutral"
        loading={downgradeMutation.isPending || cancelMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setPendingConfirm(null)}
      />
    </S.Layout>
  );
};

export default PricingScreen;
