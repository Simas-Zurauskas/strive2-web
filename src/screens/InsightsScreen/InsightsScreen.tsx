'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PageLayout, TextLoader, Button } from '@/components';
import {
  useInsightQueue,
  useInsightStats,
  useRateInsight,
  useSetInsightMode,
  useSkipInsight,
} from '@/hooks';
import * as S from './InsightsScreen.styles';
import { InsightCard } from './internal/InsightCard/InsightCard';
import { QueueHeader } from './internal/QueueHeader/QueueHeader';
import type { InsightMode, InsightQueueItem, InsightRating } from '@/api/types';

const MODE_STORAGE_KEY = 'strive:insightsMode';

const readSavedMode = (): InsightMode | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(MODE_STORAGE_KEY);
  return saved === 'tap-reveal' || saved === 'typed-recall' ? saved : null;
};

export const InsightsScreen = () => {
  const router = useRouter();
  const { data: queue, isLoading } = useInsightQueue();
  const { data: stats } = useInsightStats();
  const { mutate: rate, isPending: isRating } = useRateInsight();
  const { mutate: skip } = useSkipInsight();
  const { mutate: setMode } = useSetInsightMode();

  // Snapshot the queue at mount so a rate/skip doesn't reshuffle the list
  // while the user is mid-review. When the user finishes, they see the
  // empty/done state; any newly due items from refetch appear on next mount.
  const sessionQueue = useMemo<InsightQueueItem[]>(() => {
    if (!queue) return [];
    return [...queue.due, ...queue.fresh];
  }, [queue]);

  // Local session progress. If the user toggles mode on a card, we patch it
  // in place without advancing.
  const [progressedIds, setProgressedIds] = useState<string[]>([]);
  const [modeOverrides, setModeOverrides] = useState<Record<string, InsightMode>>({});
  // Persisted mode preference — defaults new cards to the last-used mode so the
  // user doesn't re-toggle on every card. Hydrated from localStorage after mount
  // to avoid SSR/CSR divergence.
  const [preferredMode, setPreferredMode] = useState<InsightMode | null>(null);
  useEffect(() => {
    setPreferredMode(readSavedMode());
  }, []);

  const remaining = useMemo(
    () => sessionQueue.filter((i) => !progressedIds.includes(i.insightId)),
    [sessionQueue, progressedIds],
  );

  const currentRaw = remaining[0];
  const current: InsightQueueItem | null = useMemo(() => {
    if (!currentRaw) return null;
    const override = modeOverrides[currentRaw.insightId];
    const effectiveMode = override ?? preferredMode ?? currentRaw.mode;
    return effectiveMode === currentRaw.mode ? currentRaw : { ...currentRaw, mode: effectiveMode };
  }, [currentRaw, modeOverrides, preferredMode]);

  // When a new card comes up and the saved preference differs from its server
  // mode, lock the override in and sync the backend so stats/queue reflect it.
  useEffect(() => {
    if (!currentRaw) return;
    if (modeOverrides[currentRaw.insightId]) return;
    if (!preferredMode || preferredMode === currentRaw.mode) return;
    setModeOverrides((prev) => ({ ...prev, [currentRaw.insightId]: preferredMode }));
    setMode({ insightId: currentRaw.insightId, mode: preferredMode });
  }, [currentRaw, preferredMode, modeOverrides, setMode]);

  const handleRate = (rating: InsightRating, typedMatch?: number | null) => {
    if (!current) return;
    const id = current.insightId;
    rate(
      { insightId: id, rating, typedMatch },
      {
        // Advance optimistically — research doc favours low-friction flow.
        // Errors show as toasts via the global meta.errorMessage handler.
      },
    );
    setProgressedIds((prev) => [...prev, id]);
  };

  const handleSkip = () => {
    if (!current) return;
    const id = current.insightId;
    skip(id);
    setProgressedIds((prev) => [...prev, id]);
  };

  const handleToggleMode = () => {
    if (!current) return;
    const nextMode: InsightMode = current.mode === 'tap-reveal' ? 'typed-recall' : 'tap-reveal';
    setModeOverrides((prev) => ({ ...prev, [current.insightId]: nextMode }));
    setMode({ insightId: current.insightId, mode: nextMode });
    setPreferredMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
    }
  };

  // ── Render states ──────────────────────────────

  if (isLoading) {
    return (
      <PageLayout>
        <S.ContentWrap>
          <TextLoader />
        </S.ContentWrap>
      </PageLayout>
    );
  }

  const reviewed = progressedIds.length;
  const total = sessionQueue.length;

  // No insights yet — user hasn't generated enough lessons.
  if (total === 0) {
    return (
      <PageLayout>
        <S.ContentWrap>
          <S.PageHeader>
            <S.Title>Insights</S.Title>
            <S.Subtitle>
              Tiny retrieval-practice cards extracted from your lessons, surfaced at spaced intervals.
            </S.Subtitle>
          </S.PageHeader>

          <S.EmptyState>
            <S.EmptyIconWrap>
              <Sparkles size={28} strokeWidth={1.75} />
            </S.EmptyIconWrap>
            <S.EmptyTitle>Nothing here yet</S.EmptyTitle>
            <S.EmptyText>
              Complete a lesson and the most important ideas become insight cards you can review in a few minutes a day.
            </S.EmptyText>
            <Button variant="primary" onClick={() => router.push('/')}>
              Go to courses
            </Button>
          </S.EmptyState>
        </S.ContentWrap>
      </PageLayout>
    );
  }

  // Done state — user has cleared the session queue.
  if (!current) {
    return (
      <PageLayout>
        <S.ContentWrap>
          <S.PageHeader>
            <S.Title>Insights</S.Title>
          </S.PageHeader>

          <S.EmptyState>
            <S.EmptyIconWrap>
              <Sparkles size={28} strokeWidth={1.75} />
            </S.EmptyIconWrap>
            <S.EmptyTitle>You&apos;re done for today</S.EmptyTitle>
            <S.EmptyText>
              Come back tomorrow — spaced repetition works best when reviews sit at roughly 10-20% of the retention horizon. More cards will appear as they come due.
            </S.EmptyText>
            <S.EmptyStats>
              <S.EmptyStat>
                <S.EmptyStatValue>{reviewed}</S.EmptyStatValue>
                <S.EmptyStatLabel>Reviewed</S.EmptyStatLabel>
              </S.EmptyStat>
              <S.EmptyStat>
                <S.EmptyStatValue>{stats?.totalReviewed ?? 0}</S.EmptyStatValue>
                <S.EmptyStatLabel>All time</S.EmptyStatLabel>
              </S.EmptyStat>
              <S.EmptyStat>
                <S.EmptyStatValue>{stats?.dueThisWeek ?? 0}</S.EmptyStatValue>
                <S.EmptyStatLabel>Due this week</S.EmptyStatLabel>
              </S.EmptyStat>
            </S.EmptyStats>
          </S.EmptyState>
        </S.ContentWrap>
      </PageLayout>
    );
  }

  // Active session.
  return (
    <PageLayout>
      <S.ContentWrap>
        <S.PageHeader>
          <S.Title>Insights</S.Title>
          <S.Subtitle>
            Recall the answer first, then rate how well it came back. The scheduler handles the rest.
          </S.Subtitle>
        </S.PageHeader>

        <S.CardArea>
          <QueueHeader
            reviewed={reviewed}
            total={total}
            dueTotal={queue?.counts.dueTotal ?? 0}
            freshAvailable={queue?.counts.freshAvailable ?? 0}
          />
          <InsightCard
            key={current.insightId}
            insight={current}
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
