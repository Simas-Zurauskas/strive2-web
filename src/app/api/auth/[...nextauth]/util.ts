import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from '@/conf/env.server';

// Decode a JWT's payload without verifying its signature. Used only to
// peek at `exp` for sliding-refresh decisions — never to authenticate.
// Returns null on any parse failure so the caller treats it as "unknown,
// don't refresh yet" rather than crashing.
const peekJwtExp = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    return typeof payload?.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
};

// Sliding-refresh threshold. JWTs are issued for 30 days server-side; we
// refresh when they're within 7 days of expiring. Matches the same 1/4
// ratio the previous (7d / 24h) pair used — wide enough that casual
// users who visit weekly never see a re-login prompt, narrow enough that
// the refresh hit doesn't fire on every tab focus for active sessions.
const REFRESH_BEFORE_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // Force the Google account chooser on every sign-in. Without this,
      // Google silently reuses the last authenticated session, which is
      // confusing on shared devices and blocks users who want to sign in
      // with a different Google account.
      authorization: { params: { prompt: 'select_account' } },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password, type } = credentials;
        const endpoint = type === 'signup' ? 'signup' : 'signin';

        try {
          const token = await axios
            .post<{ data: string }>(`${NEXT_PUBLIC_API_URL}/api/auth/${endpoint}`, {
              email,
              password,
            })
            .then((res) => res.data.data);

          return { id: '', token };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const message = data?.message || 'Authentication failed';
            const errorCode = data?.errorCode;
            throw new Error(errorCode ? `${errorCode}::${message}` : message);
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Client-driven session.update({ token }) — used after a password
      // change/set so the caller swaps in the fresh JWT minted under the
      // new tokenVersion without dropping the session. Runs first so the
      // refresh and login branches below can't clobber the new value.
      if (trigger === 'update' && typeof session?.token === 'string' && session.token) {
        token.token = session.token;
        return token;
      }

      // Credentials flow: token comes from the authorize return
      if (user) {
        token.token = user.token;
      }

      // Google flow: send the ID token for server-side verification
      if (account?.provider === 'google' && account.id_token) {
        try {
          const response = await axios.post<{ data: string }>(`${NEXT_PUBLIC_API_URL}/api/auth/google`, {
            idToken: account.id_token,
          });
          token.token = response.data.data;
        } catch (error) {
          console.error('Failed to authenticate with Google:', error);
          token.error = 'GoogleAuthFailed';
        }
      }

      // Sliding-refresh: when the access JWT is within 24h of expiring,
      // swap in a fresh one via /api/auth/refresh. The endpoint re-checks
      // tokenVersion against the DB so a revoked token (post-logout,
      // post-password-change) refuses to refresh and the next request
      // forces a re-login. Triggered by NextAuth on every session.update()
      // and on every server-side getServerSession (and on session reads).
      const accessToken = typeof token.token === 'string' ? token.token : null;
      if (accessToken && !user && !account) {
        const exp = peekJwtExp(accessToken);
        const nowSec = Math.floor(Date.now() / 1000);
        if (exp !== null && exp - nowSec < REFRESH_BEFORE_EXPIRY_SECONDS && exp - nowSec > 0) {
          try {
            const response = await axios.post<{ data: { token: string } }>(
              `${NEXT_PUBLIC_API_URL}/api/auth/refresh`,
              {},
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            token.token = response.data.data.token;
          } catch (error) {
            // Refresh failed (token revoked, user deleted, network blip).
            // Clear the token so the next session read shows the user as
            // signed-out; useAuth will route them to /login.
            console.error('Refresh failed:', axios.isAxiosError(error) ? error.response?.data : error);
            token.token = '';
            token.error = 'RefreshFailed';
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.token) {
        session.token = token.token;
      }
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  // Pin the NextAuth session cookie to the same horizon as the wrapped
  // access token. NextAuth's default is 30 days, which happens to match,
  // but stating it explicitly keeps the two from drifting if either is
  // tuned later — a session cookie that outlives its inner JWT just
  // shows the user a "logged in but everything 401s" state.
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: NEXTAUTH_SECRET,
};
