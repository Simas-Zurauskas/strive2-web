'use client';

import { useMemo } from 'react';
import { useAuth, useCourses, useProgressSummary } from '@/hooks';
import { useGamificationProfile } from '@/hooks/useGamification';
import { formatDate } from '@/lib/formatDate';
import { plural } from '@/lib/strings';
import * as S from './GamificationCard.styles';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 4850, 5750, 6700, 7700, 8700, 9700, 10700, 11700, 12700,
  13700, 14700, 15700, 16700, 17700,
];

function getLevelThreshold(level: number): number {
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1] ?? 0;
  return 17700 + (level - LEVEL_THRESHOLDS.length) * 1000;
}

function xpNeededForLevel(level: number): number {
  return getLevelThreshold(level + 1) - getLevelThreshold(level);
}

interface CalendarCell {
  level: 0 | 1 | 2;
  date: string; // YYYY-MM-DD
  xp: number;
  weekend: boolean;
  bridged: boolean;
}

/** See ActivityHeatmap.tsx for rationale — bridge single-weekday gaps visually. */
function computeBridgedWeekdays(activeSet: Set<string>): Set<string> {
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
}

function buildStreakCalendar(
  activeDates: string[] | undefined,
  xpLog: { date: string; xp: number }[] | undefined,
  registeredAt: string | undefined,
): (CalendarCell | null)[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayDow = (today.getDay() + 6) % 7; // 0=Mon ... 6=Sun

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - todayDow - 28);

  const regDateStr = registeredAt ? registeredAt.slice(0, 10) : null;

  const activeSet = new Set(activeDates ?? []);
  const bridgedSet = computeBridgedWeekdays(activeSet);
  const xpByDay = new Map<string, number>();
  if (xpLog) {
    for (const entry of xpLog) {
      xpByDay.set(entry.date, (xpByDay.get(entry.date) ?? 0) + entry.xp);
    }
  }

  const cells: (CalendarCell | null)[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dow = i % 7; // 0=Mon ... 6=Sun
    const weekend = dow >= 5;

    if (dateStr > todayStr || (regDateStr && dateStr < regDateStr)) {
      cells.push(null);
      continue;
    }

    const isActive = activeSet.has(dateStr);
    const xp = xpByDay.get(dateStr) ?? 0;
    const bridged = !isActive && xp === 0 && bridgedSet.has(dateStr);
    let level: 0 | 1 | 2 = 0;
    if (isActive || xp > 0) level = xp >= 100 ? 2 : 1;
    else if (bridged) level = 1;

    cells.push({ level, date: dateStr, xp, weekend, bridged });
  }

  return cells;
}

function getNextMilestone(profile: { currentStreak: number; level: number; totalXp: number }): string | null {
  const streakTargets = [3, 7, 30];
  for (const target of streakTargets) {
    if (profile.currentStreak < target) {
      const remaining = target - profile.currentStreak;
      return `${remaining} ${plural(remaining, 'day')} to ${target}-day streak`;
    }
  }

  const currentThreshold = getLevelThreshold(profile.level);
  const xpInLevel = profile.totalXp - currentThreshold;
  const xpNeeded = xpNeededForLevel(profile.level);
  const remaining = xpNeeded - xpInLevel;
  if (remaining > 0) {
    return `${remaining} XP to level ${profile.level + 1}`;
  }

  return null;
}

export const GamificationCard = () => {
  const { user } = useAuth();
  const { data: profile } = useGamificationProfile();
  const { data: courses } = useCourses();
  const { data: progressSummary } = useProgressSummary();

  const stats = useMemo(() => {
    if (!progressSummary) return null;

    let completedLessons = 0;

    for (const item of progressSummary) {
      completedLessons += item.completed;
    }

    const totalCourses = courses?.filter((c) => c.status === 'ready').length ?? 0;

    return { completedLessons, totalCourses };
  }, [progressSummary, courses]);

  const calendarCells = useMemo(() => {
    const cells = buildStreakCalendar(profile?.activeDates, profile?.xpLog, user?.createdAt);
    while (cells.length > 7 && cells.slice(0, 7).every((d) => d === null)) {
      cells.splice(0, 7);
    }
    return cells;
  }, [profile?.activeDates, profile?.xpLog, user?.createdAt]);

  const milestone = useMemo(() => {
    if (!profile) return null;
    return getNextMilestone(profile);
  }, [profile]);

  if (!profile) return null;

  const currentThreshold = getLevelThreshold(profile.level);
  const xpInCurrentLevel = profile.totalXp - currentThreshold;
  const xpNeeded = xpNeededForLevel(profile.level);
  const xpPercent = xpNeeded > 0 ? Math.round((xpInCurrentLevel / xpNeeded) * 100) : 0;

  return (
    <S.Container>
      <S.Header>
        <S.LevelBadge>
          <S.LevelIcon>&#11088;</S.LevelIcon>
          <S.LevelText>Level {profile.level}</S.LevelText>
        </S.LevelBadge>
        <S.XpText>{profile.totalXp.toLocaleString()} XP</S.XpText>
      </S.Header>

      <div>
        <S.XpBarTrack>
          <S.XpBarFill $percent={xpPercent} />
        </S.XpBarTrack>
      </div>

      <S.StatsRow>
        <S.Stat>
          <S.StatValue>{profile.currentStreak}</S.StatValue>
          <S.StatLabel>Streak</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{stats?.completedLessons ?? 0}</S.StatValue>
          <S.StatLabel>Lessons</S.StatLabel>
        </S.Stat>
        <S.Stat>
          <S.StatValue>{stats?.totalCourses ?? 0}</S.StatValue>
          <S.StatLabel>Courses</S.StatLabel>
        </S.Stat>
      </S.StatsRow>

      <S.Divider />

      <div>
        <S.CalendarLabel>Activity</S.CalendarLabel>
        <S.CalendarGrid>
          {calendarCells.map((cell, i) =>
            cell === null ? (
              <S.CalendarDayEmpty key={i} />
            ) : (
              <S.CalendarDay
                key={i}
                $level={cell.level}
                $weekend={cell.weekend}
                title={
                  cell.xp > 0
                    ? `${formatDate(cell.date, 'cell')} — ${cell.xp} XP`
                    : cell.bridged
                      ? `${formatDate(cell.date, 'cell')} — No activity (between active days)`
                      : `${formatDate(cell.date, 'cell')} — No activity`
                }
              />
            ),
          )}
        </S.CalendarGrid>
        <S.CalendarDays>
          <S.CalendarDayLabel>M</S.CalendarDayLabel>
          <S.CalendarDayLabel>T</S.CalendarDayLabel>
          <S.CalendarDayLabel>W</S.CalendarDayLabel>
          <S.CalendarDayLabel>T</S.CalendarDayLabel>
          <S.CalendarDayLabel>F</S.CalendarDayLabel>
          <S.CalendarDayLabel $weekend>S</S.CalendarDayLabel>
          <S.CalendarDayLabel $weekend>S</S.CalendarDayLabel>
        </S.CalendarDays>
      </div>

      {milestone && (
        <S.Milestone>
          <S.MilestoneHighlight>{milestone}</S.MilestoneHighlight>
        </S.Milestone>
      )}
    </S.Container>
  );
};
