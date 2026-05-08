import { useMemo } from 'react';
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { plural } from '@/lib/strings';
import { activityHeatmapPalette } from '@/theme';
import * as S from './ActivityHeatmap.styles';
import { Section, SectionHeader, SectionEyebrow, SectionMeta } from '../_shared/styles';
import type { XpDayEntry } from '@/api/types';

interface ActivityHeatmapProps {
  data?: XpDayEntry[];
  activeDates?: string[];
  loading?: boolean;
}

/** Generate a full year of empty activity data for skeleton sizing. */
const buildPlaceholderData = (): Activity[] => {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);
  const result: Activity[] = [];
  const cursor = new Date(start);
  while (cursor <= now) {
    result.push({ date: cursor.toISOString().slice(0, 10), count: 0, level: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};

const PLACEHOLDER_DATA = buildPlaceholderData();

/**
 * Find isolated-weekday gaps between active days and mark them as "bridged".
 * A date is bridged if it falls between two active days separated by exactly
 * one missed weekday (weekends never count as missed). Used purely for visuals.
 */
const computeBridgedWeekdays = (activeSet: Set<string>): Set<string> => {
  const bridged = new Set<string>();
  const sorted = [...activeSet].sort();
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00Z');
    const curr = new Date(sorted[i] + 'T00:00:00Z');
    const between: string[] = [];
    const d = new Date(prev);
    d.setUTCDate(d.getUTCDate() + 1);
    while (d < curr) {
      const dow = d.getUTCDay();
      if (dow !== 0 && dow !== 6) between.push(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() + 1);
    }
    if (between.length === 1) bridged.add(between[0]);
  }
  return bridged;
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data, activeDates, loading }) => {
  const theme = useTheme();
  const scheme = theme.scheme === 'dark' ? 'dark' : 'light';

  const { activities, activeDays } = useMemo(() => {
    if (!data) return { activities: [], activeDays: 0 };

    const xpMap = new Map<string, number>();
    for (const d of data) {
      xpMap.set(d.date, (xpMap.get(d.date) ?? 0) + d.xp);
    }

    const activeSet = new Set(activeDates ?? []);
    const bridgedSet = computeBridgedWeekdays(activeSet);

    const now = new Date();
    const start = new Date(now);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);

    let activeDayCount = 0;
    const activities: Activity[] = [];
    const cursor = new Date(start);

    while (cursor <= now) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const xp = xpMap.get(dateStr) ?? 0;
      const isActive = activeSet.has(dateStr);
      const isBridged = !isActive && xp === 0 && bridgedSet.has(dateStr);
      let level: 0 | 1 | 2 | 3 | 4;
      if (xp === 0 && !isActive && !isBridged) level = 0;
      else if (isBridged) level = 1;
      else if (xp < 100) level = 1;
      else if (xp < 250) level = 2;
      else if (xp < 500) level = 3;
      else level = 4;
      if (xp > 0 || isActive) activeDayCount++;
      activities.push({ date: dateStr, count: xp, level });
      cursor.setDate(cursor.getDate() + 1);
    }

    return { activities, activeDays: activeDayCount };
  }, [data, activeDates]);

  const calendarTheme: ThemeInput = useMemo(
    () => ({
      dark: [...activityHeatmapPalette.dark],
      light: [...activityHeatmapPalette.light],
    }),
    [],
  );

  const isLoading = loading && activities.length === 0;
  const calendarData = isLoading ? PLACEHOLDER_DATA : activities;

  return (
    <Section>
      <SectionHeader>
        <SectionEyebrow>{isLoading ? <Skeleton width={80} /> : 'Daily activity'}</SectionEyebrow>
        <SectionMeta>
          {isLoading
            ? <Skeleton width={80} />
            : `${activeDays} active ${plural({ count: activeDays, singular: 'day' })} this year`}
        </SectionMeta>
      </SectionHeader>
      <S.CalendarWrap $loading={isLoading}>
        <ActivityCalendar
          data={calendarData}
          theme={calendarTheme}
          colorScheme={scheme}
          blockSize={12}
          blockMargin={3}
          blockRadius={3}
          fontSize={10}
          showTotalCount={false}
          showWeekdayLabels={false}
          labels={{ legend: { less: 'Less', more: 'More' } }}
        />
        {isLoading && (
          <S.SkeletonOverlay>
            <Skeleton width="100%" height="100%" borderRadius={8} />
          </S.SkeletonOverlay>
        )}
      </S.CalendarWrap>
    </Section>
  );
};
