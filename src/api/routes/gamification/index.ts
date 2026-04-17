import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Gamification profile ──────────────────────────────────

type GamificationProfileResponse =
  paths['/api/gamification/profile']['get']['responses']['200']['content']['application/json'];

export const getGamificationProfile = () => {
  return client<GamificationProfileResponse>({
    url: '/gamification/profile',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Gamification stats ────────────────────────────────────

export interface GamificationStatsData {
  xpByDay: {
    date: string;
    xp: number;
    sources: { lesson_complete: number; quiz_score: number; exercise_pass: number; review_complete: number };
  }[];
  xpByWeek: { week: string; xp: number }[];
  totalTimeLearned: number;
  lessonsThisWeek: number;
  weeklySummary: {
    thisWeek: { xp: number; timeSeconds: number; lessons: number; quizzes: number };
    lastWeek: { xp: number; timeSeconds: number; lessons: number; quizzes: number };
  };
}

export const getGamificationStats = () => {
  return client<{ data: GamificationStatsData }>({
    url: '/gamification/stats',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Quiz trends ──────────────────────────────────────────

export interface QuizTrendsData {
  attempts: {
    date: string;
    score: number;
    courseId: string;
    courseName: string;
    moduleName: string;
    moduleIndex: number;
  }[];
  averageScore: number;
  recentTrend: number;
}

export const getQuizTrends = () => {
  return client<{ data: QuizTrendsData }>({
    url: '/gamification/quiz-trends',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Streak freeze ─────────────────────────────────────────

type StreakFreezeResponse =
  paths['/api/gamification/streak-freeze']['post']['responses']['200']['content']['application/json'];

export const postStreakFreeze = () => {
  return client<StreakFreezeResponse>({
    url: '/gamification/streak-freeze',
    method: 'POST',
  }).then((res) => res.data.data);
};
