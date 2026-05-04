'use client';

import { useMemo } from 'react';
import { useAuth } from '@/hooks';
import * as S from './Greeting.styles';

const partOfDay = (hour: number): 'morning' | 'afternoon' | 'evening' => {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const greetingFor: Record<ReturnType<typeof partOfDay>, string> = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
};

export const Greeting = () => {
  const { user } = useAuth();

  const { greeting, displayName } = useMemo(() => {
    const now = new Date();
    const firstName = (user?.name ?? user?.email ?? '').split(/[\s@]/)[0] ?? '';
    return {
      greeting: greetingFor[partOfDay(now.getHours())],
      displayName: firstName,
    };
  }, [user?.name, user?.email]);

  return (
    <S.Wrap>
      <S.Title>
        {greeting}
        {displayName ? ', ' : '.'}
        {displayName && <S.TitleAccent>{displayName}.</S.TitleAccent>}
      </S.Title>
    </S.Wrap>
  );
};
