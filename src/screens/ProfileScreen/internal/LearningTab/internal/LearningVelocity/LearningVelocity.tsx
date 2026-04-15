import * as S from './LearningVelocity.styles';

interface VelocityData {
  lessonsPerWeek: { current: number; previous: number };
  avgTimePerLessonSeconds: number;
  projections: {
    courseId: string;
    courseName: string;
    completedLessons: number;
    totalLessons: number;
    projectedCompletionDate: string | null;
  }[];
}

interface LearningVelocityProps {
  data: VelocityData;
}

const formatTime = (seconds: number): string => {
  if (seconds === 0) return '—';
  const m = Math.round(seconds / 60);
  if (m < 60) return `~${m} min`;
  const h = Math.floor(m / 60);
  return `~${h}h ${m % 60}m`;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const LearningVelocity: React.FC<LearningVelocityProps> = ({ data }) => {
  const { lessonsPerWeek, avgTimePerLessonSeconds, projections } = data;

  // Show the most recently active incomplete course
  const activeProjection = projections.find((p) => p.completedLessons < p.totalLessons);
  const hasDelta = lessonsPerWeek.previous > 0;
  const delta = hasDelta ? lessonsPerWeek.current - lessonsPerWeek.previous : 0;

  if (lessonsPerWeek.current === 0 && lessonsPerWeek.previous === 0 && projections.length === 0) {
    return (
      <S.Section>
        <S.Title>Learning Pace</S.Title>
        <S.EmptyText>Complete lessons to see your learning pace</S.EmptyText>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Title>Learning Pace</S.Title>
      <S.MetricRow>
        <S.MetricLabel>Lessons / week</S.MetricLabel>
        <S.MetricValue>
          {lessonsPerWeek.current}
          {hasDelta && delta !== 0 && (
            <S.Delta $positive={delta > 0}>
              {delta > 0 ? '+' : ''}
              {delta} vs avg
            </S.Delta>
          )}
        </S.MetricValue>
      </S.MetricRow>
      <S.MetricRow>
        <S.MetricLabel>Avg time / lesson</S.MetricLabel>
        <S.MetricValue>{formatTime(avgTimePerLessonSeconds)}</S.MetricValue>
      </S.MetricRow>
      {activeProjection && (
        <S.MetricRow>
          <S.MetricLabel>Projected completion</S.MetricLabel>
          {activeProjection.projectedCompletionDate ? (
            <S.ProjectionDate>{formatDate(activeProjection.projectedCompletionDate)}</S.ProjectionDate>
          ) : (
            <S.MetricValue>—</S.MetricValue>
          )}
        </S.MetricRow>
      )}
      {activeProjection && (
        <S.MetricRow>
          <S.MetricLabel>{activeProjection.courseName}</S.MetricLabel>
          <S.MetricValue>
            {activeProjection.completedLessons}/{activeProjection.totalLessons} lessons
          </S.MetricValue>
        </S.MetricRow>
      )}
    </S.Section>
  );
};
