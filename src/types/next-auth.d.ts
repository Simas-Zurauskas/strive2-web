import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token: string;
    error?: string;
  }

  interface User {
    // Bearer JWT minted by the API and threaded through NextAuth's JWT/session callbacks.
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token?: string;
    error?: string;
  }
}
