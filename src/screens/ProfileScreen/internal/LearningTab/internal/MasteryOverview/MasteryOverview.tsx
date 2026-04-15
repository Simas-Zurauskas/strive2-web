import { useMemo, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { useMasteryCourses, useMasteryOverview } from '@/hooks/useGamification';
import * as S from './MasteryOverview.styles';

export const MasteryOverview: React.FC = () => {
  const theme = useTheme();
  const { data: courses, isLoading: coursesLoading } = useMasteryCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();

  // Auto-select first course
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].courseId);
    }
  }, [courses, selectedCourseId]);

  const { data: mastery, isLoading: masteryLoading } = useMasteryOverview(selectedCourseId);

  const options: Highcharts.Options = useMemo(() => {
    if (!mastery) return {};

    const modules = mastery.modules;
    const categories = modules.map((m) => m.moduleName);

    // For stacked bar, each tier is a series. Each module gets 1 (full bar) for its tier and 0 for others.
    const masteredData = modules.map((m) => (m.bestTier === 'mastered' ? 1 : 0));
    const passedData = modules.map((m) => (m.bestTier === 'passed' ? 1 : 0));
    const needsReviewData = modules.map((m) => (m.bestTier === 'needs_review' ? 1 : 0));
    const notAttemptedData = modules.map((m) => (m.bestTier === null ? 1 : 0));

    return {
      chart: {
        type: 'bar',
        height: Math.max(150, modules.length * 36 + 40),
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: true,
        reversed: true,
        itemStyle: { color: theme.colors.muted, fontSize: '0.625rem', fontWeight: '500' },
        itemHoverStyle: { color: theme.colors.foreground },
        symbolHeight: 8,
        symbolWidth: 8,
        symbolRadius: 2,
      },
      xAxis: {
        categories,
        labels: {
          style: { color: theme.colors.foreground, fontSize: '0.6875rem' },
          formatter: function () {
            const label = String(this.value);
            return label.length > 24 ? label.slice(0, 22) + '...' : label;
          },
        },
        lineWidth: 0,
      },
      yAxis: {
        visible: false,
        min: 0,
        max: 1,
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          borderWidth: 0,
          borderRadius: 3,
          pointPadding: 0.1,
          groupPadding: 0.05,
        },
      },
      tooltip: {
        useHTML: true,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        style: { color: theme.colors.foreground, fontSize: '0.75rem' },
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const ctx = this as unknown as { point: { x: number } };
          const mod = mastery.modules[ctx.point.x];
          const score = mod.bestScore != null ? `${mod.bestScore}%` : 'No attempts';
          const tier = mod.bestTier ?? 'Not attempted';
          return `<b>${mod.moduleName}</b><br/>Status: ${tier}<br/>Best score: ${score}`;
        },
      },
      series: [
        { name: 'Mastered', type: 'bar', data: masteredData, color: theme.colors.success },
        { name: 'Passed', type: 'bar', data: passedData, color: theme.colors.warning },
        { name: 'Needs Review', type: 'bar', data: needsReviewData, color: theme.colors.error },
        { name: 'Not Attempted', type: 'bar', data: notAttemptedData, color: theme.colors.border },
      ],
    };
  }, [mastery, theme]);

  if (coursesLoading) {
    return (
      <S.Section>
        <S.Header>
          <Skeleton width={80} height={12} borderRadius={4} />
        </S.Header>
        <Skeleton count={4} height={24} borderRadius={6} style={{ marginBottom: '0.5rem' }} />
      </S.Section>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <S.Section>
        <S.Header>
          <S.Title>Mastery</S.Title>
        </S.Header>
        <S.EmptyText>Complete courses with quizzes to see mastery data</S.EmptyText>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Header>
        <S.Title>Mastery</S.Title>
        {mastery && (
          <S.SummaryLabel>
            {mastery.summary.mastered}/{mastery.summary.total} mastered
          </S.SummaryLabel>
        )}
        {courses.length > 1 && (
          <S.CourseSelect value={selectedCourseId ?? ''} onChange={(e) => setSelectedCourseId(e.target.value)}>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName}
              </option>
            ))}
          </S.CourseSelect>
        )}
      </S.Header>
      {masteryLoading && (
        <Skeleton count={4} height={24} borderRadius={6} style={{ marginBottom: '0.5rem' }} />
      )}
      {mastery && !masteryLoading && <HighchartsReact highcharts={Highcharts} options={options} />}
    </S.Section>
  );
};
