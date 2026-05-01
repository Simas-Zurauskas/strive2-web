import { paths } from '@/api/_generated';
import { client } from '@/api/client';
import type { UsageSortField, UsageSortDir } from '@/api/types';

// ── Usage history ─────────────────────────────────────────

type UsageHistoryResponse =
  paths['/api/usage/history']['get']['responses']['200']['content']['application/json'];

// Route-internal sub-shape, exported so the Usage tab can type its
// in-memory slice without re-deriving the path here. Not lifted to
// @/api/types because it's purely a derivative of the path response,
// not a top-level API contract.
export type UsageHistoryData = UsageHistoryResponse['data'];

export const getUsageHistory = ({
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
  return client<UsageHistoryResponse>({
    url: '/usage/history',
    method: 'GET',
    params: { limit, offset, sortBy, sortDir },
  }).then((res) => res.data.data);
};

// ── Usage summary ─────────────────────────────────────────

type UsageSummaryResponse =
  paths['/api/usage/summary']['get']['responses']['200']['content']['application/json'];

export type UsageSummaryData = UsageSummaryResponse['data'];

export const getUsageSummary = () => {
  return client<UsageSummaryResponse>({
    url: '/usage/summary',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Dev-only: wipe the caller's events ────────────────────

export const deleteAllUsageEvents = () => {
  return client<{ data: { deleted: number } }>({
    url: '/usage/events',
    method: 'DELETE',
  }).then((res) => res.data.data);
};
