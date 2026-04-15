'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useGamificationProfile } from '@/hooks/useGamification';
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

export const GamificationSection = () => {
  const { data: profile } = useGamificationProfile();

  const earnedIds = useMemo(
    () => new Set(profile?.earnedAchievements?.map((a) => a.achievementId) ?? []),
    [profile?.earnedAchievements],
  );

  if (!profile) return null;

  return (
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
  );
};
