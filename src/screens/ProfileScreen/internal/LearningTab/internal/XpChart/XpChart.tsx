import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { formatDate } from '@/lib/formatDate';
import { themeColors } from '@/theme';
import { buildTooltipHtml, type TooltipRow } from '../_shared/chartTooltip';
import { Section, SectionHeader, SectionEyebrow, SectionMeta } from '../_shared/styles';
import type { XpDayEntry } from '@/api/types';

interface XpChartProps {
  data?: XpDayEntry[];
  loading?: boolean;
}

// Slightly taller now that the legend lives below the plot rather than
// floating in the top-right corner. ~36px reserved for the legend strip.
const CHART_HEIGHT = 240;

export const XpChart: React.FC<XpChartProps> = ({ data, loading }) => {
  const theme = useTheme();
  const scheme = theme.scheme === 'dark' ? 'dark' : 'light';
  const c = themeColors[scheme];

  const last30 = useMemo(() => (data ?? []).slice(-30), [data]);

  const options: Highcharts.Options = useMemo(() => {
    const categories = last30.map((d) => formatDate({ input: d.date }));

    return {
      chart: {
        type: 'column',
        height: CHART_HEIGHT,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        // Bottom-aligned, non-floating, so a 6-series legend wraps cleanly
        // on narrow widths instead of overlapping the chart's top-right
        // gridlines (the previous floating top-right placement clipped
        // and crowded the y-axis labels).
        enabled: true,
        align: 'left',
        verticalAlign: 'bottom',
        floating: false,
        margin: 12,
        itemDistance: 14,
        itemMarginTop: 2,
        itemMarginBottom: 2,
        itemStyle: { color: c.muted, fontSize: '0.625rem', fontWeight: '500' },
        itemHoverStyle: { color: c.foreground },
        symbolHeight: 8,
        symbolWidth: 8,
        symbolRadius: 2,
      },
      xAxis: {
        categories,
        labels: {
          step: Math.ceil(last30.length / 6),
          style: { color: c.muted, fontSize: '0.5625rem' },
        },
        lineColor: c.surfaceBorder,
        tickLength: 0,
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: c.surfaceBorder,
        labels: { style: { color: c.muted, fontSize: '0.5625rem' } },
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
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: false,
        padding: 0,
        outside: true,
        formatter: function () {
          const points = this.points ?? [];
          const total = points.reduce((s, p) => s + (p.y ?? 0), 0);
          if (total === 0) return false;
          // `this.x` on a shared tooltip over a categorized axis returns
          // the numeric index — `points[0].key` is the category label (date).
          const header = (points[0]?.key as string | undefined) ?? String(this.x ?? '');
          const rows: TooltipRow[] = points
            .filter((p) => (p.y ?? 0) > 0)
            .map((p) => ({
              color: String(p.color ?? c.muted),
              shape: 'square',
              label: p.series.name,
              value: `${p.y} XP`,
            }));
          return buildTooltipHtml({
            colors: c,
            header,
            rows,
            footer: { label: 'Total', value: `${total} XP` },
          });
        },
      },
      series: [
        {
          name: 'Lessons',
          type: 'column',
          data: last30.map((d) => d.sources.lesson_complete),
          color: c.accent,
        },
        {
          name: 'Quizzes',
          type: 'column',
          data: last30.map((d) => d.sources.quiz_score),
          color: c.tertiary,
        },
        {
          name: 'Exercises',
          type: 'column',
          data: last30.map((d) => d.sources.exercise_pass),
          color: c.success,
        },
        {
          name: 'Reviews',
          type: 'column',
          data: last30.map((d) => d.sources.review_complete),
          color: c.warning,
        },
        {
          name: 'Recall',
          type: 'column',
          data: last30.map((d) => d.sources.recall_review),
          color: c.tertiaryHover,
        },
        {
          name: 'Mastery',
          type: 'column',
          data: last30.map((d) => d.sources.recall_mastery),
          color: c.error,
        },
      ],
    };
  }, [last30, c]);

  const showSkeleton = loading && last30.length === 0;

  const startDate = last30[0]?.date;
  const endDate = last30[last30.length - 1]?.date;

  return (
    <Section>
      <SectionHeader>
        {showSkeleton ? (
          <>
            <SectionEyebrow><Skeleton width={80} /></SectionEyebrow>
            <SectionMeta><Skeleton width={120} /></SectionMeta>
          </>
        ) : (
          <>
            <SectionEyebrow>Daily XP</SectionEyebrow>
            {startDate && endDate && (
              <SectionMeta>
                {formatDate({ input: startDate })} — {formatDate({ input: endDate })}
              </SectionMeta>
            )}
          </>
        )}
      </SectionHeader>
      <div style={{ height: CHART_HEIGHT }}>
        {showSkeleton ? (
          <Skeleton height={CHART_HEIGHT} borderRadius={8} />
        ) : last30.length > 0 ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : null}
      </div>
    </Section>
  );
};
