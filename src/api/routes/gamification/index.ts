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

export interface XpSourceBreakdown {
  lesson_complete: number;
  quiz_score: number;
  exercise_pass: number;
  review_complete: number;
  insight_review: number;
  insight_mastery: number;
}

export interface XpDayEntry {
  date: string;
  xp: number;
  sources: XpSourceBreakdown;
}

export interface WeeklySummaryPeriod {
  xp: number;
  timeSeconds: number;
  lessons: number;
  quizzes: number;
  insights: number;
}

export interface GamificationStatsData {
  xpByDay: XpDayEntry[];
  xpByWeek: { week: string; xp: number }[];
  totalTimeLearned: number;
  lessonsThisWeek: number;
  weeklySummary: {
    thisWeek: WeeklySummaryPeriod;
    lastWeek: WeeklySummaryPeriod;
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
