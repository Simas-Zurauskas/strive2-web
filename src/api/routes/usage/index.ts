import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Usage history ─────────────────────────────────────────

type UsageHistoryResponse =
  paths['/api/usage/history']['get']['responses']['200']['content']['application/json'];

export type UsageHistoryData = UsageHistoryResponse['data'];
export type UsageEvent = UsageHistoryData['events'][number];

export const getUsageHistory = ({ limit, offset }: { limit: number; offset: number }) => {
  return client<UsageHistoryResponse>({
    url: '/usage/history',
    method: 'GET',
    params: { limit, offset },
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
