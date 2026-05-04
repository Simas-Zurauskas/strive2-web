import Skeleton from 'react-loading-skeleton';
import { useGamificationProfile, useGamificationStats, useQuizTrends } from '@/hooks/useGamification';
import { GamificationSection } from '../GamificationSection/GamificationSection';
import { Section, SectionHeader } from './internal/_shared/styles';
import { ActivityHeatmap } from './internal/ActivityHeatmap/ActivityHeatmap';
import { QuizScoreTrend } from './internal/QuizScoreTrend/QuizScoreTrend';
import { RecallActivityCard } from './internal/RecallActivityCard/RecallActivityCard';
import { WeeklySummary } from './internal/WeeklySummary/WeeklySummary';
import * as WS from './internal/WeeklySummary/WeeklySummary.styles';
import { XpChart } from './internal/XpChart/XpChart';

// ── Skeleton placeholders ─────────────────────────

const SummarySkeleton = () => (
  <WS.Wrap>
    <WS.Header>
      <WS.Eyebrow>
        <Skeleton width={64} />
      </WS.Eyebrow>
      <WS.Sub>
        <Skeleton width={72} />
      </WS.Sub>
    </WS.Header>
    <WS.Grid>
      {[0, 1, 2, 3, 4].map((i) => (
        <WS.Cell key={i}>
          <WS.Label>
            <Skeleton width={56} />
          </WS.Label>
          <WS.Value>
            <Skeleton width={42} />
          </WS.Value>
          <WS.Delta $positive={false} $neutral>
            <Skeleton width={28} />
          </WS.Delta>
        </WS.Cell>
      ))}
    </WS.Grid>
  </WS.Wrap>
);

const QuizTrendSkeleton = () => (
  <Section>
    <SectionHeader>
      <Skeleton width={100} height={12} borderRadius={4} />
      <Skeleton width={80} height={10} borderRadius={4} />
    </SectionHeader>
    <Skeleton height={200} borderRadius={8} />
  </Section>
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
