'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  deleteAllUsageEvents,
  getUsageHistory,
  getUsageSummary,
} from '@/api/routes/usage';
import { QKeys } from '@/types';
import type { UsageSortDir, UsageSortField } from '@/api/types';

/**
 * `enabled` is opt-in lazy mode — callers pass `false` to hold the
 * request until the user actually opens the engineer view. The default
 * `true` keeps existing call sites working but the only consumer right
 * now (BillingTab) flips it on/off based on the toggle.
 *
 * The server already gates these routes behind `requireAdmin`, so a
 * non-admin who somehow flipped the flag client-side just gets 403s.
 * `enabled` is purely a UX/quota convenience.
 */
export const useUsageHistory = ({
  limit,
  offset,
  sortBy = 'timestamp',
  sortDir = 'desc',
  enabled = true,
}: {
  limit: number;
  offset: number;
  sortBy?: UsageSortField;
  sortDir?: UsageSortDir;
  enabled?: boolean;
}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.USAGE_HISTORY, limit, offset, sortBy, sortDir],
    queryFn: () => getUsageHistory({ limit, offset, sortBy, sortDir }),
    enabled: enabled && status === 'authenticated',
  });
};

export const useUsageSummary = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.USAGE_SUMMARY],
    queryFn: getUsageSummary,
    enabled: enabled && status === 'authenticated',
  });
};

// Admin-only mutation. The server enforces this via `requireAdmin`; the
// UI surfaces the button only when `user.isAdmin` is true.
export const useDeleteAllUsageEvents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAllUsageEvents,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QKeys.USAGE_HISTORY] });
      qc.invalidateQueries({ queryKey: [QKeys.USAGE_SUMMARY] });
    },
    meta: { errorMessage: 'Failed to clear usage events' },
  });
};
