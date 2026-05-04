import * as S from './WeeklySummary.styles';
import type { WeeklySummaryPeriod } from '@/api/types';

interface WeeklySummaryProps {
  thisWeek: WeeklySummaryPeriod;
  lastWeek: WeeklySummaryPeriod;
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const formatDelta = ({
  current,
  previous,
}: {
  current: number;
  previous: number;
}): { text: string; positive: boolean; neutral: boolean } => {
  if (previous === 0 && current === 0) return { text: '—', positive: false, neutral: true };
  if (previous === 0) return { text: `+${current}`, positive: true, neutral: false };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { text: '—', positive: false, neutral: true };
  return { text: `${pct > 0 ? '+' : ''}${pct}%`, positive: pct > 0, neutral: false };
};

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ thisWeek, lastWeek }) => {
  const metrics = [
    {
      label: 'XP Earned',
      value: thisWeek.xp.toLocaleString(),
      delta: formatDelta({ current: thisWeek.xp, previous: lastWeek.xp }),
    },
    {
      label: 'Time Spent',
      value: formatTime(thisWeek.timeSeconds),
      delta: formatDelta({ current: thisWeek.timeSeconds, previous: lastWeek.timeSeconds }),
    },
    {
      label: 'Lessons',
      value: String(thisWeek.lessons),
      delta: formatDelta({ current: thisWeek.lessons, previous: lastWeek.lessons }),
    },
    {
      label: 'Quizzes',
      value: String(thisWeek.quizzes),
      delta: formatDelta({ current: thisWeek.quizzes, previous: lastWeek.quizzes }),
    },
    {
      label: 'Recall',
      value: String(thisWeek.recallReviews),
      delta: formatDelta({ current: thisWeek.recallReviews, previous: lastWeek.recallReviews }),
    },
  ];

  return (
    <S.Wrap>
      <S.Header>
        <S.Eyebrow>This week</S.Eyebrow>
        <S.Sub>vs last week</S.Sub>
      </S.Header>
      <S.Grid>
        {metrics.map((m) => (
          <S.Cell key={m.label}>
            <S.Label>{m.label}</S.Label>
            <S.Value>{m.value}</S.Value>
            <S.Delta $positive={m.delta.positive} $neutral={m.delta.neutral}>
              {m.delta.text}
            </S.Delta>
          </S.Cell>
        ))}
      </S.Grid>
    </S.Wrap>
  );
};
