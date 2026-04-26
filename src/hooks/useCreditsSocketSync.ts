'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AuthorisedUser, BillingSummary, CreditsUpdatedEvent } from '@/api/types';
import { QKeys } from '@/types';
import { useSocket } from './useSocket';

/**
 * Subscribe to the backend's `credits:updated` socket event and keep the
 * client's billing summary + auth user caches in sync.
 *
 * Strategy: optimistic cache patch from the payload, then a background
 * refetch of both queries so any drift against the server is reconciled
 * within a React Query tick. Why both:
 *   1. Optimistic patch = instant pill update / pre-flight math refresh
 *      without waiting for a network round-trip.
 *   2. Background refetch = authoritative reconciliation. If the payload
 *      is stale (e.g. two events racing) the server's later read wins.
 *
 * Mounted once at app boot via Registry.tsx inside SocketProvider.
 */
export const useCreditsSocketSync = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handler = (payload: CreditsUpdatedEvent) => {
      // Patch billing summary immediately so the credit pill animates
      // without waiting for the refetch. The shape mirrors BillingSummary.
      queryClient.setQueryData<BillingSummary | undefined>(
        [QKeys.BILLING_SUMMARY],
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            credits: {
              ...prev.credits,
              allowance: payload.allowance,
              bonus: payload.bonus,
              total: payload.total,
            },
          };
        },
      );

      // Patch the /me response's credits subdoc similarly so anything that
      // reads `user.credits` (e.g. preflight cost previews) picks up the
      // new balance without a refetch.
      queryClient.setQueryData<AuthorisedUser | undefined>(
        [QKeys.AUTH_USER],
        (prev) => {
          if (!prev?.credits) return prev;
          return {
            ...prev,
            credits: {
              ...prev.credits,
              allowanceBalance: payload.allowance,
              bonusBalance: payload.bonus,
            },
          };
        },
      );

      // Authoritative refetch — cheap, and guards against a missed event
      // or out-of-order delivery drifting the cache long-term.
      queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
      // Ledger has a new row after a debit/grant; invalidate the first-page
      // query so the billing page's activity list includes it.
      queryClient.invalidateQueries({ queryKey: [QKeys.BILLING_LEDGER] });
    };

    socket.on('credits:updated', handler);
    return () => {
      socket.off('credits:updated', handler);
    };
  }, [socket, queryClient]);
};
