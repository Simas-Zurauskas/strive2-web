import { useMemo } from 'react';
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar';
import { useTheme } from 'styled-components';
import * as S from './ActivityHeatmap.styles';

interface XpDayEntry {
  date: string;
  xp: number;
}

interface ActivityHeatmapProps {
  data: XpDayEntry[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const theme = useTheme();

  const { activities, activeDays } = useMemo(() => {
    const xpMap = new Map<string, number>();
    for (const d of data) {
      xpMap.set(d.date, (xpMap.get(d.date) ?? 0) + d.xp);
    }

    let activeDayCount = 0;
    const activities: Activity[] = data.map((d) => {
      const xp = xpMap.get(d.date) ?? 0;
      let level: 0 | 1 | 2 | 3 | 4;
      if (xp === 0) level = 0;
      else if (xp < 50) level = 1;
      else if (xp < 100) level = 2;
      else if (xp < 200) level = 3;
      else level = 4;
      if (xp > 0) activeDayCount++;
      return { date: d.date, count: xp, level };
    });

    return { activities, activeDays: activeDayCount };
  }, [data]);

  const calendarTheme: ThemeInput = useMemo(
    () => ({
      dark: [theme.colors.border, '#2d6b4f40', '#2d6b4f80', '#2d6b4fbf', theme.colors.accent],
      light: [theme.colors.border, '#2c554520', '#2c554550', '#2c554590', theme.colors.accent],
    }),
    [theme],
  );

  if (activities.length === 0) return null;

  return (
    <S.Section>
      <S.Header>
        <S.Title>Activity — Last 3 Months</S.Title>
        <S.Stat>
          {activeDays} active day{activeDays !== 1 ? 's' : ''}
        </S.Stat>
      </S.Header>
      <S.CalendarWrap>
        <ActivityCalendar
          data={activities}
          theme={calendarTheme}
          blockSize={12}
          blockMargin={3}
          blockRadius={3}
          fontSize={10}
          showTotalCount={false}
          showWeekdayLabels={['mon', 'wed', 'fri']}
          labels={{
            legend: { less: 'Less', more: 'More' },
          }}
        />
      </S.CalendarWrap>
    </S.Section>
  );
};
