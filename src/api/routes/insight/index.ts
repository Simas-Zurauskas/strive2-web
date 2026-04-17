import { paths } from '@/api/_generated';
import { client } from '@/api/client';
import type { InsightMode, InsightRating } from '@/api/types';

// ── Queue ─────────────────────────────────────────────────

type GetInsightQueueResponse =
  paths['/api/insight/queue']['get']['responses']['200']['content']['application/json'];

export const getInsightQueue = () => {
  return client<GetInsightQueueResponse>({
    url: '/insight/queue',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Rate ──────────────────────────────────────────────────

type RateInsightResponse =
  paths['/api/insight/{insightId}/rate']['post']['responses']['200']['content']['application/json'];

export const rateInsight = (params: {
  insightId: string;
  rating: InsightRating;
  typedMatch?: number | null;
}) => {
  const { insightId, ...body } = params;
  return client<RateInsightResponse>({
    url: `/insight/${insightId}/rate`,
    method: 'POST',
    data: body,
  }).then((res) => res.data.data);
};

// ── Skip ──────────────────────────────────────────────────

type SkipInsightResponse =
  paths['/api/insight/{insightId}/skip']['post']['responses']['200']['content']['application/json'];

export const skipInsight = (insightId: string) => {
  return client<SkipInsightResponse>({
    url: `/insight/${insightId}/skip`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Mode ──────────────────────────────────────────────────

type SetInsightModeResponse =
  paths['/api/insight/{insightId}/mode']['post']['responses']['200']['content']['application/json'];

export const setInsightMode = (params: { insightId: string; mode: InsightMode }) => {
  return client<SetInsightModeResponse>({
    url: `/insight/${params.insightId}/mode`,
    method: 'POST',
    data: { mode: params.mode },
  }).then((res) => res.data.data);
};

// ── Stats ─────────────────────────────────────────────────

type GetInsightStatsResponse =
  paths['/api/insight/stats']['get']['responses']['200']['content']['application/json'];

export const getInsightStats = () => {
  return client<GetInsightStatsResponse>({
    url: '/insight/stats',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Due count (dashboard widget) ──────────────────────────

type GetInsightsDueCountResponse =
  paths['/api/insight/due-count']['get']['responses']['200']['content']['application/json'];

export const getInsightsDueCount = () => {
  return client<GetInsightsDueCountResponse>({
    url: '/insight/due-count',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Grade typed answer (AI) ───────────────────────────────

type GradeInsightResponse =
  paths['/api/insight/{insightId}/grade']['post']['responses']['200']['content']['application/json'];

export const gradeInsightAnswer = (params: { insightId: string; userAnswer: string }) => {
  return client<GradeInsightResponse>({
    url: `/insight/${params.insightId}/grade`,
    method: 'POST',
    data: { userAnswer: params.userAnswer },
  }).then((res) => res.data.data);
};
