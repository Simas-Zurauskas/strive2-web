'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInsightQueue,
  getInsightStats,
  getInsightsDueCount,
  gradeInsightAnswer,
  rateInsight,
  setInsightMode,
  skipInsight,
} from '@/api/routes/insight';
import { QKeys } from '@/types';
import type { InsightMode, InsightRating } from '@/api/types';

// ── Queries ──────────────────────────────────────────────

/**
 * Daily insight queue. When `currentCourseId` is passed (e.g. from an
 * in-lesson review surface), the active course's items are placed first by
 * the server in both the due and fresh slices. Global surfaces (the
 * Insights tab) omit the param and get the cross-course interleave.
 *
 * Different `currentCourseId`s are cached separately so a learner switching
 * between courses doesn't see the previous course's order.
 */
export const useInsightQueue = ({
  currentCourseId,
}: { currentCourseId?: string } = {}) =>
  useQuery({
    queryKey: [QKeys.INSIGHT_QUEUE, currentCourseId ?? null],
    queryFn: () => getInsightQueue({ currentCourseId }),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const useInsightStats = () =>
  useQuery({
    queryKey: [QKeys.INSIGHT_STATS],
    queryFn: getInsightStats,
  });

export const useInsightsDueCount = () =>
  useQuery({
    queryKey: [QKeys.INSIGHT_DUE_COUNT],
    queryFn: getInsightsDueCount,
    // Dashboard widget — don't hammer it.
    staleTime: 30_000,
  });

// ── Mutations ────────────────────────────────────────────

export const useRateInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { insightId: string; rating: InsightRating; typedMatch?: number | null }) =>
      rateInsight(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.INSIGHT_STATS] });
      queryClient.invalidateQueries({ queryKey: [QKeys.INSIGHT_DUE_COUNT] });
      queryClient.invalidateQueries({ queryKey: [QKeys.GAMIFICATION_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QKeys.GAMIFICATION_STATS] });
      // Don't invalidate INSIGHT_QUEUE — the in-flight session renders the
      // local queue state to prevent the card under the user's finger from
      // reshuffling mid-review. Refetch on next mount/focus.
    },
    meta: { errorMessage: 'Failed to save rating' },
  });
};

export const useSkipInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insightId: string) => skipInsight(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.INSIGHT_DUE_COUNT] });
    },
    meta: { errorMessage: 'Failed to skip insight' },
  });
};

export const useSetInsightMode = () =>
  useMutation({
    mutationFn: (params: { insightId: string; mode: InsightMode }) => setInsightMode(params),
    // Don't invalidate INSIGHT_QUEUE — same reason as rate. A refetch mid-session
    // re-picks the fresh pool and reshuffles the card under the user's finger;
    // in combination with the auto-setMode effect in InsightsScreen, this
    // produced a loop that remounted the card on every advance. The client
    // renders the override via modeOverrides; server state is already persisted.
    meta: { errorMessage: 'Failed to change mode' },
  });

export const useGradeInsightAnswer = () => {
  return useMutation({
    mutationFn: (params: { insightId: string; userAnswer: string }) => gradeInsightAnswer(params),
    // Grading errors should be silent — the card falls back to self-rating.
    meta: { silent: true },
  });
};
