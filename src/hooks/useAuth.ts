'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { setAuthToken } from '@/api/client';
import { getMe } from '@/api/routes/auth';
import { AuthorisedUser } from '@/api/types';
import { QKeys } from '@/types';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthToken(session?.token ?? null);
  }, [session?.token]);

  // If Google auth failed on the backend, sign out to avoid a broken session
  useEffect(() => {
    if (session?.error === 'GoogleAuthFailed') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session?.error]);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [QKeys.AUTH_USER],
    queryFn: getMe,
    enabled: status === 'authenticated',
  });

  const isLoading = isUserLoading || status === 'loading';

  const refetchAuthUser = () => queryClient.refetchQueries({ queryKey: [QKeys.AUTH_USER] });

  const updateUser = (updates: Partial<AuthorisedUser>) => {
    queryClient.setQueryData([QKeys.AUTH_USER], (prev: AuthorisedUser | undefined) =>
      prev ? { ...prev, ...updates } : prev,
    );
  };

  return {
    user,
    isLoading,
    signIn,
    signOut,
    refetchAuthUser,
    updateUser,
  };
};
