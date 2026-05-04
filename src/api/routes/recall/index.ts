import { paths } from '@/api/_generated';
import { client } from '@/api/client';
import type { RecallMode, RecallRating } from '@/api/types';

// ── Queue ─────────────────────────────────────────────────

type GetRecallQueueResponse =
  paths['/api/recall/queue']['get']['responses']['200']['content']['application/json'];

export const getRecallQueue = (params: { currentCourseId?: string } = {}) => {
  return client<GetRecallQueueResponse>({
    url: '/recall/queue',
    method: 'GET',
    params: params.currentCourseId ? { currentCourseId: params.currentCourseId } : undefined,
  }).then((res) => res.data.data);
};

// ── Rate ──────────────────────────────────────────────────

type RateRecallResponse =
  paths['/api/recall/{recallCardId}/rate']['post']['responses']['200']['content']['application/json'];

export const rateRecall = (params: {
  recallCardId: string;
  rating: RecallRating;
  typedMatch?: number | null;
}) => {
  const { recallCardId, ...body } = params;
  return client<RateRecallResponse>({
    url: `/recall/${recallCardId}/rate`,
    method: 'POST',
    data: body,
  }).then((res) => res.data.data);
};

// ── Skip ──────────────────────────────────────────────────

type SkipRecallResponse =
  paths['/api/recall/{recallCardId}/skip']['post']['responses']['200']['content']['application/json'];

export const skipRecall = (recallCardId: string) => {
  return client<SkipRecallResponse>({
    url: `/recall/${recallCardId}/skip`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Mode ──────────────────────────────────────────────────

type SetRecallModeResponse =
  paths['/api/recall/{recallCardId}/mode']['post']['responses']['200']['content']['application/json'];

export const setRecallMode = (params: { recallCardId: string; mode: RecallMode }) => {
  return client<SetRecallModeResponse>({
    url: `/recall/${params.recallCardId}/mode`,
    method: 'POST',
    data: { mode: params.mode },
  }).then((res) => res.data.data);
};

// ── Stats ─────────────────────────────────────────────────

type GetRecallStatsResponse =
  paths['/api/recall/stats']['get']['responses']['200']['content']['application/json'];

export const getRecallStats = () => {
  return client<GetRecallStatsResponse>({
    url: '/recall/stats',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Due count (dashboard widget) ──────────────────────────

type GetRecallDueCountResponse =
  paths['/api/recall/due-count']['get']['responses']['200']['content']['application/json'];

export const getRecallDueCount = () => {
  return client<GetRecallDueCountResponse>({
    url: '/recall/due-count',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Grade typed answer (AI) ───────────────────────────────

type GradeRecallResponse =
  paths['/api/recall/{recallCardId}/grade']['post']['responses']['200']['content']['application/json'];

export const gradeRecallAnswer = (params: { recallCardId: string; userAnswer: string }) => {
  return client<GradeRecallResponse>({
    url: `/recall/${params.recallCardId}/grade`,
    method: 'POST',
    data: { userAnswer: params.userAnswer },
  }).then((res) => res.data.data);
};
