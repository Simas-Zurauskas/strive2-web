import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from 'styled-components';
import * as S from './XpChart.styles';

interface XpDayEntry {
  date: string;
  xp: number;
  sources: { lesson_complete: number; quiz_score: number; exercise_pass: number; review_complete: number };
}

interface XpChartProps {
  data: XpDayEntry[];
}

export const XpChart: React.FC<XpChartProps> = ({ data }) => {
  const theme = useTheme();

  // Only show last 30 days
  const last30 = useMemo(() => data.slice(-30), [data]);

  const options: Highcharts.Options = useMemo(() => {
    const categories = last30.map((d) => {
      const date = new Date(d.date + 'T00:00:00');
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      chart: {
        type: 'column',
        height: 200,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        itemStyle: { color: theme.colors.muted, fontSize: '0.625rem', fontWeight: '500' },
        itemHoverStyle: { color: theme.colors.foreground },
        symbolHeight: 8,
        symbolWidth: 8,
        symbolRadius: 2,
      },
      xAxis: {
        categories,
        labels: {
          step: Math.ceil(last30.length / 6),
          style: { color: theme.colors.muted, fontSize: '0.5625rem' },
        },
        lineColor: theme.colors.border,
        tickLength: 0,
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: theme.colors.border,
        labels: { style: { color: theme.colors.muted, fontSize: '0.5625rem' } },
        min: 0,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0.05,
          groupPadding: 0.05,
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        style: { color: theme.colors.foreground, fontSize: '0.75rem' },
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b> XP<br/>',
        footerFormat: '<b>Total: {point.total}</b> XP',
      },
      series: [
        {
          name: 'Lessons',
          type: 'column',
          data: last30.map((d) => d.sources.lesson_complete),
          color: theme.colors.accent,
        },
        {
          name: 'Quizzes',
          type: 'column',
          data: last30.map((d) => d.sources.quiz_score),
          color: theme.colors.tertiary,
        },
        {
          name: 'Exercises',
          type: 'column',
          data: last30.map((d) => d.sources.exercise_pass),
          color: theme.colors.success,
        },
        {
          name: 'Reviews',
          type: 'column',
          data: last30.map((d) => d.sources.review_complete),
          color: theme.colors.warning,
        },
      ],
    };
  }, [last30, theme]);

  if (last30.length === 0) return null;

  const startDate = last30[0].date;
  const endDate = last30[last30.length - 1].date;
  const fmt = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <S.Section>
      <S.Header>
        <S.Title>XP — Last 30 Days</S.Title>
        <S.RangeLabel>
          {fmt(startDate)} — {fmt(endDate)}
        </S.RangeLabel>
      </S.Header>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </S.Section>
  );
};
