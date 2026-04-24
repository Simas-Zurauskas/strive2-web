'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { startPortal } from '@/api/routes/billing';
import type { BillingPlan, BillingSummary, CreditLedgerEntry, PlanKey, SubscriptionStatus } from '@/api/types';
import { Button } from '@/components/Button';
import { TopupControl } from '@/components/TopupControl';
import { ROUTES } from '@/constants/routes';
import { useBillingLedger, useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { percentAllowanceRemaining } from '@/lib/allowance';
import { formatDate } from '@/lib/formatDate';
import * as S from './BillingPanel.styles';

const statusTone = (status: SubscriptionStatus): 'active' | 'warning' | 'canceled' => {
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

const reasonLabel: Record<CreditLedgerEntry['reason'], string> = {
  signup_grant: 'Signup grant',
  period_reset: 'Period reset',
  plan_upgrade_bonus: 'Plan upgrade',
  topup_purchase: 'Top-up',
  debit_action: 'Used',
  refund_job_failed: 'Refund (failed job)',
  refund_job_canceled: 'Refund (canceled)',
  refund_cross_period: 'Refund (cross-period)',
  admin_grant: 'Admin grant',
  admin_clawback: 'Admin adjustment',
};

// Ledger `actionType` is now the raw JobType string ('generate_lesson',
// 'clarify', 'generate_structure', ...). Map to human phrasing for the
// recent-activity subtitle; unknown values render as-is.
const actionLabel = (actionType: string | undefined): string => {
  if (!actionType) return '';
  const map: Record<string, string> = {
    clarify: 'clarifying questions',
    generate_structure: 'course design',
    refine_structure: 'course redesign',
    generate_depth_previews: 'depth previews',
    generate_lesson: 'lesson',
    generate_module_quiz: 'module quiz',
  };
  return map[actionType] ?? actionType;
};

interface BillingPanelProps {
  /** Max rows in the ledger list (default 20). */
  ledgerLimit?: number;
}

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

interface RenewalState {
  tone: S.RenewalTone;
  icon: string;
  headline: string;
  detail: React.ReactNode;
}

/**
 * Translate the user's subscription state into the next-event card the user
 * sees front-and-center on the billing tab. Every branch must answer four
 * questions: WHEN, WHAT, AT WHAT COST, and any callout (e.g. payment issue).
 *
 * Branches in priority order:
 *   1. past_due  → warning, "fix payment"
 *   2. cancelAtPeriodEnd  → warning, "subscription ending"
 *   3. pendingPlan set  → info, "downgrading on X"
 *   4. paid + active  → positive, "auto-renews on X for $Y"
 *   5. free  → neutral, "credits refresh on X"
 */
const computeRenewalState = ({
  summary,
  plans,
}: {
  summary: BillingSummary;
  plans: BillingPlan[] | undefined;
}): RenewalState => {
  const { plan, status, cancelAtPeriodEnd, pendingPlan, credits } = summary;
  const isPaid = plan !== 'free';
  const dateLabel = credits.periodEnd
    ? formatDate({ input: credits.periodEnd, format: 'long' })
    : null;
  const days = daysUntil(credits.periodEnd);
  const inLabel = days === null ? '' : days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
  const dateBlock = dateLabel ? <><strong>{dateLabel}</strong>{inLabel ? ` (${inLabel})` : ''}</> : '';

  // Past-due trumps everything — call attention to fix payment first.
  if (status === 'past_due') {
    return {
      tone: 'warning',
      icon: '!',
      headline: 'Payment failed — fix card to keep your plan',
      detail: <>Stripe will keep retrying for a few days. After that your subscription downgrades to Free. Open the billing portal to update your card.</>,
    };
  }

  if (isPaid && cancelAtPeriodEnd) {
    return {
      tone: 'warning',
      icon: '×',
      headline: `Subscription ends ${inLabel || 'soon'}`,
      detail: <>You'll keep <strong>{summary.displayName}</strong> until {dateBlock}, then drop to Free. Reactivate from the billing portal to keep your subscription running.</>,
    };
  }

  if (isPaid && pendingPlan && pendingPlan !== plan) {
    const targetPlan = plans?.find((p) => p.key === pendingPlan);
    const targetName = planDisplayName(pendingPlan, plans);
    const targetPrice = formatPriceWithCadence({ plan: targetPlan, cadenceHint: 'monthly' });
    return {
      tone: 'info',
      icon: '⇄',
      headline: `Switching to ${targetName} on renewal`,
      detail: <>You stay on <strong>{summary.displayName}</strong> until {dateBlock}. Then your plan becomes <strong>{targetName}</strong>{targetPrice ? <> at <strong>{targetPrice}</strong></> : ''}.</>,
    };
  }

  if (isPaid) {
    const currentPlanDef = plans?.find((p) => p.key === plan);
    const renewalPrice = formatPriceWithCadence({ plan: currentPlanDef, cadenceHint: 'monthly' });
    return {
      tone: 'positive',
      icon: '↻',
      headline: `Auto-renews ${inLabel || 'soon'}`,
      detail: <>Your card will be charged{renewalPrice ? <> <strong>{renewalPrice}</strong></> : ''} on {dateBlock} and your allowance refreshes for the new period. Cancel any time from the billing portal.</>,
    };
  }

  // Free tier
  return {
    tone: 'neutral',
    icon: '↻',
    headline: `Allowance refreshes ${inLabel || 'soon'}`,
    detail: <>Your free allowance refills on {dateBlock}. Upgrade any time to get more.</>,
  };
};

/**
 * Plan + credit balance + ledger + portal/topup actions. Embedded in the
 * Profile screen's Billing tab — the single canonical place for billing
 * state. Standalone /billing route was removed in favor of
 * /profile?tab=billing so users have one mental location for everything
 * account-related. Layout padding is the caller's responsibility.
 */
export const BillingPanel: React.FC<BillingPanelProps> = ({ ledgerLimit = 20 }) => {
  const router = useRouter();
  const { data: summary, isLoading: summaryLoading } = useBillingSummary();
  const { data: catalog } = useBillingPlans();
  const { data: ledgerPage, isLoading: ledgerLoading } = useBillingLedger({ limit: ledgerLimit });

  const portalMutation = useMutation({
    mutationFn: startPortal,
    meta: { errorMessage: 'Could not open Stripe portal.' },
    onSuccess: ({ url }) => { window.location.href = url; },
  });

  if (summaryLoading || !summary) {
    return (
      <S.Wrap>
        <S.PeriodNote>Loading…</S.PeriodNote>
      </S.Wrap>
    );
  }

  const { plan, displayName, status, cancelAtPeriodEnd, pendingPlan, credits } = summary;
  const pctRemaining = percentAllowanceRemaining({
    balance: credits.allowance,
    granted: credits.allowanceGranted,
  });

  const isPaid = plan !== 'free';
  const ledger = ledgerPage?.rows ?? [];
  const renewal = computeRenewalState({ summary, plans: catalog?.plans });

  // Bonus balance (credits) → USD display. Users bought top-ups in dollars,
  // so they should see the remaining value in dollars. Uses the catalog's
  // published rate so the math matches what was charged at checkout — if
  // the rate ever changes, unspent bonus credits are still shown at their
  // original USD-equivalent via the current rate (a minor inaccuracy we
  // accept; the ledger retains the exact amount paid).
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;
  const bonusUsdLabel = topupRate > 0 && credits.bonus > 0
    ? `$${(credits.bonus / topupRate).toFixed(2)}`
    : null;

  return (
    <S.Wrap>
      <S.PlanCard $emphasis={isPaid}>
        <S.PlanHeader>
          <S.PlanTitle>
            <S.PlanName>{displayName}</S.PlanName>
          </S.PlanTitle>
          <S.PlanStatus $status={statusTone(status)}>{statusLabel(status, cancelAtPeriodEnd)}</S.PlanStatus>
        </S.PlanHeader>

        {/* What happens next — unmissable on every billing view. */}
        <S.RenewalCard $tone={renewal.tone} role="status">
          <S.RenewalIcon $tone={renewal.tone} aria-hidden="true">{renewal.icon}</S.RenewalIcon>
          <S.RenewalBody>
            <S.RenewalHeadline>{renewal.headline}</S.RenewalHeadline>
            <S.RenewalDetail>{renewal.detail}</S.RenewalDetail>
          </S.RenewalBody>
        </S.RenewalCard>

        <S.CreditBar>
          <S.CreditBarHeader>
            <span>Allowance this period</span>
            <span><strong>{Math.round(pctRemaining)}%</strong> remaining</span>
          </S.CreditBarHeader>
          <S.BarTrack>
            <S.BarFill $pct={pctRemaining} />
          </S.BarTrack>
          {credits.bonus > 0 && bonusUsdLabel && (
            <S.CreditSub>
              <span>Plus <strong>{bonusUsdLabel}</strong> top-up allowance (never expires)</span>
            </S.CreditSub>
          )}
        </S.CreditBar>

        <S.Actions>
          {/* Plan switching: pricing page is always reachable. For paid users
              its CTAs route the actual switch through Stripe Portal — but we
              still want them to SEE the tier comparison side-by-side without
              leaving the app first. */}
          <Button onClick={() => router.push(ROUTES.pricing())}>
            {isPaid ? 'Change plan' : 'See plans'}
          </Button>
          {/* Manage = card / cancel / invoices via Stripe Portal. Only paid
              users have a Stripe customer + subscription to manage. */}
          {isPaid && (
            <Button
              variant="secondary"
              onClick={() => portalMutation.mutate()}
              loading={portalMutation.isPending}
            >
              Manage billing
            </Button>
          )}
        </S.Actions>

        <S.TopupSection>
          <S.TopupLabel>Need more? Top up any amount</S.TopupLabel>
          <TopupControl />
        </S.TopupSection>
      </S.PlanCard>

      <S.LedgerSection>
        <S.SectionHeader>Recent activity</S.SectionHeader>
        {ledgerLoading && <S.EmptyLedger>Loading…</S.EmptyLedger>}
        {!ledgerLoading && ledger.length === 0 && (
          <S.EmptyLedger>No activity yet.</S.EmptyLedger>
        )}
        {ledger.length > 0 && (
          <S.LedgerTable>
            {ledger.map((row) => {
              const positive = row.delta > 0;
              const label = reasonLabel[row.reason] ?? row.reason;
              const subLabel = row.actionType ? actionLabel(row.actionType) : row.notes ?? '';
              // Raw credit numbers are intentionally not surfaced — the sign
              // arrow communicates direction, the reason + action tell the
              // user what happened. Aligns with the "hide credit numbers"
              // directive applied across the billing surfaces.
              return (
                <S.LedgerRow key={row._id}>
                  <S.LedgerMain>
                    <strong>{label}</strong>
                    {subLabel && <span>{subLabel}</span>}
                  </S.LedgerMain>
                  <S.LedgerDate>{formatDate({ input: row.timestamp, format: 'short' })}</S.LedgerDate>
                  <S.LedgerDelta $positive={positive} aria-hidden="true">
                    {positive ? '↑' : '↓'}
                  </S.LedgerDelta>
                </S.LedgerRow>
              );
            })}
          </S.LedgerTable>
        )}
      </S.LedgerSection>
    </S.Wrap>
  );
};
