'use client';

import { useMemo } from 'react';
import { useAuth, useProgressSummary } from '@/hooks';
import { useGamificationProfile } from '@/hooks/useGamification';
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

// Build a 5-row x 7-col grid aligned to weekdays (Mon=col0 ... Sun=col6).
// null = future or before registration. Active days show as filled.
// Returns cells + the start day-of-week offset for proper label alignment.
function buildStreakCalendar(
  activeDates: string[] | undefined,
  xpLog: { date: string; xp: number }[] | undefined,
  registeredAt: string | undefined,
): (0 | 1 | 2 | null)[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  // Day of week: 0=Mon ... 6=Sun
  const todayDow = (today.getDay() + 6) % 7;

  // Start from Monday of 4 weeks ago (gives us 5 rows including current partial week)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - todayDow - 28);

  // Registration date as YYYY-MM-DD string for safe comparison
  const regDateStr = registeredAt ? registeredAt.slice(0, 10) : null;

  // Build set of active dates + aggregate XP for intensity
  const activeSet = new Set(activeDates ?? []);
  const xpByDay = new Map<string, number>();
  if (xpLog) {
    for (const entry of xpLog) {
      xpByDay.set(entry.date, (xpByDay.get(entry.date) ?? 0) + entry.xp);
    }
  }

  const cells: (0 | 1 | 2 | null)[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    // Future days or before registration → null
    if (dateStr > todayStr) {
      cells.push(null);
      continue;
    }
    if (regDateStr && dateStr < regDateStr) {
      cells.push(null);
      continue;
    }

    const isActive = activeSet.has(dateStr);
    const xp = xpByDay.get(dateStr) ?? 0;

    if (!isActive && xp === 0) cells.push(0);
    else if (xp >= 100) cells.push(2);
    else cells.push(1);
  }

  return cells;
}

function getNextMilestone(profile: { currentStreak: number; level: number; totalXp: number }): string | null {
  const streakTargets = [3, 7, 30];
  for (const target of streakTargets) {
    if (profile.currentStreak < target) {
      const remaining = target - profile.currentStreak;
      return `${remaining} day${remaining !== 1 ? 's' : ''} to ${target}-day streak`;
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
  const { data: progressSummary } = useProgressSummary();

  const stats = useMemo(() => {
    if (!progressSummary) return null;

    let completedLessons = 0;
    let completedCourses = 0;

    for (const item of progressSummary) {
      completedLessons += item.completed;
      if (item.total > 0 && item.completed >= item.total) completedCourses++;
    }

    return { completedLessons, completedCourses };
  }, [progressSummary]);

  const calendarDays = useMemo(() => {
    const days = buildStreakCalendar(profile?.activeDates, profile?.xpLog, user?.createdAt);
    // Trim full leading rows that are entirely null (before registration)
    // This preserves weekday alignment since we always remove complete 7-day rows
    while (days.length > 7 && days.slice(0, 7).every((d) => d === null)) {
      days.splice(0, 7);
    }
    return days;
  }, [profile?.activeDates, profile?.xpLog, user?.createdAt]);

  const milestone = useMemo(() => {
    if (!profile) return null;
    return getNextMilestone(profile);
  }, [profile]);

  if (!profile) return null;

  // XP progress within current level
  const currentThreshold = getLevelThreshold(profile.level);
  const xpInCurrentLevel = profile.totalXp - currentThreshold;
  const xpNeeded = xpNeededForLevel(profile.level);
  const xpPercent = xpNeeded > 0 ? Math.round((xpInCurrentLevel / xpNeeded) * 100) : 0;

  return (
    <S.Container>
      {/* Level + XP */}
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

      {/* Merged stats */}
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
          <S.StatValue>{stats?.completedCourses ?? 0}</S.StatValue>
          <S.StatLabel>Courses</S.StatLabel>
        </S.Stat>
      </S.StatsRow>

      <S.Divider />

      {/* Streak calendar */}
      <div>
        <S.CalendarLabel>Activity</S.CalendarLabel>
        <S.CalendarGrid>
          {calendarDays.map((level, i) => (
            level === null
              ? <S.CalendarDayEmpty key={i} />
              : <S.CalendarDay key={i} $level={level} />
          ))}
        </S.CalendarGrid>
        <S.CalendarDays>
          <S.CalendarDayLabel>M</S.CalendarDayLabel>
          <S.CalendarDayLabel>T</S.CalendarDayLabel>
          <S.CalendarDayLabel>W</S.CalendarDayLabel>
          <S.CalendarDayLabel>T</S.CalendarDayLabel>
          <S.CalendarDayLabel>F</S.CalendarDayLabel>
          <S.CalendarDayLabel>S</S.CalendarDayLabel>
          <S.CalendarDayLabel>S</S.CalendarDayLabel>
        </S.CalendarDays>
      </div>

      {/* Next milestone */}
      {milestone && (
        <S.Milestone>
          <S.MilestoneHighlight>{milestone}</S.MilestoneHighlight>
        </S.Milestone>
      )}
    </S.Container>
  );
};
