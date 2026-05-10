'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PageLayout, Button, HelpAnchor } from '@/components';
import { ROUTES } from '@/constants/routes';
import {
  useRecallQueue,
  useRecallStats,
  useRateRecall,
  useSetRecallMode,
  useSkipRecall,
} from '@/hooks';
import { analytics } from '@/lib/analytics';
import { QueueHeader } from './internal/QueueHeader/QueueHeader';
import { RecallCard } from './internal/RecallCard/RecallCard';
import { RecallGhostPreview } from './internal/RecallGhostPreview/RecallGhostPreview';
import { RecallLoadingShell } from './internal/RecallLoadingShell';
import * as S from './RecallScreen.styles';
import type { RecallMode, RecallQueueItem, RecallRating } from '@/api/types';

const MODE_STORAGE_KEY = 'strive:recallMode';

const readSavedMode = (): RecallMode | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(MODE_STORAGE_KEY);
  return saved === 'tap-reveal' || saved === 'typed-recall' ? saved : null;
};

export const RecallScreen = () => {
  const router = useRouter();
  const { data: queue, isLoading } = useRecallQueue();
  const { data: stats } = useRecallStats();
  const { mutate: rate, isPending: isRating } = useRateRecall();
  const { mutate: skip } = useSkipRecall();
  const { mutate: setMode } = useSetRecallMode();

  // Snapshot the queue at mount so a rate/skip doesn't reshuffle the list
  // while the user is mid-review. When the user finishes, they see the
  // empty/done state; any newly due items from refetch appear on next mount.
  const sessionQueue = useMemo<RecallQueueItem[]>(() => {
    if (!queue) return [];
    return [...queue.due, ...queue.fresh];
  }, [queue]);

  const [progressedIds, setProgressedIds] = useState<string[]>([]);
  const [modeOverrides, setModeOverrides] = useState<Record<string, RecallMode>>({});
  // Mixpanel session telemetry — wire from the queue lifecycle:
  //   - sessionStarted fires on the first card render
  //   - sessionCompleted fires once the user clears the queue (currentRaw
  //     becomes null while total > 0)
  // Refs because we want exactly one fire per page mount.
  const sessionStartRef = useRef<number>(Date.now());
  const sessionStartedFiredRef = useRef(false);
  const sessionCompletedFiredRef = useRef(false);
  const skippedCountRef = useRef(0);
  // Lazy initializer pulls the saved mode from localStorage once on mount.
  // SSR-safe: readSavedMode short-circuits to null when window is absent,
  // and the lazy callback only runs client-side anyway because this is a
  // 'use client' component. Previously this lived in a mount effect, which
  // tripped the set-state-in-effect rule.
  const [preferredMode, setPreferredMode] = useState<RecallMode | null>(() => readSavedMode());

  const remaining = useMemo(
    () => sessionQueue.filter((i) => !progressedIds.includes(i.recallCardId)),
    [sessionQueue, progressedIds],
  );

  const currentRaw = remaining[0];
  const current: RecallQueueItem | null = useMemo(() => {
    if (!currentRaw) return null;
    const override = modeOverrides[currentRaw.recallCardId];
    const effectiveMode = override ?? preferredMode ?? currentRaw.mode;
    return effectiveMode === currentRaw.mode ? currentRaw : { ...currentRaw, mode: effectiveMode };
  }, [currentRaw, modeOverrides, preferredMode]);

  useEffect(() => {
    if (!currentRaw) return;
    if (modeOverrides[currentRaw.recallCardId]) return;
    if (!preferredMode || preferredMode === currentRaw.mode) return;
     
    setModeOverrides((prev) => ({ ...prev, [currentRaw.recallCardId]: preferredMode }));
    setMode({ recallCardId: currentRaw.recallCardId, mode: preferredMode });
  }, [currentRaw, preferredMode, modeOverrides, setMode]);

  // Mixpanel: fire `recall_session_started` exactly once when the queue is
  // first non-empty, then `recall_card_shown` for every card the user
  // actually sees. `entry_point` defaults to 'recall_screen' here; the
  // home-page `TodayReview` route would need its own emit (defer).
  useEffect(() => {
    if (!current || sessionStartedFiredRef.current) return;
    sessionStartedFiredRef.current = true;
    analytics.track('recall_session_started', {
      cards_due_count: queue?.counts.dueTotal ?? sessionQueue.length,
      mode: preferredMode ?? current.mode,
      entry_point: 'recall_screen',
    });
  }, [current, queue, sessionQueue, preferredMode]);

  useEffect(() => {
    if (!current) return;
    // `dueAt` is null for fresh cards (never reviewed). Use it to derive
    // an approximation of days_since_last_review for due cards. The
    // server is the canonical place for "days since last review";
    // approximating from `dueAt` is good enough for funnel-shape analyses.
    const dueAtMs = current.dueAt ? new Date(current.dueAt).getTime() : null;
    const daysSinceDue = dueAtMs ? Math.max(0, Math.round((Date.now() - dueAtMs) / (24 * 60 * 60 * 1000))) : null;
    analytics.track('recall_card_shown', {
      card_id: current.recallCardId,
      course_id: current.courseId,
      box: current.box,
      mode: current.mode,
      is_new: current.isNew,
      ...(daysSinceDue !== null && { days_since_due: daysSinceDue }),
    });
  }, [current?.recallCardId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mixpanel: `recall_session_completed` when the user clears the queue.
  // Fires exactly once per session.
  useEffect(() => {
    if (sessionCompletedFiredRef.current) return;
    if (sessionQueue.length === 0) return;
    if (current) return;
    sessionCompletedFiredRef.current = true;
    analytics.track('recall_session_completed', {
      cards_reviewed: progressedIds.length - skippedCountRef.current,
      cards_skipped: skippedCountRef.current,
      session_duration_seconds: Math.max(
        0,
        Math.round((Date.now() - sessionStartRef.current) / 1000),
      ),
    });
  }, [current, sessionQueue.length, progressedIds.length]);

  const handleRate = ({ rating, typedMatch }: { rating: RecallRating; typedMatch?: number | null }) => {
    if (!current) return;
    const id = current.recallCardId;
    rate({ recallCardId: id, rating, typedMatch });
    setProgressedIds((prev) => [...prev, id]);
  };

  const handleSkip = () => {
    if (!current) return;
    const id = current.recallCardId;
    skip(id);
    skippedCountRef.current += 1;
    setProgressedIds((prev) => [...prev, id]);
  };

  const handleToggleMode = () => {
    if (!current) return;
    const nextMode: RecallMode = current.mode === 'tap-reveal' ? 'typed-recall' : 'tap-reveal';
    analytics.track('recall_mode_changed', {
      from_mode: current.mode,
      to_mode: nextMode,
    });
    setModeOverrides((prev) => ({ ...prev, [current.recallCardId]: nextMode }));
    setMode({ recallCardId: current.recallCardId, mode: nextMode });
    setPreferredMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
    }
  };

  // ── Loading ───────────────────────────────────

  if (isLoading) return <RecallLoadingShell />;

  const reviewed = progressedIds.length;
  const total = sessionQueue.length;

  // ── No recall cards yet — user hasn't generated enough lessons ──

  if (total === 0) {
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

  // ── Done state — user has cleared the session queue ──

  if (!current) {
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
            <S.EmptyTitle>Come back tomorrow.</S.EmptyTitle>
            <S.EmptyText>
              Spaced repetition works best when reviews sit at roughly 10–20% of the retention
              horizon. More cards will appear as they come due.
            </S.EmptyText>
            <S.EmptyDateline>
              <S.DatelineStrong>{reviewed}</S.DatelineStrong> reviewed today
              <S.DatelineSep>·</S.DatelineSep>
              <S.DatelineStrong>{stats?.totalReviewed ?? 0}</S.DatelineStrong> all time
              <S.DatelineSep>·</S.DatelineSep>
              <S.DatelineStrong>{stats?.dueThisWeek ?? 0}</S.DatelineStrong> due this week
            </S.EmptyDateline>
          </S.EmptyState>
        </S.ContentWrap>
      </PageLayout>
    );
  }

  // ── Active session ──

  return (
    <PageLayout>
      <S.ContentWrap>
        <S.PageHeader>
          <S.Eyebrow>
            Recall <HelpAnchor concept="spaced-recall" size="sm" />
          </S.Eyebrow>
          <S.Title>Where reading turns into knowing.</S.Title>
          <S.Subtitle>
            Recall the answer first, then rate how well it came back. The scheduler handles the
            rest.
          </S.Subtitle>
        </S.PageHeader>

        <S.CardArea>
          <QueueHeader
            reviewed={reviewed}
            total={total}
            dueTotal={queue?.counts.dueTotal ?? 0}
            freshAvailable={queue?.counts.freshAvailable ?? 0}
          />
          <RecallCard
            key={current.recallCardId}
            card={current}
            onRate={handleRate}
            onSkip={handleSkip}
            onToggleMode={handleToggleMode}
            isRating={isRating}
          />
        </S.CardArea>
      </S.ContentWrap>
    </PageLayout>
  );
};
