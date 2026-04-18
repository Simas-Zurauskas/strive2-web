import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { formatDate } from '@/lib/formatDate';
import { themeColors } from '@/theme';
import * as S from './XpChart.styles';
import type { XpDayEntry } from '@/api/routes/gamification';

interface XpChartProps {
  data?: XpDayEntry[];
  loading?: boolean;
}

const CHART_HEIGHT = 200;

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
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        floating: true,
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
          // `this.x` on a shared tooltip over a categorized axis returns the
          // numeric index — `points[0].key` is the category label (date).
          const label = (points[0]?.key as string | undefined) ?? String(this.x ?? '');
          const header = `<div style="font-weight:600;font-size:0.8125rem;margin-bottom:8px">${label}</div>`;
          const rows = points
            .filter((p) => (p.y ?? 0) > 0)
            .map(
              (p) =>
                `<div style="display:flex;align-items:center;gap:8px;padding:2px 0">` +
                `<span style="width:8px;height:8px;border-radius:50%;background:${p.color};flex-shrink:0"></span>` +
                `<span style="color:${c.muted};flex:1">${p.series.name}</span>` +
                `<span style="font-weight:600;font-variant-numeric:tabular-nums">${p.y} XP</span>` +
                `</div>`,
            )
            .join('');
          const footer =
            `<div style="border-top:1px solid ${c.surfaceBorder};margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:600">` +
            `<span>Total</span><span>${total} XP</span></div>`;
          return `<div style="background:${c.surface};border:1px solid ${c.surfaceBorder};border-radius:12px;padding:12px 14px;min-width:160px;` +
            `box-shadow:0 4px 24px rgba(0,0,0,${scheme === 'dark' ? '0.5' : '0.15'}),0 1px 4px rgba(0,0,0,${scheme === 'dark' ? '0.3' : '0.08'});` +
            `color:${c.foreground};font-size:0.75rem;line-height:1.5">` +
            header + rows + footer + '</div>';
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
          name: 'Insights',
          type: 'column',
          data: last30.map((d) => d.sources.insight_review),
          color: c.tertiaryHover,
        },
        {
          name: 'Mastery',
          type: 'column',
          data: last30.map((d) => d.sources.insight_mastery),
          color: c.error,
        },
      ],
    };
  }, [last30, c, scheme]);

  const showSkeleton = loading && last30.length === 0;

  const startDate = last30[0]?.date;
  const endDate = last30[last30.length - 1]?.date;

  return (
    <S.Section>
      <S.Header>
        {showSkeleton ? (
          <>
            <S.Title><Skeleton width={140} /></S.Title>
            <S.RangeLabel><Skeleton width={100} /></S.RangeLabel>
          </>
        ) : (
          <>
            <S.Title>XP — Last 30 Days</S.Title>
            {startDate && endDate && (
              <S.RangeLabel>{formatDate({ input: startDate })} — {formatDate({ input: endDate })}</S.RangeLabel>
            )}
          </>
        )}
      </S.Header>
      <div style={{ height: CHART_HEIGHT }}>
        {showSkeleton ? (
          <Skeleton height={CHART_HEIGHT} borderRadius={8} />
        ) : last30.length > 0 ? (
          <HighchartsReact highcharts={Highcharts} options={options} />
        ) : null}
      </div>
    </S.Section>
  );
};
