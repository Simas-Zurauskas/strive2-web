import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from '@/conf/env.server';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
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
    async jwt({ token, user, account }) {
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
    signIn: '/login',
    error: '/login',
  },
  secret: NEXTAUTH_SECRET,
};
