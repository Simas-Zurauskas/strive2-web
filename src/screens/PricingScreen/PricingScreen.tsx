'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  cancelSubscription,
  scheduleDowngrade,
  startCheckout,
  startPortal,
} from '@/api/routes/billing';
import { Accordion, AccordionItem, AlertDialog, Button, HelpAnchor } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { formatAllowance } from '@/lib/allowance';
import { analytics } from '@/lib/analytics';
import { formatDate } from '@/lib/formatDate';
import { formatPlanLessonsPerMonth, BASE_LESSON_FOOTNOTE } from '@/lib/pricingFormat';
import { QKeys } from '@/types';
import * as S from './PricingScreen.styles';
import type { BillingCadence, BillingPlan, ClientApiError, PlanKey } from '@/api/types';

// UI ranking only — both directions use cancel-and-replace Checkout.
const PLAN_RANK: Record<PlanKey, number> = { free: 0, starter: 1, pro: 2, studio: 3 };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const ALLOWANCE_TAGLINE: Record<PlanKey, string> = {
  free: 'A course structure plus a few lessons',
  starter: 'A full short course or two',
  pro: 'Ongoing course building',
  studio: 'Heavy continuous use',
};

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
  action: 'signup' | 'checkout' | 'upgrade' | 'downgrade' | 'cancel' | 'current' | 'hidden';
} => {
  if (!isAuthenticated) {
    if (planKey === 'free') return { label: 'Get started', action: 'signup' };
    return { label: `Get ${cap(planKey)}`, action: 'signup' };
  }

  if (planKey === currentPlan) return { label: 'Current plan', action: 'current' };

  if (planKey === 'free') {
    return { label: 'Cancel subscription', action: 'cancel' };
  }

  if (currentPlan === 'free' || !currentPlan) {
    return { label: `Get ${cap(planKey)}`, action: 'checkout' };
  }

  // upgrade: immediate cancel-and-replace; downgrade: scheduled at period end.
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
  const [cadence, setCadence] = useState<BillingCadence>('monthly');

  const isAuthenticated = Boolean(user);
  const currentPlan = summary?.plan;

  useEffect(() => {
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    let from: 'landing' | 'top_bar' | 'modal' | 'direct' = 'direct';
    try {
      if (referrer) {
        const ref = new URL(referrer);
        const here = window.location;
        if (ref.host === here.host) {
          from = ref.pathname === '/' ? 'landing' : 'top_bar';
        }
      }
    } catch {
      // Malformed referrer — treat as direct.
    }
    analytics.track('pricing_page_viewed', { from });
  }, []);

  const handleCadenceToggle = (next: BillingCadence) => {
    if (next === cadence) return;
    setCadence(next);
    analytics.track('pricing_billing_cycle_toggled', { cycle: next });
  };
  const [busyPlan, setBusyPlan] = useState<PlanKey | null>(null);
  // Confirmation required: downgrade + cancel happen at period boundary
  // without immediate feedback, so the user must acknowledge.
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
    analytics.track('pricing_plan_cta_clicked', {
      plan: plan.key,
      cycle: cadence,
      cta_label: cta.label,
      action: cta.action,
    });
    if (cta.action === 'signup') {
      // `auth=signup` is read by the landing's server component and threads
      // an `initialAuthMode` prop into LandingScreen — the auth modal opens
      // immediately on arrival rather than making the visitor click again.
      router.push(
        `${ROUTES.signup()}?auth=signup&redirect=${encodeURIComponent(ROUTES.pricing())}`,
      );
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
      analytics.track('checkout_started', {
        plan: plan.key,
        cycle: cadence,
        intent: cta.action === 'upgrade' ? 'upgrade' : 'new',
      });
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
          Every plan unlocks the entire platform — the only thing that changes is how much monthly allowance you get. Allowance is used up as you generate courses, lessons, and quizzes, and refunded in full on any failure. <HelpAnchor concept="allowance" size="sm" />
        </S.Subtitle>

        <S.CadenceToggle role="tablist" aria-label="Billing cadence">
          <S.CadenceBtn $active={cadence === 'monthly'} onClick={() => handleCadenceToggle('monthly')} role="tab" aria-selected={cadence === 'monthly'}>
            Monthly
          </S.CadenceBtn>
          <S.CadenceBtn $active={cadence === 'annual'} onClick={() => handleCadenceToggle('annual')} role="tab" aria-selected={cadence === 'annual'}>
            Annual
            <S.SavingsChip>Save 20%</S.SavingsChip>
          </S.CadenceBtn>
        </S.CadenceToggle>
      </S.Header>

      {isCatalogLoading && (
        // Skeleton uses the SAME real wrappers (PlanName / PlanDescription /
        // PriceRow / AllowanceBlock / CardFooter) so layout is computed by
        // the exact same elements that render the real cards. Placeholder
        // text fills each line; the `<S.SkBar>` spans inside become the
        // visible skeleton bars (inline-block, sized as % of their parent).
        // No wrapper-level width tricks needed — everything inherits the
        // grid cell width from <S.Card>.
        <S.Grid aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <S.Card key={i}>
              <S.PlanName>
                <S.SkBar $w="55%" />
              </S.PlanName>
              <S.PlanDescription>
                <S.SkBar $w="100%" />
                <S.SkBar $w="100%" />
                <S.SkBar $w="94%" />
                <S.SkBar $w="82%" />
                <S.SkBar $w="68%" />
              </S.PlanDescription>
              <S.PriceRow>
                <S.Price>
                  <S.SkBar $w="65%" />
                </S.Price>
              </S.PriceRow>
              <S.AllowanceBlock>
                <S.AllowanceNumber>
                  <S.SkBar $w="40%" />
                </S.AllowanceNumber>
                <S.AllowanceUnit>
                  <S.SkBar $w="70%" />
                </S.AllowanceUnit>
                <S.AllowanceGuidance>
                  <S.SkBar $w="85%" />
                </S.AllowanceGuidance>
              </S.AllowanceBlock>
              <S.CardFooter>
                <S.SkBar $w="100%" $h="2.5rem" $radius="6px" />
              </S.CardFooter>
            </S.Card>
          ))}
        </S.Grid>
      )}

      {!isCatalogLoading && catalog && (() => {
        // 1 allowance := Free's monthly grant. Read from the same catalog
        // response rather than a hardcoded constant so backend changes to
        // ALLOWANCE_UNIT silently rescale generation headroom without
        // shifting the displayed `×` multipliers (1×, 10×, 22×, 48×).
        const allowanceUnit =
          catalog.plans.find((p) => p.key === 'free')?.monthlyAllowance ?? 0;

        return (
        <S.Grid>
          {catalog.plans.map((plan) => {
            const priceMonthly = cadence === 'monthly' ? plan.monthlyUsd : plan.annualMonthlyUsd;
            const cta = buildCheckoutCta({ planKey: plan.key, currentPlan, isAuthenticated });
            const isPro = plan.key === 'pro';
            const allowanceLabel = formatAllowance(plan.monthlyAllowance, allowanceUnit);
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
                  <S.AllowanceGuidance>
                    {formatPlanLessonsPerMonth(plan.key, catalog)} — {ALLOWANCE_TAGLINE[plan.key]}
                  </S.AllowanceGuidance>
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
        );
      })()}

      {/* Resolves the "*" suffix on every "≈ N lessons*" estimate above.
          One sentence, same string as TopupControl + LandingScreen so the
          definition of a "lesson" stays consistent app-wide. */}
      {catalog && <S.LessonFootnote>* {BASE_LESSON_FOOTNOTE}</S.LessonFootnote>}

      <S.FaqSection>
        <S.FaqTitle>Common questions</S.FaqTitle>

        <Accordion>
          <AccordionItem question="What can I actually do on each plan?">
            <p>
              Your monthly allowance translates roughly to <strong>lessons generated</strong>.
              {catalog ? (
                <>
                  {' '}Free covers about <strong>{formatPlanLessonsPerMonth('free', catalog).replace(/^≈\s?/, '').replace(' / month', '')}</strong>
                  {' '}per month, plus the cheap one-off steps (clarify, structure, module quizzes).
                  Starter scales that <strong>{catalog.allowance.multipliers.starter}×</strong> — a full short
                  course or two each month. Pro is <strong>{catalog.allowance.multipliers.pro}×</strong> —
                  comfortable headroom for ongoing study. Studio is <strong>{catalog.allowance.multipliers.studio}×</strong> —
                  multiple parallel courses, heavy regeneration.
                </>
              ) : null}
              {' '}Every plan unlocks the same features; tiers only change how much you can generate.
            </p>
          </AccordionItem>
          <AccordionItem question="Will I lose my courses if I cancel or downgrade?">
            <p>
              No. Your courses, lessons, notes, bookmarks, quiz attempts, and recall progress all stay with your
              account regardless of plan. You just won&rsquo;t be able to <em>generate</em> new content beyond your
              current tier&rsquo;s allowance. Reading and reviewing existing courses is always free.
            </p>
          </AccordionItem>
          <AccordionItem question="What happens if I run out mid-month?">
            <p>
              Two options. Upgrade to a higher tier and the new allowance is granted immediately — no waiting for
              the next cycle. Or top up any whole-dollar amount from the Billing tab; top-up balance never expires
              and is spent after your monthly allowance is drained.
            </p>
          </AccordionItem>
          <AccordionItem question="What if a generation fails?">
            <p>
              Allowance is fully refunded on any failure — network drop, provider outage, timeout, cancellation.
              You only pay for generations that finish and persist. The same applies if you cancel a job
              mid-flight.
            </p>
          </AccordionItem>
          <AccordionItem question="Can I cancel anytime?">
            <p>
              Yes. Cancel from the Billing portal and you keep full access plus your remaining allowance through
              the end of the current billing period, then drop to Free. No partial-month refunds, but no
              commitment beyond the current cycle either.
            </p>
          </AccordionItem>
          <AccordionItem question="Is there a free trial?">
            <p>
              The Free plan <em>is</em> the trial. Sign up, get a baseline monthly allowance, generate a real
              course, and decide whether you want more. No credit card required to start.
            </p>
          </AccordionItem>
          <AccordionItem question="Monthly or annual — which should I pick?">
            <p>
              Annual saves about 20% on the price, but the allowance is granted <strong>once per year</strong>, not
              split across 12 monthly refreshes. Pick monthly if you want predictable per-month allowance
              refreshes; pick annual if you generate in bursts and want the lower price.
            </p>
          </AccordionItem>
          <AccordionItem question="What about taxes?">
            <p>
              Prices are listed in USD. Stripe handles any applicable VAT or sales tax at checkout based on your
              billing address — the line item is added to your invoice, not bundled into the headline price.
            </p>
          </AccordionItem>
        </Accordion>
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
                You&rsquo;ll keep full <strong>{summary.displayName}</strong> access until{' '}
                <strong>{periodEndLabel}</strong>. After that your account drops to Free.{' '}
                No refund for the current period.
              </>
            );
          }

          const targetPlan = catalog?.plans.find((p) => p.key === pendingConfirm.planKey);
          const priceLabel = targetPlan ? `$${targetPlan.monthlyUsd.toFixed(2)}/month` : '';

          return (
            <>
              You&rsquo;ll keep your <strong>{summary.displayName}</strong> plan until{' '}
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
