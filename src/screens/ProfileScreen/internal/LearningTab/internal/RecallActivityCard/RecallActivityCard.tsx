'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { useRecallStats } from '@/hooks';
import { formatDate } from '@/lib/formatDate';
import { themeColors } from '@/theme';
import * as S from './RecallActivityCard.styles';
import { buildTooltipHtml, type TooltipRow } from '../_shared/chartTooltip';
import {
  Section,
  SectionHeader,
  SectionEyebrow,
  EmptyBlock,
  EmptyRule,
  EmptyEyebrow,
  EmptyTitle,
  EmptyText,
} from '../_shared/styles';

/**
 * Profile Learning-tab widget surfacing spaced-repetition health.
 *
 * Layout:
 *  - Stats tiles: reviewed this week, mastered, due today
 *  - Hero chart: 14-day Highcharts combo — columns (reviews/day, tinted by
 *    that day's average rating) + spline (avg rating trend, 1..4) with a
 *    plot band marking the "Good+" threshold
 *  - Footer: slim Leitner box distribution strip
 *
 * Empty state kicks in only when the user has zero review history AND zero
 * learned cards — avoids rendering a flat chart that would look broken.
 */

type BoxInfo = { box: number; label: string; color: string };

const BOX_LABELS: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Solid',
  4: 'Mastered',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Again',
  2: 'Hard',
  3: 'Good',
  4: 'Easy',
};

const CHART_HEIGHT = 200;

const formatDelta = ({ current, previous }: { current: number; previous: number }): { text: string; positive: boolean; neutral: boolean } => {
  if (previous === 0 && current === 0) return { text: '—', positive: false, neutral: true };
  if (previous === 0) return { text: `+${current}`, positive: true, neutral: false };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return { text: 'no change', positive: false, neutral: true };
  return { text: `${pct > 0 ? '+' : ''}${pct}% vs last week`, positive: pct > 0, neutral: false };
};

const fmtRatingLabel = (rating: number): string => {
  // 1..4 scale. Bucket matches the column-color thresholds so the label and
  // the tinted bar always agree (e.g. 2.5 reads "Hard", not "Good").
  if (rating <= 0) return '—';
  const bucket = rating < 2 ? 1 : rating < 3 ? 2 : rating < 3.5 ? 3 : 4;
  return `${RATING_LABELS[bucket]} (${rating.toFixed(1)})`;
};

export const RecallActivityCard: React.FC = () => {
  const theme = useTheme();
  const scheme = theme.scheme === 'dark' ? 'dark' : 'light';
  const c = themeColors[scheme];
  const { data, isLoading } = useRecallStats();

  // Leitner tier palette — cohesive earth-tone ramp, monotonically darker and
  // more saturated from New → Mastered. Hand-picked rather than pulled from
  // theme tokens because no existing token set gives a clean 5-stop sequence
  // without clashing hues (amber/bright-green against the brand's muted greens).
  const tiers: BoxInfo[] = useMemo(
    () => [
      { box: 0, label: BOX_LABELS[0], color: '#d6cfc3' }, // warm bone
      { box: 1, label: BOX_LABELS[1], color: '#c4a265' }, // muted gold
      { box: 2, label: BOX_LABELS[2], color: '#8a9562' }, // olive-sage
      { box: 3, label: BOX_LABELS[3], color: '#4a8a72' }, // sage green
      { box: 4, label: BOX_LABELS[4], color: '#2c5545' }, // deep forest
    ],
    [],
  );

  const options: Highcharts.Options = useMemo(() => {
    // Map a day's avg rating (0..4, 0 = no reviews) to a column color.
    // No-review days render as a faint muted tick so the x-axis stays legible.
    const colorForRating = (rating: number): string => {
      if (rating <= 0) return `${c.muted}33`;
      if (rating < 2) return c.error;
      if (rating < 3) return c.warning;
      if (rating < 3.5) return c.accent;
      return c.success;
    };

    const history = data?.recentHistory ?? [];
    const categories = history.map((h) => formatDate({ input: h.date }));
    const reviewPoints = history.map((h) => ({
      y: h.reviews,
      color: colorForRating(h.avgRating),
    }));
    const ratingPoints = history.map((h) => (h.reviews > 0 ? Number(h.avgRating.toFixed(2)) : null));
    const maxReviews = Math.max(1, ...history.map((h) => h.reviews));

    return {
      chart: {
        height: CHART_HEIGHT,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
        spacing: [8, 4, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories,
        labels: {
          step: Math.max(1, Math.ceil(categories.length / 7)),
          style: { color: c.muted, fontSize: '0.5625rem' },
        },
        lineColor: c.surfaceBorder,
        tickLength: 0,
        crosshair: { color: `${c.muted}22`, width: 1 },
      },
      yAxis: [
        {
          // Reviews (columns)
          title: { text: undefined },
          min: 0,
          allowDecimals: false,
          gridLineColor: c.surfaceBorder,
          labels: { style: { color: c.muted, fontSize: '0.5625rem' } },
        },
        {
          // Avg rating (spline)
          title: { text: undefined },
          min: 1,
          max: 4,
          tickPositions: [1, 2, 3, 4],
          gridLineWidth: 0,
          opposite: true,
          labels: {
            style: { color: c.muted, fontSize: '0.5625rem' },
            formatter: function () {
              const v = Number(this.value);
              return RATING_LABELS[v] ?? '';
            },
          },
          plotBands: [
            {
              from: 3,
              to: 4,
              color: `${c.success}12`,
              zIndex: 0,
            },
          ],
          plotLines: [
            {
              value: 3,
              color: `${c.success}66`,
              dashStyle: 'Dash',
              width: 1,
            },
          ],
        },
      ],
      plotOptions: {
        column: {
          borderWidth: 0,
          borderRadius: 3,
          pointPadding: 0.06,
          groupPadding: 0.08,
        },
        spline: {
          lineWidth: 2,
          marker: { radius: 3, lineWidth: 0 },
          states: { hover: { lineWidth: 2 } },
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
          const reviewsPt = points.find((p) => p.series.name === 'Reviews');
          const ratingPt = points.find((p) => p.series.name === 'Avg rating');
          const reviews = reviewsPt?.y ?? 0;
          const avg = typeof ratingPt?.y === 'number' ? ratingPt.y : 0;
          const header = (points[0]?.key as string | undefined) ?? String(this.x ?? '');
          const rows: TooltipRow[] =
            reviews > 0
              ? [
                  { color: colorForRating(avg), shape: 'square', label: 'Reviews', value: String(reviews) },
                  { color: c.foreground, shape: 'dot', label: 'Avg rating', value: fmtRatingLabel(avg) },
                ]
              : [];
          return buildTooltipHtml({
            colors: c,
            header,
            rows,
            emptyLine: reviews > 0 ? undefined : 'No reviews this day',
          });
        },
      },
      series: [
        {
          name: 'Reviews',
          type: 'column',
          yAxis: 0,
          data: reviewPoints,
          maxPointWidth: 24,
        },
        {
          name: 'Avg rating',
          type: 'spline',
          yAxis: 1,
          data: ratingPoints,
          color: c.foreground,
          connectNulls: false,
          zIndex: 3,
        },
      ],
      // Reserve headroom above the tallest column so the rating line doesn't
      // collide with column caps.
      responsive: {
        rules: [
          {
            condition: { maxWidth: 9999 },
            chartOptions: { yAxis: [{ max: maxReviews === 1 ? 2 : undefined }, {}] },
          },
        ],
      },
    };
  }, [data, c]);

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionEyebrow><Skeleton width={100} height={12} borderRadius={4} /></SectionEyebrow>
        </SectionHeader>
        <S.StatsRow>
          {[0, 1, 2].map((i) => (
            <S.StatTile key={i}>
              <S.StatValue><Skeleton width={40} height={28} /></S.StatValue>
              <S.StatLabel><Skeleton width={64} height={10} /></S.StatLabel>
            </S.StatTile>
          ))}
        </S.StatsRow>
        <Skeleton height={CHART_HEIGHT} borderRadius={8} />
      </Section>
    );
  }

  const reviewedThisWeek = data?.reviewedThisWeek ?? 0;
  const reviewedLastWeek = data?.reviewedLastWeek ?? 0;
  const totalMastered = data?.totalMastered ?? 0;
  const totalReviewed = data?.totalReviewed ?? 0;
  const dueToday = data?.dueToday ?? 0;

  const boxMap = new Map<number, number>();
  for (const entry of data?.boxDistribution ?? []) {
    boxMap.set(entry.box, entry.count);
  }
  const totalInBoxes = tiers.reduce((s, t) => s + (boxMap.get(t.box) ?? 0), 0);

  const isEmpty = totalReviewed === 0 && totalInBoxes === 0;

  if (isEmpty) {
    return (
      <Section>
        <SectionHeader>
          <SectionEyebrow>Recall</SectionEyebrow>
        </SectionHeader>
        <EmptyBlock>
          <EmptyRule aria-hidden />
          <EmptyEyebrow>Nothing to chart yet</EmptyEyebrow>
          <EmptyTitle>Start with a few cards a day.</EmptyTitle>
          <EmptyText>
            Review recall cards pulled from your lessons and your progress will start showing
            here — review volume, rating quality, and how cards mature over time.
          </EmptyText>
        </EmptyBlock>
      </Section>
    );
  }

  const delta = formatDelta({ current: reviewedThisWeek, previous: reviewedLastWeek });
  const hasHistory = (data?.recentHistory?.length ?? 0) > 0;

  return (
    <Section>
      <SectionHeader>
        <SectionEyebrow>Recall</SectionEyebrow>
        {!delta.neutral && (
          <S.TrendLabel $positive={delta.positive} $neutral={delta.neutral}>
            {delta.text}
          </S.TrendLabel>
        )}
      </SectionHeader>

      <S.StatsRow>
        <S.StatTile>
          <S.StatValue>{reviewedThisWeek}</S.StatValue>
          <S.StatLabel>Reviewed this week</S.StatLabel>
        </S.StatTile>
        <S.StatTile>
          <S.StatValue>{totalMastered}</S.StatValue>
          <S.StatLabel>Mastered</S.StatLabel>
        </S.StatTile>
        <S.StatTile $urgent={dueToday > 0}>
          <S.StatValue>{dueToday}</S.StatValue>
          <S.StatLabel>Due today</S.StatLabel>
        </S.StatTile>
      </S.StatsRow>

      {hasHistory && (
        <S.ChartWrap>
          <S.ChartLabel>Last 14 days — review volume &amp; recall quality</S.ChartLabel>
          <HighchartsReact highcharts={Highcharts} options={options} />
          <S.ChartLegend>
            <S.ChartLegendItem>
              <S.ChartLegendSwatch $shape="gradient" aria-hidden />
              Reviews · tinted by rating
            </S.ChartLegendItem>
            <S.ChartLegendItem>
              <S.ChartLegendSwatch $shape="line" aria-hidden />
              Avg rating
            </S.ChartLegendItem>
          </S.ChartLegend>
        </S.ChartWrap>
      )}

      {totalInBoxes > 0 && (
        <S.BarSection>
          <S.BarLabel>Memory distribution</S.BarLabel>
          <S.Bar role="img" aria-label="Recall box distribution">
            {tiers.map((t) => {
              const count = boxMap.get(t.box) ?? 0;
              const pct = totalInBoxes === 0 ? 0 : (count / totalInBoxes) * 100;
              if (count === 0) return null;
              return <S.BarSegment key={t.box} $pct={pct} $color={t.color} title={`${t.label}: ${count}`} />;
            })}
          </S.Bar>
          <S.Legend>
            {tiers.map((t) => {
              const count = boxMap.get(t.box) ?? 0;
              if (count === 0) return null;
              return (
                <S.LegendItem key={t.box}>
                  <S.Swatch $color={t.color} />
                  {t.label} <strong>{count}</strong>
                </S.LegendItem>
              );
            })}
          </S.Legend>
        </S.BarSection>
      )}
    </Section>
  );
};
