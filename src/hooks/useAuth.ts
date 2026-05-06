'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut as nextAuthSignOut, useSession, signIn } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { setAuthToken } from '@/api/client';
import { getMe, logout } from '@/api/routes/auth';
import { AuthorisedUser } from '@/api/types';
import { QKeys } from '@/types';

type SignOutParams = Parameters<typeof nextAuthSignOut>[0];

export const useAuth = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthToken(session?.token ?? null);
  }, [session?.token]);

  // If Google auth failed on the backend, sign out to avoid a broken session.
  // Uses the raw next-auth signOut (not our wrapper): the token is already
  // invalid, so calling /api/auth/logout would just 401 and add noise.
  // Same applies to `RefreshFailed` — the access token couldn't be refreshed
  // (revoked tokenVersion, deleted user, etc.) and the session is dead.
  useEffect(() => {
    if (session?.error === 'GoogleAuthFailed' || session?.error === 'RefreshFailed') {
      nextAuthSignOut({ callbackUrl: '/' });
    }
  }, [session?.error]);

  // UI-facing signOut: revoke server-side (rotates tokenVersion so the JWT is
  // rejected even if it's still otherwise valid), then clear the NextAuth
  // session. Best-effort: if the revoke call fails (offline, already-invalid
  // token, server down), we still clear the session so the user isn't stuck
  // logged in locally. The 401 interceptor in api/client.ts is unaffected —
  // it uses the raw signOut to avoid a revoke loop on already-dead tokens.
  const signOut = useCallback(async (options?: SignOutParams) => {
    await logout().catch(() => {});
    return nextAuthSignOut(options);
  }, []);

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
