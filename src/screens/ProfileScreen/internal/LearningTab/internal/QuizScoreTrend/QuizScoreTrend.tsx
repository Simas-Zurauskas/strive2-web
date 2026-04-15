import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from 'styled-components';
import type { QuizTrendsData } from '@/api/routes/gamification';
import * as S from './QuizScoreTrend.styles';

interface QuizScoreTrendProps {
  data: QuizTrendsData;
}

export const QuizScoreTrend: React.FC<QuizScoreTrendProps> = ({ data }) => {
  const theme = useTheme();

  const options: Highcharts.Options = useMemo(() => {
    // Group attempts by course for separate series
    const courseMap = new Map<string, { name: string; points: { x: number; y: number; moduleName: string }[] }>();

    for (const a of data.attempts) {
      if (!courseMap.has(a.courseId)) {
        courseMap.set(a.courseId, { name: a.courseName, points: [] });
      }
      courseMap.get(a.courseId)!.points.push({
        x: new Date(a.date + 'T00:00:00').getTime(),
        y: a.score,
        moduleName: a.moduleName,
      });
    }

    const courseColors = [theme.colors.accent, theme.colors.tertiary, theme.colors.success, theme.colors.warning];
    const series: Highcharts.SeriesOptionsType[] = [...courseMap.values()].map((course, i) => ({
      type: 'spline' as const,
      name: course.name,
      data: course.points.map((p) => ({ x: p.x, y: p.y, custom: { moduleName: p.moduleName } })),
      color: courseColors[i % courseColors.length],
      marker: { radius: 4, symbol: 'circle' },
      lineWidth: 2,
    }));

    return {
      chart: {
        height: 220,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: courseMap.size > 1,
        itemStyle: { color: theme.colors.muted, fontSize: '0.625rem', fontWeight: '500' },
        itemHoverStyle: { color: theme.colors.foreground },
        symbolHeight: 8,
        symbolWidth: 8,
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: theme.colors.muted, fontSize: '0.5625rem' } },
        lineColor: theme.colors.border,
        tickLength: 0,
      },
      yAxis: {
        title: { text: undefined },
        min: 0,
        max: 100,
        gridLineColor: theme.colors.border,
        labels: {
          format: '{value}%',
          style: { color: theme.colors.muted, fontSize: '0.5625rem' },
        },
        plotLines: [
          {
            value: data.averageScore,
            color: theme.colors.muted,
            dashStyle: 'Dash',
            width: 1,
            label: {
              text: `Avg: ${data.averageScore}%`,
              align: 'right',
              style: { color: theme.colors.muted, fontSize: '0.5625rem' },
            },
          },
        ],
      },
      tooltip: {
        useHTML: true,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        style: { color: theme.colors.foreground, fontSize: '0.75rem' },
        pointFormat:
          '<span style="color:{series.color}">\u25CF</span> {series.name}<br/>' +
          '{point.custom.moduleName}: <b>{point.y}%</b>',
      },
      plotOptions: {
        spline: { connectNulls: true },
      },
      series,
    };
  }, [data, theme]);

  if (data.attempts.length === 0) {
    return (
      <S.Section>
        <S.Header>
          <S.Title>Quiz Scores</S.Title>
        </S.Header>
        <S.EmptyText>Complete quizzes to see your score trend</S.EmptyText>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Header>
        <S.Title>Quiz Scores</S.Title>
        {data.recentTrend !== 0 && (
          <S.TrendLabel $positive={data.recentTrend > 0}>
            {data.recentTrend > 0 ? '+' : ''}
            {data.recentTrend}% this month
          </S.TrendLabel>
        )}
      </S.Header>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </S.Section>
  );
};
