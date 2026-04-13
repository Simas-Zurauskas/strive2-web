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

type GamificationStatsResponse =
  paths['/api/gamification/stats']['get']['responses']['200']['content']['application/json'];

export const getGamificationStats = () => {
  return client<GamificationStatsResponse>({
    url: '/gamification/stats',
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
