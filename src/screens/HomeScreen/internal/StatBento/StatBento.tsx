'use client';

import { CheckCircle2, Star } from 'lucide-react';
import { useMemo } from 'react';
import { HelpAnchor } from '@/components';
import { useGamificationProfile, useGamificationStats } from '@/hooks/useGamification';
import * as S from './StatBento.styles';
import { SkeletonBlock } from '../_skeleton/skeleton.styles';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 4850, 5750, 6700, 7700, 8700, 9700, 10700, 11700, 12700,
  13700, 14700, 15700, 16700, 17700,
];
const getLevelThreshold = (level: number): number => {
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1] ?? 0;
  return 17700 + (level - LEVEL_THRESHOLDS.length) * 1000;
};
const xpNeededForLevel = (level: number): number => getLevelThreshold(level + 1) - getLevelThreshold(level);

const STREAK_TARGETS = [3, 7, 14, 30];
const nextStreakTarget = (current: number): number =>
  STREAK_TARGETS.find((t) => t > current) ?? Math.ceil((current + 1) / 30) * 30;

/** Build 7-day sparkline [Mon..Sun] of XP for the current week (UTC). */
const buildWeekSparkline = (xpByDay?: { date: string; xp: number }[]): { day: string; xp: number }[] => {
  const today = new Date();
  const todayUtcDow = (today.getUTCDay() + 6) % 7; // 0 = Mon
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - todayUtcDow);

  const map = new Map<string, number>();
  if (xpByDay) for (const d of xpByDay) map.set(d.date, (map.get(d.date) ?? 0) + d.xp);

  const out: { day: string; xp: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], xp: map.get(key) ?? 0 });
  }
  return out;
};

const formatHours = (seconds: number): { value: string; unit: string } => {
  if (seconds < 60) return { value: '0', unit: 'min' };
  const totalMinutes = Math.floor(seconds / 60);
  if (totalMinutes < 60) return { value: totalMinutes.toString(), unit: totalMinutes === 1 ? 'min' : 'min' };
  const hours = totalMinutes / 60;
  if (hours < 10) return { value: hours.toFixed(1), unit: 'hrs' };
  return { value: Math.round(hours).toString(), unit: 'hrs' };
};

interface StatBentoProps {
  totalCourses: number;
}

/**
 * Skeleton uses the real S.Card so it inherits the same padding, gap, and
 * min-height — guarantees zero layout shift when real data lands. Inner
 * blocks approximate label / big number / progress bar / two foot lines
 * (matching the layout shape the Streak and Level cards produce, which
 * are the tallest of the four).
 */
const StatBentoSkeleton = () => (
  <S.Grid aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <S.Card key={i}>
        <S.TopRow>
          <SkeletonBlock $h="0.6875rem" $w="4.5rem" />
          <SkeletonBlock $h="1.5rem" $w="3.5rem" $radius="9999px" />
        </S.TopRow>
        <SkeletonBlock $h="2.375rem" $w="55%" />
        <S.Foot>
          <SkeletonBlock $h="5px" $w="100%" $radius="9999px" />
          <SkeletonBlock $h="0.625rem" $w="2rem" />
        </S.Foot>
        <S.Foot>
          <SkeletonBlock $h="0.6875rem" $w="75%" />
        </S.Foot>
      </S.Card>
    ))}
  </S.Grid>
);

export const StatBento = ({ totalCourses }: StatBentoProps) => {
  const { data: profile, isLoading: profileLoading } = useGamificationProfile();
  const { data: stats, isLoading: statsLoading } = useGamificationStats();
  const isLoading = profileLoading || statsLoading;

  const week = useMemo(() => {
    if (!stats) return null;
    const sparkline = buildWeekSparkline(stats.xpByDay);
    const maxXp = Math.max(1, ...sparkline.map((s) => s.xp));
    const lessonsThis = stats.lessonsThisWeek;
    const lessonsLast = stats.weeklySummary.lastWeek.lessons;
    const delta = lessonsThis - lessonsLast;
    return { sparkline, maxXp, lessonsThis, delta };
  }, [stats]);

  const streak = useMemo(() => {
    if (!profile) return null;
    const target = nextStreakTarget(profile.currentStreak);
    const percent = target > 0 ? Math.round((profile.currentStreak / target) * 100) : 0;
    return { current: profile.currentStreak, target, percent };
  }, [profile]);

  const level = useMemo(() => {
    if (!profile) return null;
    const threshold = getLevelThreshold(profile.level);
    const xpInLevel = Math.max(0, profile.totalXp - threshold);
    const xpNeeded = xpNeededForLevel(profile.level);
    const xpRemaining = Math.max(0, xpNeeded - xpInLevel);
    const percent = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 0;
    return { level: profile.level, percent, xpRemaining, totalXp: profile.totalXp };
  }, [profile]);

  const hours = useMemo(() => {
    if (!stats) return null;
    return formatHours(stats.totalTimeLearned);
  }, [stats]);

  if (isLoading) return <StatBentoSkeleton />;

  return (
    <S.Grid aria-label="Progress at a glance">
      {/* ── This week ─────────────────────────── */}
      <S.Card>
        <S.TopRow>
          <S.Label>
            This week <HelpAnchor concept="xp-and-streaks" size="sm" />
          </S.Label>
          <S.Halo>
            <CheckCircle2 size={14} strokeWidth={1.75} />
          </S.Halo>
        </S.TopRow>
        <S.BigNum>
          {week?.lessonsThis ?? 0}
          <S.Unit>{week?.lessonsThis === 1 ? 'lesson' : 'lessons'}</S.Unit>
        </S.BigNum>
        <S.Sparkline aria-hidden>
          {(week?.sparkline ?? Array.from({ length: 7 }, () => ({ day: '', xp: 0 }))).map((d, i) => (
            <S.SparklineBar
              key={i}
              $height={(d.xp / (week?.maxXp ?? 1)) * 100}
              $hi={d.xp >= (week?.maxXp ?? 0) * 0.6 && d.xp > 0}
              title={d.xp > 0 ? `${d.xp} XP` : 'No activity'}
            />
          ))}
        </S.Sparkline>
        <S.Foot>
          {week?.delta !== undefined && week.delta !== 0 ? (
            <S.FootDelta $positive={week.delta > 0}>
              {week.delta > 0 ? '↑' : '↓'} {Math.abs(week.delta)} vs last week
            </S.FootDelta>
          ) : (
            <span>Same pace as last week</span>
          )}
        </S.Foot>
      </S.Card>

      {/* ── Current streak ────────────────────── */}
      <S.Card>
        <S.TopRow>
          <S.Label>Current streak</S.Label>
        </S.TopRow>
        <S.BigNum>
          {streak?.current ?? 0}
          <S.Unit>{streak?.current === 1 ? 'day' : 'days'}</S.Unit>
        </S.BigNum>
        <S.Foot>
          <S.ProgressBar>
            <S.ProgressFill $percent={streak?.percent ?? 0} />
          </S.ProgressBar>
          <span style={{ whiteSpace: 'nowrap' }}>to {streak?.target ?? '—'}</span>
        </S.Foot>
        <S.Foot>
          {streak && streak.target > streak.current ? (
            <span>
              {streak.target - streak.current}{' '}
              {streak.target - streak.current === 1 ? 'day' : 'days'} until next milestone
            </span>
          ) : (
            <span>Steady pace</span>
          )}
        </S.Foot>
      </S.Card>

      {/* ── Level ─────────────────────────────── */}
      <S.Card>
        <S.TopRow>
          <S.Label>Level</S.Label>
          <S.Pill>
            <Star size={12} strokeWidth={1.75} fill="currentColor" />
            Lvl {level?.level ?? 1}
          </S.Pill>
        </S.TopRow>
        <S.BigNum>
          {(level?.totalXp ?? 0).toLocaleString()}
          <S.Unit>XP</S.Unit>
        </S.BigNum>
        <S.Foot>
          <S.ProgressBar>
            <S.ProgressFill $percent={level?.percent ?? 0} $tone="tertiary" />
          </S.ProgressBar>
          <span style={{ whiteSpace: 'nowrap' }}>{level?.percent ?? 0}%</span>
        </S.Foot>
        <S.Foot>
          {level && level.xpRemaining > 0 ? (
            <span>
              {level.xpRemaining.toLocaleString()} XP to Level {level.level + 1}
            </span>
          ) : (
            <span>Level {((level?.level ?? 0) + 1)} unlocked</span>
          )}
        </S.Foot>
      </S.Card>

      {/* ── Total hours ───────────────────────── */}
      <S.Card>
        <S.TopRow>
          <S.Label>Total time</S.Label>
        </S.TopRow>
        <S.BigNum>
          {hours?.value ?? '0'}
          <S.Unit>{hours?.unit ?? 'hrs'}</S.Unit>
        </S.BigNum>
        <S.Foot>
          <S.ProgressBar>
            <S.ProgressFill $percent={100} />
          </S.ProgressBar>
        </S.Foot>
        <S.Foot>
          <span>
            Across {totalCourses} {totalCourses === 1 ? 'course' : 'courses'}
          </span>
        </S.Foot>
      </S.Card>
    </S.Grid>
  );
};
