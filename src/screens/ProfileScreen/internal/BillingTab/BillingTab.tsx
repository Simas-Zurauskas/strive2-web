'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BillingPanel, Button, PurchaseSuccessModal, type PurchaseKind } from '@/components';
import { useAuth } from '@/hooks';
import {
  useDeleteAllUsageEvents,
  useUsageHistory,
  useUsageSummary,
} from '@/hooks/useUsage';
import { QKeys } from '@/types';
import * as S from './BillingTab.styles';
import { UsageHistoryList } from '../UsageTab/internal/UsageHistoryList/UsageHistoryList';
import { UsageSummaryCards } from '../UsageTab/internal/UsageSummaryCards/UsageSummaryCards';
import type { UsageSortDir, UsageSortField } from '@/api/types';

const USAGE_PAGE_SIZE = 50;

// Engineer-view (raw UsageEvent microcents) gated client-side on user.isAdmin
// AND server-side on requireAdmin. Summary/history queries are lazy-enabled.
export const BillingTab: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const checkoutHandledRef = useRef(false);
  const { user } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);
  const [devExpanded, setDevExpanded] = useState(false);
  const [purchaseKind, setPurchaseKind] = useState<PurchaseKind | null>(null);
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
  // the user lands — we invalidate the billing queries (so the modal reads
  // fresh data) and open the PurchaseSuccessModal. The `useRef` guard
  // covers React Strict Mode's double-effect behavior in dev.
  useEffect(() => {
    if (checkoutHandledRef.current) return;
    const checkoutKind = searchParams.get('checkout');
    if (checkoutKind !== 'subscription' && checkoutKind !== 'topup') return;
    checkoutHandledRef.current = true;

    // Force-refresh billing data; the socket event will usually beat us to
    // this, but explicit invalidation guarantees the modal + BillingPanel
    // reflect the new state even if the webhook is delayed.
    queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_SUMMARY] });
    queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
    queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_LEDGER] });

    // Translating a one-shot URL signal into modal open state — the ref
    // guard above ensures this fires exactly once per arrival, so the
    // setState-in-effect lint rule is a false positive here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPurchaseKind(checkoutKind);

    // Strip the checkout flag while preserving the billing tab selection.
    router.replace('/profile?tab=billing', { scroll: false });
  }, [searchParams, router, queryClient]);

  // Lazy-load usage data: queries only fire when the engineer-view
  // toggle is open AND the user is an admin. `enabled: false` keeps
  // react-query from sending the request, so non-admins never attempt
  // the call (which would 403 anyway) and admins don't pay for it unless
  // they actually open the view.
  const showDev = isAdmin && devExpanded;
  const summary = useUsageSummary({ enabled: showDev });
  const history = useUsageHistory({
    limit: USAGE_PAGE_SIZE,
    offset,
    sortBy,
    sortDir,
    enabled: showDev,
  });
  const clearEvents = useDeleteAllUsageEvents();

  const handleClear = () => {
    if (
      !window.confirm(
        'Delete ALL your usage events AND action-related credit-ledger rows? Your actual balance is unchanged. This is an admin action and cannot be undone.',
      )
    )
      return;
    clearEvents.mutate(undefined, { onSuccess: () => setOffset(0) });
  };

  return (
    <>
      <BillingPanel />

      <PurchaseSuccessModal kind={purchaseKind} onClose={() => setPurchaseKind(null)} />

      {isAdmin && (
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
