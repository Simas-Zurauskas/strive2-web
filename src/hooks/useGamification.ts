'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  getGamificationProfile,
  getGamificationStats,
  getQuizTrends,
} from '@/api/routes/gamification';
import { QKeys } from '@/types';

export const useGamificationProfile = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.GAMIFICATION_PROFILE],
    queryFn: getGamificationProfile,
    enabled: status === 'authenticated',
    // XP/streak updates arrive via socket gamification events — the refetch
    // on focus is a fallback. 60s of staleness is invisible to the user and
    // keeps tab-cycling cheap.
    staleTime: 60_000,
  });
};

export const useGamificationStats = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.GAMIFICATION_STATS],
    queryFn: getGamificationStats,
    enabled: status === 'authenticated',
  });
};

export const useQuizTrends = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.GAMIFICATION_QUIZ_TRENDS],
    queryFn: getQuizTrends,
    enabled: status === 'authenticated',
  });
};
