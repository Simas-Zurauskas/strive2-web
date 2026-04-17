import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from 'styled-components';
import { themeColors } from '@/theme';
import type { QuizTrendsData } from '@/api/routes/gamification';
import * as S from './QuizScoreTrend.styles';

interface QuizScoreTrendProps {
  data: QuizTrendsData;
}

export const QuizScoreTrend: React.FC<QuizScoreTrendProps> = ({ data }) => {
  const theme = useTheme();
  const scheme = theme.scheme === 'dark' ? 'dark' : 'light';
  const c = themeColors[scheme];

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

    // Deduplicate: keep best score per day per course
    for (const course of courseMap.values()) {
      const bestByDay = new Map<number, (typeof course.points)[0]>();
      for (const p of course.points) {
        const existing = bestByDay.get(p.x);
        if (!existing || p.y > existing.y) bestByDay.set(p.x, p);
      }
      course.points = [...bestByDay.values()].sort((a, b) => a.x - b.x);
    }

    const courseColors = [c.accent, c.tertiary, c.success, c.warning, c.error];
    const markerSymbols: ('circle' | 'diamond' | 'square' | 'triangle' | 'triangle-down')[] = [
      'circle', 'diamond', 'square', 'triangle', 'triangle-down',
    ];
    const series: Highcharts.SeriesOptionsType[] = [...courseMap.values()].map((course, i) => ({
      type: 'spline' as const,
      name: course.name,
      data: course.points.map((p) => ({ x: p.x, y: p.y, custom: { moduleName: p.moduleName } })),
      color: courseColors[i % courseColors.length],
      marker: { radius: 5, symbol: markerSymbols[i % markerSymbols.length] },
      lineWidth: 2,
    }));

    return {
      chart: {
        height: 280,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: courseMap.size > 1,
        itemStyle: { color: c.muted, fontSize: '0.625rem', fontWeight: '500' },
        itemHoverStyle: { color: c.foreground },
        symbolHeight: 8,
        symbolWidth: 8,
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: c.muted, fontSize: '0.5625rem' } },
        lineColor: c.surfaceBorder,
        tickLength: 0,
      },
      yAxis: {
        title: { text: undefined },
        min: 0,
        max: 100,
        tickInterval: 20,
        gridLineColor: c.surfaceBorder,
        labels: {
          format: '{value}%',
          style: { color: c.muted, fontSize: '0.5625rem' },
        },
        plotLines: [
          {
            value: data.averageScore,
            color: c.muted,
            dashStyle: 'Dash',
            width: 1,
            zIndex: 3,
            label: {
              text: `Avg: ${data.averageScore}%`,
              align: 'right',
              style: { color: c.muted, fontSize: '0.5625rem' },
            },
          },
        ],
      },
      tooltip: {
        useHTML: true,
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: false,
        padding: 0,
        outside: true,
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const ctx = this as unknown as { point: { y: number; custom?: { moduleName: string } }; series: { name: string }; color: string };
          const score = ctx.point.y ?? 0;
          const tier = score >= 80 ? 'Mastered' : score >= 60 ? 'Passed' : 'Needs Review';
          const tierColor = score >= 80 ? c.success : score >= 60 ? c.accent : c.error;
          return `<div style="background:${c.surface};border:1px solid ${c.surfaceBorder};border-radius:12px;padding:12px 14px;min-width:160px;` +
            `box-shadow:0 4px 24px rgba(0,0,0,${scheme === 'dark' ? '0.5' : '0.15'}),0 1px 4px rgba(0,0,0,${scheme === 'dark' ? '0.3' : '0.08'});` +
            `color:${c.foreground};font-size:0.75rem;line-height:1.5">` +
            `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">` +
            `<span style="width:8px;height:8px;border-radius:50%;background:${ctx.color};flex-shrink:0"></span>` +
            `<span style="font-weight:600">${ctx.series.name}</span></div>` +
            `<div style="color:${c.muted};margin-bottom:4px">${ctx.point.custom?.moduleName ?? ''}</div>` +
            `<div style="display:flex;justify-content:space-between;align-items:center">` +
            `<span style="font-weight:700;font-size:1rem">${score}%</span>` +
            `<span style="display:flex;align-items:center;gap:4px;font-weight:600;color:${tierColor}">` +
            `<span style="width:6px;height:6px;border-radius:50%;background:${tierColor}"></span>${tier}</span>` +
            `</div></div>`;
        },
      },
      plotOptions: {
        spline: { connectNulls: true },
      },
      series,
    };
  }, [data, c]);

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
