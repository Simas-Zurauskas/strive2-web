'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useGamificationProfile, useGamificationStats } from '@/hooks/useGamification';
import * as S from './GamificationSection.styles';

const BADGES = [
  { id: 'lesson_first', name: 'First Steps', requirement: 'Complete 1 lesson' },
  { id: 'lessons_ten', name: 'Getting Serious', requirement: 'Complete 10 lessons' },
  { id: 'lessons_fifty', name: 'Bookworm', requirement: 'Complete 50 lessons' },
  { id: 'course_first', name: 'Course Complete', requirement: 'Complete 1 course' },
  { id: 'courses_three', name: 'Lifelong Learner', requirement: 'Complete 3 courses' },
  { id: 'courses_five', name: 'Polymath', requirement: 'Complete 5 courses' },
  { id: 'streak_3', name: 'Spark', requirement: '3-day streak' },
  { id: 'streak_7', name: 'One Week Strong', requirement: '7-day streak' },
  { id: 'streak_14', name: 'Fortnight Flame', requirement: '14-day streak' },
  { id: 'review_first', name: 'Spaced Learner', requirement: 'Complete 1 spaced review' },
  { id: 'quiz_perfect', name: 'Perfect Score', requirement: '100% on a module quiz' },
  { id: 'course_mastered', name: 'Total Mastery', requirement: 'Master all modules' },
  { id: 'hours_one', name: 'Hour of Learning', requirement: 'Spend 1 hour learning' },
  { id: 'hours_ten', name: 'Dedicated Learner', requirement: 'Spend 10 hours learning' },
  { id: 'hours_twentyfive', name: 'Marathon Learner', requirement: 'Spend 25 hours learning' },
  { id: 'level_5', name: 'Level 5', requirement: 'Reach level 5' },
  { id: 'level_15', name: 'Level 15', requirement: 'Reach level 15' },
  { id: 'level_25', name: 'Grandmaster', requirement: 'Reach level 25' },
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
          Achievements ({earnedIds.size}/{BADGES.length})
        </S.SectionTitle>

        <S.BadgeGrid>
          {BADGES.map((badge) => {
            const earned = earnedIds.has(badge.id);
            return (
              <S.BadgeTile key={badge.id}>
                <S.BadgeImageWrap $earned={earned}>
                  <Image
                    src={`/images/gmf/${badge.id}.png`}
                    alt={badge.name}
                    width={80}
                    height={80}
                    draggable={false}
                  />
                </S.BadgeImageWrap>
                <S.BadgeName $earned={earned}>{badge.name}</S.BadgeName>
                <S.BadgeRequirement $earned={earned}>{badge.requirement}</S.BadgeRequirement>
              </S.BadgeTile>
            );
          })}
        </S.BadgeGrid>
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
