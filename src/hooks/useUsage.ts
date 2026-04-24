'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAllUsageEvents, getUsageHistory, getUsageSummary } from '@/api/routes/usage';
import { QKeys } from '@/types';

export const useUsageHistory = ({ limit, offset }: { limit: number; offset: number }) =>
  useQuery({
    queryKey: [QKeys.USAGE_HISTORY, limit, offset],
    queryFn: () => getUsageHistory({ limit, offset }),
  });

export const useUsageSummary = () =>
  useQuery({
    queryKey: [QKeys.USAGE_SUMMARY],
    queryFn: getUsageSummary,
  });

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
