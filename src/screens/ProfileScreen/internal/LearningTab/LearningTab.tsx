import Skeleton from 'react-loading-skeleton';
import { useGamificationProfile, useGamificationStats, useQuizTrends } from '@/hooks/useGamification';
import { GamificationSection } from '../GamificationSection/GamificationSection';
import { ActivityHeatmap } from './internal/ActivityHeatmap/ActivityHeatmap';
import { QuizScoreTrend } from './internal/QuizScoreTrend/QuizScoreTrend';
import * as QS from './internal/QuizScoreTrend/QuizScoreTrend.styles';
import { RecallActivityCard } from './internal/RecallActivityCard/RecallActivityCard';
import { WeeklySummary } from './internal/WeeklySummary/WeeklySummary';
import * as WS from './internal/WeeklySummary/WeeklySummary.styles';
import { XpChart } from './internal/XpChart/XpChart';

// ── Skeleton placeholders ─────────────────────────

const SummarySkeleton = () => (
  <WS.Grid>
    {[0, 1, 2, 3, 4].map((i) => (
      <WS.Card key={i}>
        <WS.Value><Skeleton width={52} /></WS.Value>
        <WS.Label><Skeleton width={68} /></WS.Label>
        <WS.Delta $positive={false} $neutral={true}><Skeleton width={96} /></WS.Delta>
      </WS.Card>
    ))}
  </WS.Grid>
);

const QuizTrendSkeleton = () => (
  <QS.Section>
    <QS.Header>
      <Skeleton width={100} height={12} borderRadius={4} />
      <Skeleton width={80} height={10} borderRadius={4} />
    </QS.Header>
    <Skeleton height={200} borderRadius={8} />
  </QS.Section>
);

// ── Main component ────────────────────────────────

export const LearningTab: React.FC = () => {
  const { data: profile } = useGamificationProfile();
  const { data: stats, isLoading: statsLoading } = useGamificationStats();
  const { data: quizTrends, isLoading: quizLoading } = useQuizTrends();

  return (
    <>
      {/* Widget 1: Weekly Summary */}
      {statsLoading && <SummarySkeleton />}
      {stats?.weeklySummary && (
        <WeeklySummary thisWeek={stats.weeklySummary.thisWeek} lastWeek={stats.weeklySummary.lastWeek} />
      )}

      {/* Widget 2: 30-Day XP Chart */}
      <XpChart data={stats?.xpByDay} loading={statsLoading} />

      {/* Widget 3: Activity Heatmap */}
      <ActivityHeatmap data={stats?.xpByDay} activeDates={profile?.activeDates} loading={statsLoading} />

      {/* Widget 4: Quiz Score Trend */}
      {quizLoading && !quizTrends && <QuizTrendSkeleton />}
      {quizTrends && <QuizScoreTrend data={quizTrends} />}

      {/* Widget 5: Recall retention */}
      <RecallActivityCard />

      {/* Achievements (existing) */}
      <GamificationSection />
    </>
  );
};
