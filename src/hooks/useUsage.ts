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

export const useUsageHistory = ({
  limit,
  offset,
  sortBy = 'timestamp',
  sortDir = 'desc',
}: {
  limit: number;
  offset: number;
  sortBy?: UsageSortField;
  sortDir?: UsageSortDir;
}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.USAGE_HISTORY, limit, offset, sortBy, sortDir],
    queryFn: () => getUsageHistory({ limit, offset, sortBy, sortDir }),
    enabled: status === 'authenticated',
  });
};

export const useUsageSummary = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.USAGE_SUMMARY],
    queryFn: getUsageSummary,
    enabled: status === 'authenticated',
  });
};

// Dev-only mutation — the endpoint 404s in non-dev environments, and the
// UI that exposes this button is guarded by `DEV_MODE`.
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
