'use client';

import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PageLayout, Button, HelpAnchor } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useRecallQueue, useRecallStats, useRateRecall, useSkipRecall } from '@/hooks';
import { analytics } from '@/lib/analytics';
import { RecallCard } from './internal/RecallCard/RecallCard';
import { RecallGhostPreview } from './internal/RecallGhostPreview/RecallGhostPreview';
import { RecallLoadingShell } from './internal/RecallLoadingShell';
import { SessionStrip } from './internal/SessionStrip/SessionStrip';
import * as S from './RecallScreen.styles';
import type { RecallQueueItem, RecallRating } from '@/api/types';

export const RecallScreen = () => {
  const router = useRouter();
  const { data: queue, isLoading } = useRecallQueue();
  const { data: stats } = useRecallStats();
  const { mutate: rate, isPending: isRating } = useRateRecall();
  const { mutate: skip } = useSkipRecall();

  // Snapshot the queue at mount so the queue doesn't reshuffle while the
  // user is mid-review. When the user finishes a batch with retries
  // queued, an interim screen offers them. Refetch happens on next
  // mount (next page visit).
  const sessionQueue = useMemo<RecallQueueItem[]>(() => {
    if (!queue) return [];
    return [...queue.due, ...queue.fresh];
  }, [queue]);

  // ── Batch + retry model ───────────────────────────────
  // The user goes through the main batch first. Any card they rate
  // Again is *deferred* to `retryPool`, not re-shown immediately. When
  // the main batch finishes, an interim summary screen lets the user
  // either run a retry batch or end the session. Inside a retry batch,
  // pressing Again again deposits the card back into `retryPool` for
  // another pass. Loop ends when retryPool is empty at batch end.
  const [orderOverride, setOrderOverride] = useState<string[] | null>(null);
  const sessionOrder = useMemo<string[]>(() => {
    if (orderOverride !== null) return orderOverride;
    return sessionQueue.map((i) => i.recallCardId);
  }, [sessionQueue, orderOverride]);

  const cardById = useMemo(
    () => new Map(sessionQueue.map((i) => [i.recallCardId, i])),
    [sessionQueue],
  );

  const currentId = sessionOrder[0] ?? null;
  const current: RecallQueueItem | null = currentId ? cardById.get(currentId) ?? null : null;

  // Total size of the current batch, used by SessionStrip for "X of Y".
  // Derived: defaults to the full session size; the retry-batch flow
  // overrides this with the retry pool size. Same null-override trick
  // as `orderOverride` so we avoid setState-in-effect for init.
  const [batchTotalOverride, setBatchTotalOverride] = useState<number | null>(null);
  const batchTotal = useMemo(() => {
    if (batchTotalOverride !== null) return batchTotalOverride;
    return sessionQueue.length;
  }, [batchTotalOverride, sessionQueue.length]);

  // Cards rated Again in the current batch, waiting to be run as a
  // retry batch when the main batch finishes. Cleared on retry-batch
  // start; refilled by any new Agains during the retry batch.
  const [retryPool, setRetryPool] = useState<string[]>([]);

  // Cards cleared (Hard/Good/Easy) or skipped in the current batch.
  // Drives the SessionStrip progress bar — resets between batches.
  // Note: Again pressed counts as "progressed" for the batch progress
  // bar (the user has been through that card), but the card still
  // enters retryPool.
  const [progressedIds, setProgressedIds] = useState<string[]>([]);

  // Track whether the user is currently in a retry batch (1+ retry
  // rounds have started). Drives the per-card and per-strip "retry"
  // indicators.
  const [retryBatchCount, setRetryBatchCount] = useState(0);
  const inRetryBatch = retryBatchCount > 0;

  // Skipped in the current batch — displayed in the interim summary,
  // so must live in state (refs can't be read during render).
  const [skippedCount, setSkippedCount] = useState(0);
  // Cumulative cleared/skipped across all batches in this session —
  // displayed in the final summary.
  const [cumulativeProgressed, setCumulativeProgressed] = useState(0);

  // Mixpanel session telemetry — refs because these don't need to drive
  // re-renders; they're read only inside effects and event handlers.
  const sessionStartRef = useRef<number | null>(null);
  const sessionStartedFiredRef = useRef(false);
  const sessionCompletedFiredRef = useRef(false);
  const cumulativeAgainCountRef = useRef(0);

  useEffect(() => {
    if (!current || sessionStartedFiredRef.current) return;
    sessionStartedFiredRef.current = true;
    sessionStartRef.current = Date.now();
    analytics.track('recall_session_started', {
      cards_due_count: queue?.counts.dueTotal ?? sessionQueue.length,
      mode: 'tap-reveal',
      entry_point: 'recall_screen',
    });
  }, [current, queue, sessionQueue]);

  useEffect(() => {
    if (!current) return;
    const dueAtMs = current.dueAt ? new Date(current.dueAt).getTime() : null;
    const daysSinceDue = dueAtMs
      ? Math.max(0, Math.round((Date.now() - dueAtMs) / (24 * 60 * 60 * 1000)))
      : null;
    analytics.track('recall_card_shown', {
      card_id: current.recallCardId,
      course_id: current.courseId,
      box: current.box,
      mode: 'tap-reveal',
      is_new: current.isNew,
      ...(daysSinceDue !== null && { days_since_due: daysSinceDue }),
      is_retry_batch: inRetryBatch,
    });
  }, [current?.recallCardId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Final completion fires only when the user truly ends the session —
  // either retryPool is empty at batch end, or they explicitly end via
  // the interim screen (which navigates them out anyway).
  useEffect(() => {
    if (sessionCompletedFiredRef.current) return;
    if (sessionQueue.length === 0) return;
    if (current) return;
    if (retryPool.length > 0) return; // interim retry screen, not done
    sessionCompletedFiredRef.current = true;
    analytics.track('recall_session_completed', {
      cards_reviewed: cumulativeProgressed + progressedIds.length - skippedCount,
      cards_skipped: skippedCount,
      retry_batches: retryBatchCount,
      session_duration_seconds: Math.max(
        0,
        Math.round((Date.now() - (sessionStartRef.current ?? Date.now())) / 1000),
      ),
    });
  }, [
    current,
    sessionQueue.length,
    progressedIds.length,
    retryPool.length,
    retryBatchCount,
    cumulativeProgressed,
    skippedCount,
  ]);

  const handleRate = (rating: RecallRating) => {
    if (!current) return;
    const id = current.recallCardId;
    rate({ recallCardId: id, rating });

    // Advance the sessionOrder by one in all cases.
    setOrderOverride((prev) => {
      const order = prev ?? sessionQueue.map((i) => i.recallCardId);
      return order.slice(1);
    });
    setProgressedIds((prev) => [...prev, id]);

    if (rating === 1) {
      // Again — defer to retryPool. Card will come back if the user
      // chooses to run a retry batch after this batch ends.
      setRetryPool((prev) => (prev.includes(id) ? prev : [...prev, id]));
      cumulativeAgainCountRef.current += 1;
    }
  };

  const handleSkip = () => {
    if (!current) return;
    const id = current.recallCardId;
    skip(id);
    setSkippedCount((n) => n + 1);
    setOrderOverride((prev) => {
      const order = prev ?? sessionQueue.map((i) => i.recallCardId);
      return order.slice(1);
    });
    setProgressedIds((prev) => [...prev, id]);
  };

  const handleStartRetryBatch = () => {
    if (retryPool.length === 0) return;
    // Flush current batch stats into cumulative totals before resetting.
    setCumulativeProgressed((n) => n + progressedIds.length);

    const cards = retryPool;
    setOrderOverride(cards);
    setBatchTotalOverride(cards.length);
    setRetryPool([]);
    setProgressedIds([]);
    setSkippedCount(0);
    setRetryBatchCount((c) => c + 1);
    analytics.track('recall_retry_batch_started', {
      cards_count: cards.length,
      batch_index: retryBatchCount + 1,
    });
  };

  const handleEndSession = () => {
    // User opted out of the retry batch. Backend has already
    // rescheduled the Again'd cards for tomorrow, so they'll surface
    // on the next visit. We just clear retryPool client-side so the
    // final "done" state shows.
    setCumulativeProgressed((n) => n + progressedIds.length);
    setRetryPool([]);
    analytics.track('recall_retry_batch_declined', {
      cards_declined_count: retryPool.length,
    });
  };

  // ── Loading ───────────────────────────────────

  if (isLoading) return <RecallLoadingShell />;

  const reviewed = progressedIds.length;
  const total = batchTotal;

  // ── No recall cards yet — user hasn't generated enough lessons ──

  if (sessionQueue.length === 0) {
    return (
      <PageLayout>
        <S.ContentWrap>
          <S.PageHeader>
            <S.Eyebrow>
              Recall <HelpAnchor concept="spaced-recall" size="sm" />
            </S.Eyebrow>
            <S.Title>Where reading turns into knowing.</S.Title>
            <S.Subtitle>
              Tiny prompts pulled from your lessons, scheduled at intervals proven to outlast
              forgetting. A few minutes of recall a day is what makes the work compound.
            </S.Subtitle>
          </S.PageHeader>

          <S.EmptyState>
            <S.EmptyPreviewSlot>
              <RecallGhostPreview />
            </S.EmptyPreviewSlot>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>Nothing to review yet</S.EmptyEyebrow>
            <S.EmptyTitle>Cards appear once you&rsquo;ve read.</S.EmptyTitle>
            <S.EmptyText>
              Complete a lesson and the most important ideas become recall cards. They start
              showing up here once spaced repetition has work to do.
            </S.EmptyText>
            <S.EmptyAction>
              <Button variant="primary" onClick={() => router.push(ROUTES.home())}>
                Go to courses
              </Button>
            </S.EmptyAction>
          </S.EmptyState>
        </S.ContentWrap>
      </PageLayout>
    );
  }

  // ── Done state — single screen. If there are cards waiting for a
  //    second pass, the screen offers the rerun inline; otherwise it's
  //    the "come back tomorrow" closing beat. One ending, two flavors.

  if (!current) {
    const hasRetries = retryPool.length > 0;
    const retryCount = retryPool.length;
    const cumulativeReviewed = cumulativeProgressed + reviewed - skippedCount;
    return (
      <PageLayout>
        <S.ContentWrap>
          <S.PageHeader>
            <S.Eyebrow>
              Recall <HelpAnchor concept="spaced-recall" size="sm" />
            </S.Eyebrow>
            <S.Title>Where reading turns into knowing.</S.Title>
          </S.PageHeader>

          <S.EmptyState>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>Done for today</S.EmptyEyebrow>
            <S.EmptyTitle>
              {hasRetries
                ? retryCount === 1
                  ? 'One card asks for another pass.'
                  : `${retryCount} cards ask for another pass.`
                : 'Come back tomorrow.'}
            </S.EmptyTitle>
            <S.EmptyText>
              {hasRetries ? (
                <>
                  You marked these <em>Again</em>. A second pass while the moment is fresh is
                  where retrieval really earns its keep.
                </>
              ) : (
                <>
                  Spaced repetition works best when reviews sit at roughly 10–20% of the
                  retention horizon. More cards will appear as they come due.
                </>
              )}
            </S.EmptyText>

            <S.EmptyDateline>
              <S.DatelineStrong>{cumulativeReviewed}</S.DatelineStrong> reviewed today
              <S.DatelineSep>·</S.DatelineSep>
              <S.DatelineStrong>{stats?.totalReviewed ?? 0}</S.DatelineStrong> all time
              <S.DatelineSep>·</S.DatelineSep>
              <S.DatelineStrong>{stats?.dueThisWeek ?? 0}</S.DatelineStrong> due this week
            </S.EmptyDateline>

            {hasRetries && (
              <S.InterimActionRow>
                <Button variant="primary" onClick={handleStartRetryBatch}>
                  Rerun {retryCount} {retryCount === 1 ? 'card' : 'cards'}
                  <ArrowRight size={16} strokeWidth={2.25} style={{ marginLeft: '0.4rem' }} />
                </Button>
                <S.InterimSecondaryButton type="button" onClick={handleEndSession}>
                  Not now
                </S.InterimSecondaryButton>
              </S.InterimActionRow>
            )}
          </S.EmptyState>
        </S.ContentWrap>
      </PageLayout>
    );
  }

  // ── Active session ──

  return (
    <PageLayout>
      <S.ActiveWrap>
        <SessionStrip
          reviewed={reviewed}
          total={total}
          dueTotal={queue?.counts.dueTotal ?? 0}
          freshAvailable={queue?.counts.freshAvailable ?? 0}
          retryQueued={retryPool.length}
          inRetryBatch={inRetryBatch}
        />

        <S.CardStage>
          <AnimatePresence mode="wait" initial={false}>
            <RecallCard
              key={current.recallCardId}
              card={current}
              isRetry={inRetryBatch}
              onRate={handleRate}
              onSkip={handleSkip}
              isRating={isRating}
            />
          </AnimatePresence>
        </S.CardStage>
      </S.ActiveWrap>
    </PageLayout>
  );
};
