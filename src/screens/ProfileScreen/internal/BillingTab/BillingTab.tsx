'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { BillingPanel, Button } from '@/components';
import { DEV_MODE } from '@/conf/env';
import {
  useDeleteAllUsageEvents,
  useUsageHistory,
  useUsageSummary,
} from '@/hooks/useUsage';
import type { UsageSortDir, UsageSortField } from '@/api/routes/usage';
import { QKeys } from '@/types';
import { UsageHistoryList } from '../UsageTab/internal/UsageHistoryList/UsageHistoryList';
import { UsageSummaryCards } from '../UsageTab/internal/UsageSummaryCards/UsageSummaryCards';
import * as S from './BillingTab.styles';

const USAGE_PAGE_SIZE = 20;

/**
 * Profile > Billing tab. Primary content is the user-facing `BillingPanel`
 * (plan, credits, ledger, top-ups, portal). DEV_MODE exposes the raw
 * per-call API spend (microcents) from UsageEventModel in a collapsible
 * "engineer view" — useful for debugging actual LLM/BFL/Tavily costs
 * vs. what the user is being charged in credits.
 */
export const BillingTab: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const checkoutToastShown = useRef(false);
  const [devExpanded, setDevExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState<UsageSortField>('timestamp');
  const [sortDir, setSortDir] = useState<UsageSortDir>('desc');

  // Toggle direction when re-clicking the active column; switching columns
  // resets to desc which is the most useful default for cost / time. Sort
  // change resets pagination so the user lands on the new first page.
  const handleSortChange = (next: UsageSortField) => {
    if (next === sortBy) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(next);
      setSortDir('desc');
    }
    setOffset(0);
  };

  // Stripe Checkout redirects here with `?checkout=subscription|topup`.
  // The webhook has (almost certainly) already updated state by the time
  // the user lands — we just show a welcome toast and strip the flag from
  // the URL so a page reload doesn't re-trigger it. The `useRef` guard
  // covers React Strict Mode's double-effect behavior in dev.
  useEffect(() => {
    if (checkoutToastShown.current) return;
    const checkoutKind = searchParams.get('checkout');
    if (checkoutKind !== 'subscription' && checkoutKind !== 'topup') return;
    checkoutToastShown.current = true;

    if (checkoutKind === 'subscription') {
      toast.success('Welcome aboard — your subscription is active and allowance is ready.');
    } else {
      toast.success('Top-up allowance added to your account.');
    }

    // Force-refresh billing data; the socket event will usually beat us to
    // this, but explicit invalidation guarantees the RenewalCard + balance
    // reflect the new state even if the webhook is delayed.
    queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_SUMMARY] });
    queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
    queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_LEDGER] });

    // Strip the checkout flag while preserving the billing tab selection.
    router.replace('/profile?tab=billing', { scroll: false });
  }, [searchParams, router, queryClient]);

  // Only fetch dev usage data when the toggle is open and DEV_MODE is on —
  // no point hitting the endpoints for end users.
  const showDev = DEV_MODE && devExpanded;
  const summary = useUsageSummary();
  const history = useUsageHistory({ limit: USAGE_PAGE_SIZE, offset, sortBy, sortDir });
  const clearEvents = useDeleteAllUsageEvents();

  const handleClear = () => {
    if (!window.confirm('Delete ALL your usage events? This is a dev-only action and cannot be undone.')) return;
    clearEvents.mutate(undefined, { onSuccess: () => setOffset(0) });
  };

  return (
    <>
      <BillingPanel />

      {DEV_MODE && (
        <S.DevSection>
          <S.DevToggle onClick={() => setDevExpanded((v) => !v)}>
            {devExpanded ? 'Hide' : 'Show'} engineer view · API spend
          </S.DevToggle>

          {showDev && (
            <>
              <UsageSummaryCards data={summary.data} loading={summary.isLoading} />
              <UsageHistoryList
                data={history.data}
                loading={history.isLoading}
                offset={offset}
                onPrev={() => setOffset((o) => Math.max(0, o - USAGE_PAGE_SIZE))}
                onNext={() => setOffset((o) => o + USAGE_PAGE_SIZE)}
                sortBy={sortBy}
                sortDir={sortDir}
                onSortChange={handleSortChange}
              />
              <S.DevTools>
                <S.DevLabel>Dev tools</S.DevLabel>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleClear}
                  loading={clearEvents.isPending}
                >
                  Clear all usage events
                </Button>
              </S.DevTools>
            </>
          )}
        </S.DevSection>
      )}
    </>
  );
};
