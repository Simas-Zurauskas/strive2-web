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
  velocity: {
    lessonsPerWeek: { current: number; previous: number };
    avgTimePerLessonSeconds: number;
    projections: {
      courseId: string;
      courseName: string;
      completedLessons: number;
      totalLessons: number;
      projectedCompletionDate: string | null;
    }[];
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

// ── Mastery overview ─────────────────────────────────────

export interface MasteryOverviewData {
  courseId: string;
  courseName: string;
  modules: {
    moduleIndex: number;
    moduleName: string;
    bestTier: string | null;
    bestScore: number | null;
    attemptCount: number;
    nextReviewAt: string | null;
  }[];
  summary: {
    mastered: number;
    passed: number;
    needsReview: number;
    notAttempted: number;
    total: number;
  };
}

export const getMasteryOverview = (courseId: string) => {
  return client<{ data: MasteryOverviewData }>({
    url: `/gamification/mastery-overview?courseId=${courseId}`,
    method: 'GET',
  }).then((res) => res.data.data);
};

export interface MasteryCourseItem {
  courseId: string;
  courseName: string;
}

export const getMasteryCourses = () => {
  return client<{ data: MasteryCourseItem[] }>({
    url: '/gamification/mastery-overview/courses',
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
