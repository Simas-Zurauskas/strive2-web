import Skeleton from 'react-loading-skeleton';
import { useGamificationStats, useQuizTrends } from '@/hooks/useGamification';
import { GamificationSection } from '../GamificationSection/GamificationSection';
import { WeeklySummary } from './internal/WeeklySummary/WeeklySummary';
import { XpChart } from './internal/XpChart/XpChart';
import { ActivityHeatmap } from './internal/ActivityHeatmap/ActivityHeatmap';
import { QuizScoreTrend } from './internal/QuizScoreTrend/QuizScoreTrend';
import { MasteryOverview } from './internal/MasteryOverview/MasteryOverview';
import { LearningVelocity } from './internal/LearningVelocity/LearningVelocity';
import * as WS from './internal/WeeklySummary/WeeklySummary.styles';
import * as XS from './internal/XpChart/XpChart.styles';
import * as AS from './internal/ActivityHeatmap/ActivityHeatmap.styles';
import * as QS from './internal/QuizScoreTrend/QuizScoreTrend.styles';
import * as VS from './internal/LearningVelocity/LearningVelocity.styles';
import * as S from './LearningTab.styles';

// ── Skeleton placeholders ─────────────────────────
// Each mirrors the real widget's container + internal layout

const SummarySkeleton = () => (
  <WS.Grid>
    {[0, 1, 2, 3].map((i) => (
      <WS.Card key={i}>
        <Skeleton width={52} height={24} borderRadius={6} />
        <div style={{ marginTop: '0.25rem' }}>
          <Skeleton width={68} height={10} borderRadius={4} />
        </div>
        <div style={{ marginTop: '0.375rem' }}>
          <Skeleton width={88} height={10} borderRadius={4} />
        </div>
      </WS.Card>
    ))}
  </WS.Grid>
);

const XpChartSkeleton = () => (
  <XS.Section>
    <XS.Header>
      <Skeleton width={140} height={12} borderRadius={4} />
      <Skeleton width={100} height={10} borderRadius={4} />
    </XS.Header>
    <Skeleton height={180} borderRadius={8} />
  </XS.Section>
);

const HeatmapSkeleton = () => (
  <AS.Section>
    <AS.Header>
      <Skeleton width={160} height={12} borderRadius={4} />
      <Skeleton width={80} height={10} borderRadius={4} />
    </AS.Header>
    <Skeleton height={120} borderRadius={8} />
  </AS.Section>
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

const VelocitySkeleton = () => (
  <VS.Section>
    <Skeleton width={110} height={12} borderRadius={4} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
          <Skeleton width={110} height={14} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </div>
      ))}
    </div>
  </VS.Section>
);

// ── Main component ────────────────────────────────

export const LearningTab: React.FC = () => {
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
      {statsLoading && <XpChartSkeleton />}
      {stats?.xpByDay && <XpChart data={stats.xpByDay} />}

      {/* Widget 3: Activity Heatmap */}
      {statsLoading && <HeatmapSkeleton />}
      {stats?.xpByDay && <ActivityHeatmap data={stats.xpByDay} />}

      {/* Widgets 4 + 6: Quiz Score Trend + Learning Velocity (side by side) */}
      <S.SideBySide>
        {quizLoading && !quizTrends && <QuizTrendSkeleton />}
        {quizTrends && <QuizScoreTrend data={quizTrends} />}
        {statsLoading && !stats && <VelocitySkeleton />}
        {stats?.velocity && <LearningVelocity data={stats.velocity} />}
      </S.SideBySide>

      {/* Widget 5: Mastery Overview */}
      <MasteryOverview />

      {/* Achievements (existing) */}
      <GamificationSection />
    </>
  );
};
