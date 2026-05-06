'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  getRecallQueue,
  getRecallStats,
  getRecallDueCount,
  gradeRecallAnswer,
  rateRecall,
  setRecallMode,
  skipRecall,
} from '@/api/routes/recall';
import { QKeys } from '@/types';
import type { RecallMode, RecallRating } from '@/api/types';

// ── Queries ──────────────────────────────────────────────

/**
 * Daily recall queue. When `currentCourseId` is passed (e.g. from an
 * in-lesson review surface), the active course's items are placed first by
 * the server in both the due and fresh slices. Global surfaces (the
 * Recall tab) omit the param and get the cross-course interleave.
 *
 * Different `currentCourseId`s are cached separately so a learner switching
 * between courses doesn't see the previous course's order.
 */
export const useRecallQueue = ({
  currentCourseId,
}: { currentCourseId?: string } = {}) => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.RECALL_QUEUE, currentCourseId ?? null],
    queryFn: () => getRecallQueue({ currentCourseId }),
    enabled: status === 'authenticated',
    // The socket pushes `recall_cards_saved` updates in real time, so the
    // refetch-on-focus path is a coarse fallback — a 30s window keeps quick
    // tab cycles cheap without letting the queue drift on long absences.
    staleTime: 30_000,
  });
};

export const useRecallStats = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.RECALL_STATS],
    queryFn: getRecallStats,
    enabled: status === 'authenticated',
  });
};

export const useRecallDueCount = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.RECALL_DUE_COUNT],
    queryFn: getRecallDueCount,
    enabled: status === 'authenticated',
    // Dashboard widget — don't hammer it.
    staleTime: 30_000,
  });
};

// ── Mutations ────────────────────────────────────────────

export const useRateRecall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { recallCardId: string; rating: RecallRating; typedMatch?: number | null }) =>
      rateRecall(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_STATS] });
      queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_DUE_COUNT] });
      queryClient.invalidateQueries({ queryKey: [QKeys.GAMIFICATION_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QKeys.GAMIFICATION_STATS] });
      // Don't invalidate RECALL_QUEUE — the in-flight session renders the
      // local queue state to prevent the card under the user's finger from
      // reshuffling mid-review. Refetch on next mount/focus.
    },
    meta: { errorMessage: 'Failed to save rating' },
  });
};

export const useSkipRecall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recallCardId: string) => skipRecall(recallCardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_DUE_COUNT] });
    },
    meta: { errorMessage: 'Failed to skip recall card' },
  });
};

export const useSetRecallMode = () =>
  useMutation({
    mutationFn: (params: { recallCardId: string; mode: RecallMode }) => setRecallMode(params),
    // Don't invalidate RECALL_QUEUE — same reason as rate. A refetch mid-session
    // re-picks the fresh pool and reshuffles the card under the user's finger;
    // in combination with the auto-setMode effect in RecallScreen, this
    // produced a loop that remounted the card on every advance. The client
    // renders the override via modeOverrides; server state is already persisted.
    meta: { errorMessage: 'Failed to change mode' },
  });

export const useGradeRecallAnswer = () => {
  return useMutation({
    mutationFn: (params: { recallCardId: string; userAnswer: string }) => gradeRecallAnswer(params),
    // Grading errors should be silent — the card falls back to self-rating.
    meta: { silent: true },
  });
};
