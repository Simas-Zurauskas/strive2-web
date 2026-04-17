'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getGamificationProfile,
  getGamificationStats,
  getQuizTrends,
} from '@/api/routes/gamification';
import { QKeys } from '@/types';

export const useGamificationProfile = () =>
  useQuery({
    queryKey: [QKeys.GAMIFICATION_PROFILE],
    queryFn: getGamificationProfile,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const useGamificationStats = () =>
  useQuery({
    queryKey: [QKeys.GAMIFICATION_STATS],
    queryFn: getGamificationStats,
  });

export const useQuizTrends = () =>
  useQuery({
    queryKey: [QKeys.GAMIFICATION_QUIZ_TRENDS],
    queryFn: getQuizTrends,
  });
