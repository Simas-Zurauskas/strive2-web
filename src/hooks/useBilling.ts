'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getBillingLedger, getBillingPlans, getBillingSummary } from '@/api/routes/billing';
import { QKeys } from '@/types';

/**
 * Public plan catalog + action costs + top-up packs. Authless. Cached
 * indefinitely per session — pricing changes are rare and always ship
 * with a deploy, so a one-time fetch on first mount is enough.
 */
export const useBillingPlans = () => {
  return useQuery({
    queryKey: [QKeys.BILLING_PLANS],
    queryFn: getBillingPlans,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

/**
 * Current user's plan, status, credits, period. Auth-gated. Refetched on
 * window focus + on every `credits:updated` socket event (wired in
 * useCreditsSocketSync). Short staleTime so the balance isn't stale across
 * tab switches.
 */
export const useBillingSummary = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.BILLING_SUMMARY],
    queryFn: getBillingSummary,
    enabled: status === 'authenticated',
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Paginated credit ledger for the billing-history view. Cursor-based via
 * `before` — the server returns `nextCursor` or null when at the end.
 * useQuery here is for the first page; pages after that are loaded on
 * demand in the billing page component and appended to local state.
 */
export const useBillingLedger = ({ limit = 20 }: { limit?: number } = {}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.BILLING_LEDGER, { limit }],
    queryFn: () => getBillingLedger({ limit }),
    enabled: status === 'authenticated',
    staleTime: 15 * 1000,
  });
};
