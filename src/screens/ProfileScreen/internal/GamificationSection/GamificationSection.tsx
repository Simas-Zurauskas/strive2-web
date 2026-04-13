'use client';

import { useMemo } from 'react';
import { useGamificationProfile, useGamificationStats } from '@/hooks/useGamification';
import * as S from './GamificationSection.styles';

// Achievement icon mapping
const ICON_MAP: Record<string, string> = {
  'book-open': '\ud83d\udcd6',
  books: '\ud83d\udcda',
  'graduation-cap': '\ud83c\udf93',
  trophy: '\ud83c\udfc6',
  star: '\u2b50',
  flame: '\ud83d\udd25',
  target: '\ud83c\udfaf',
  crown: '\ud83d\udc51',
  'refresh-cw': '\ud83d\udd04',
  clock: '\u23f1\ufe0f',
  zap: '\u26a1',
  globe: '\ud83c\udf0d',
};

// All achievement definitions (must match API constants)
const ACHIEVEMENTS = [
  {
    id: 'lesson_first',
    category: 'milestone',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'book-open',
  },
  {
    id: 'lessons_ten',
    category: 'milestone',
    name: 'Getting Serious',
    description: 'Complete 10 lessons',
    icon: 'books',
  },
  {
    id: 'lessons_fifty',
    category: 'milestone',
    name: 'Century Scholar',
    description: 'Complete 50 lessons',
    icon: 'graduation-cap',
  },
  {
    id: 'course_first',
    category: 'milestone',
    name: 'Course Complete',
    description: 'Complete an entire course',
    icon: 'trophy',
  },
  {
    id: 'courses_three',
    category: 'milestone',
    name: 'Lifelong Learner',
    description: 'Complete 3 courses',
    icon: 'star',
  },
  { id: 'courses_five', category: 'milestone', name: 'Polymath', description: 'Complete 5 courses', icon: 'globe' },
  { id: 'streak_3', category: 'streak', name: 'Spark', description: '3-day learning streak', icon: 'flame' },
  { id: 'streak_7', category: 'streak', name: 'One Week Strong', description: '7-day learning streak', icon: 'flame' },
  {
    id: 'streak_14',
    category: 'streak',
    name: 'Monthly Dedication',
    description: '14-day learning streak',
    icon: 'flame',
  },
  {
    id: 'quiz_perfect',
    category: 'mastery',
    name: 'Perfect Score',
    description: 'Score 100% on a module quiz',
    icon: 'target',
  },
  {
    id: 'course_mastered',
    category: 'mastery',
    name: 'Total Mastery',
    description: 'Master all modules in a course',
    icon: 'crown',
  },
  {
    id: 'review_first',
    category: 'mastery',
    name: 'Spaced Learner',
    description: 'Complete your first spaced review',
    icon: 'refresh-cw',
  },
  {
    id: 'hours_one',
    category: 'dedication',
    name: 'Hour of Learning',
    description: 'Spend 1 hour learning',
    icon: 'clock',
  },
  {
    id: 'hours_ten',
    category: 'dedication',
    name: 'Dedicated Learner',
    description: 'Spend 10 hours learning',
    icon: 'clock',
  },
  {
    id: 'hours_twentyfive',
    category: 'dedication',
    name: 'Centurion',
    description: 'Spend 25 hours learning',
    icon: 'clock',
  },
  { id: 'level_5', category: 'dedication', name: 'Level 5', description: 'Reach level 5', icon: 'zap' },
  { id: 'level_15', category: 'dedication', name: 'Level 15', description: 'Reach level 15', icon: 'zap' },
  { id: 'level_25', category: 'dedication', name: 'Grandmaster', description: 'Reach level 25', icon: 'zap' },
] as const;

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const GamificationSection = () => {
  const { data: profile } = useGamificationProfile();
  const { data: stats } = useGamificationStats();

  const earnedIds = useMemo(
    () => new Set(profile?.earnedAchievements?.map((a) => a.achievementId) ?? []),
    [profile?.earnedAchievements],
  );

  const maxDayXp = useMemo(() => {
    if (!stats?.xpByDay?.length) return 0;
    return Math.max(...stats.xpByDay.map((d) => d.xp));
  }, [stats]);

  if (!profile) return null;

  return (
    <>
      {/* ── Achievements ─────────────────────────────── */}
      <S.Section>
        <S.SectionTitle>
          Achievements ({earnedIds.size}/{ACHIEVEMENTS.length})
        </S.SectionTitle>

        <S.AchievementsGrid>
          {ACHIEVEMENTS.map((a) => (
            <S.AchievementCard key={a.id} $earned={earnedIds.has(a.id)}>
              <S.AchievementIcon>{ICON_MAP[a.icon] ?? a.icon}</S.AchievementIcon>
              <S.AchievementInfo>
                <S.AchievementName>{a.name}</S.AchievementName>
                <S.AchievementDesc>{a.description}</S.AchievementDesc>
              </S.AchievementInfo>
            </S.AchievementCard>
          ))}
        </S.AchievementsGrid>
      </S.Section>

      {/* ── Learning Stats ───────────────────────────── */}
      {stats && (
        <S.Section>
          <S.SectionTitle>Learning Stats</S.SectionTitle>

          <S.StatsRow>
            <S.StatMini>
              <S.StatMiniValue>{profile.totalXp.toLocaleString()}</S.StatMiniValue>
              <S.StatMiniLabel>Total XP</S.StatMiniLabel>
            </S.StatMini>
            <S.StatMini>
              <S.StatMiniValue>{formatTime(stats.totalTimeLearned)}</S.StatMiniValue>
              <S.StatMiniLabel>Time Learned</S.StatMiniLabel>
            </S.StatMini>
            <S.StatMini>
              <S.StatMiniValue>{stats.lessonsThisWeek}</S.StatMiniValue>
              <S.StatMiniLabel>Lessons This Week</S.StatMiniLabel>
            </S.StatMini>
          </S.StatsRow>

          {stats.xpByDay.length > 0 && (
            <S.ChartContainer>
              <S.ChartLabel>XP (last 30 days)</S.ChartLabel>
              <S.BarChart>
                {stats.xpByDay.map((d) => (
                  <S.Bar
                    key={d.date}
                    $height={maxDayXp > 0 ? (d.xp / maxDayXp) * 100 : 0}
                    title={`${d.date}: ${d.xp} XP`}
                  />
                ))}
              </S.BarChart>
              <S.BarLabels>
                <S.BarLabel>{stats.xpByDay[0]?.date.slice(5)}</S.BarLabel>
                <S.BarLabel>{stats.xpByDay[stats.xpByDay.length - 1]?.date.slice(5)}</S.BarLabel>
              </S.BarLabels>
            </S.ChartContainer>
          )}
        </S.Section>
      )}
    </>
  );
};
