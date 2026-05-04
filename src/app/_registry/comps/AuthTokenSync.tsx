'use client';

import { useSession } from 'next-auth/react';
import { setAuthToken } from '@/api/client';

/**
 * Synchronously mirrors NextAuth's session token into the api/client
 * module-scoped token store **during render**. Fixes a race where
 * `useAuth`'s `useEffect(() => setAuthToken(session.token), [...])`
 * ran one tick after React Query queries gated on `status ===
 * 'authenticated'` had already fired — those requests went out with
 * no Authorization header, hit 401, and the response interceptor's
 * automatic `signOut()` evicted the user before they could do
 * anything.
 *
 * Mounting this component at the top of the tree (inside
 * `SessionProvider`, above `QueryClientProvider`) guarantees the
 * token is set before any descendant's query function runs in the
 * same render commit. Writing during render is safe here because
 * `setAuthToken` is a plain assignment to a module variable, not
 * React state — no side-effects during render to worry about.
 *
 * Returns null; this is a side-effect-only component.
 */
export const AuthTokenSync = () => {
  const { data: session } = useSession();
  setAuthToken(session?.token ?? null);
  return null;
};
