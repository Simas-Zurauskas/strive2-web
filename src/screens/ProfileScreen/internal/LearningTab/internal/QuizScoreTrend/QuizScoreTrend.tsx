import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { themeColors } from '@/theme';
import { tooltipShellStyle } from '../_shared/chartTooltip';
import {
  Section,
  SectionHeader,
  SectionEyebrow,
  TrendChip,
  EmptyBlock,
  EmptyRule,
  EmptyEyebrow,
  EmptyTitle,
  EmptyText,
} from '../_shared/styles';
import type { QuizTrendsResult } from '@/api/types';

interface QuizScoreTrendProps {
  data: QuizTrendsResult;
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
        align: 'left',
        verticalAlign: 'bottom',
        margin: 12,
        itemDistance: 14,
        itemMarginTop: 2,
        itemMarginBottom: 2,
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
          // Per-point tooltip — Highcharts gives us `this.point` directly,
          // not a `points[]` array (we're not in shared-tooltip mode here).
          const ctx = this as unknown as {
            point: { y: number; custom?: { moduleName: string } };
            series: { name: string };
            color: string;
          };
          const score = ctx.point.y ?? 0;
          const tier = score >= 80 ? 'Mastered' : score >= 60 ? 'Passed' : 'Needs review';
          const tierColor = score >= 80 ? c.success : score >= 60 ? c.accent : c.error;
          return (
            `<div style="${tooltipShellStyle(c)}">` +
            `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">` +
            `<span style="width:8px;height:8px;border-radius:50%;background:${ctx.color};flex-shrink:0"></span>` +
            `<span style="font-weight:600">${ctx.series.name}</span></div>` +
            `<div style="color:${c.muted};font-size:0.6875rem;margin-bottom:6px">` +
            `${ctx.point.custom?.moduleName ?? ''}</div>` +
            `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">` +
            `<span style="font-family:var(--font-heading-serif),Georgia,serif;font-style:italic;` +
            `font-size:1.25rem;font-weight:600;font-variant-numeric:tabular-nums">${score}%</span>` +
            `<span style="display:inline-flex;align-items:center;gap:5px;font-size:0.625rem;` +
            `font-weight:600;letter-spacing:0.06em;text-transform:uppercase;` +
            `padding:0.1875rem 0.5rem;border-radius:var(--radius-pill);` +
            `border:1px solid color-mix(in oklab, ${tierColor} 28%, transparent);` +
            `background:color-mix(in oklab, ${tierColor} 10%, transparent);` +
            `color:${tierColor}">${tier}</span>` +
            `</div></div>`
          );
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
      <Section>
        <SectionHeader>
          <SectionEyebrow>Quiz scores</SectionEyebrow>
        </SectionHeader>
        <EmptyBlock>
          <EmptyRule aria-hidden />
          <EmptyEyebrow>Nothing to chart yet</EmptyEyebrow>
          <EmptyTitle>Take a quiz to start the line.</EmptyTitle>
          <EmptyText>
            Module quizzes appear here once you&rsquo;ve attempted at least one — the chart tracks
            your best score per attempt across courses.
          </EmptyText>
        </EmptyBlock>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <SectionEyebrow>Quiz scores</SectionEyebrow>
        {data.recentTrend !== 0 && (
          <TrendChip $positive={data.recentTrend > 0}>
            {data.recentTrend > 0 ? '+' : ''}
            {data.recentTrend}% this month
          </TrendChip>
        )}
      </SectionHeader>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Section>
  );
};
