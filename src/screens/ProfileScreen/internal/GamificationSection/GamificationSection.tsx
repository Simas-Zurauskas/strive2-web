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
};

// All achievement definitions (must match API constants)
const ACHIEVEMENTS = [
  { id: 'first_lesson', category: 'milestone', name: 'First Steps', description: 'Complete your first lesson', icon: 'book-open' },
  { id: 'ten_lessons', category: 'milestone', name: 'Getting Serious', description: 'Complete 10 lessons', icon: 'books' },
  { id: 'fifty_lessons', category: 'milestone', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: 'graduation-cap' },
  { id: 'first_course', category: 'milestone', name: 'Course Complete', description: 'Complete an entire course', icon: 'trophy' },
  { id: 'three_courses', category: 'milestone', name: 'Lifelong Learner', description: 'Complete 3 courses', icon: 'star' },
  { id: 'streak_3', category: 'streak', name: 'Getting Started', description: '3-day learning streak', icon: 'flame' },
  { id: 'streak_7', category: 'streak', name: 'One Week Strong', description: '7-day learning streak', icon: 'flame' },
  { id: 'streak_30', category: 'streak', name: 'Monthly Dedication', description: '30-day learning streak', icon: 'flame' },
  { id: 'perfect_quiz', category: 'mastery', name: 'Perfect Score', description: 'Score 100% on a module quiz', icon: 'target' },
  { id: 'all_mastered_course', category: 'mastery', name: 'Total Mastery', description: 'Master all modules in a course', icon: 'crown' },
  { id: 'first_review', category: 'mastery', name: 'Spaced Learner', description: 'Complete your first spaced review', icon: 'refresh-cw' },
  { id: 'hour_learned', category: 'dedication', name: 'Hour of Learning', description: 'Spend 1 hour learning', icon: 'clock' },
  { id: 'ten_hours', category: 'dedication', name: 'Dedicated Learner', description: 'Spend 10 hours learning', icon: 'clock' },
  { id: 'level_5', category: 'dedication', name: 'Level 5', description: 'Reach level 5', icon: 'zap' },
  { id: 'level_10', category: 'dedication', name: 'Level 10', description: 'Reach level 10', icon: 'zap' },
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
                  <S.Bar key={d.date} $height={maxDayXp > 0 ? (d.xp / maxDayXp) * 100 : 0} title={`${d.date}: ${d.xp} XP`} />
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
