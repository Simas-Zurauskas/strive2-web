import { useMemo } from 'react';
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar';
import Skeleton from 'react-loading-skeleton';
import { useTheme } from 'styled-components';
import { themeColors } from '@/theme';
import * as S from './ActivityHeatmap.styles';

interface XpDayEntry {
  date: string;
  xp: number;
}

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

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data, activeDates, loading }) => {
  const theme = useTheme();
  const scheme = theme.scheme === 'dark' ? 'dark' : 'light';
  const c = themeColors[scheme];

  const { activities, activeDays } = useMemo(() => {
    if (!data) return { activities: [], activeDays: 0 };

    const xpMap = new Map<string, number>();
    for (const d of data) {
      xpMap.set(d.date, (xpMap.get(d.date) ?? 0) + d.xp);
    }

    const activeSet = new Set(activeDates ?? []);

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
      let level: 0 | 1 | 2 | 3 | 4;
      if (xp === 0 && !isActive) level = 0;
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
      dark: ['#373331', '#3b4d43', '#3e7057', '#4e9e74', '#6cd49a'],
      light: ['#00000008', '#2c554535', '#2c554568', '#2c5545a8', c.accent],
    }),
    [c],
  );

  const isLoading = loading && activities.length === 0;
  const calendarData = isLoading ? PLACEHOLDER_DATA : activities;

  return (
    <S.Section>
      <S.Header>
        <S.Title>{isLoading ? <Skeleton width={80} /> : 'Activity'}</S.Title>
        <S.Stat>
          {isLoading ? <Skeleton width={80} /> : `${activeDays} active day${activeDays !== 1 ? 's' : ''}`}
        </S.Stat>
      </S.Header>
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
    </S.Section>
  );
};
