import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token: string;
    error?: string;
    // True only on the session read that immediately follows account creation.
    // Google sign-in and sign-up are one endpoint, so without this the browser
    // cannot tell a brand-new account from a returning one — see
    // `_registry/comps/AnalyticsIdentitySync` for what depends on it.
    isNewUser?: boolean;
  }

  interface User {
    // Bearer JWT minted by the API and threaded through NextAuth's JWT/session callbacks.
    token: string;
    // Reported by the API's signup endpoint; carried into the JWT callback.
    isNewUser?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token?: string;
    error?: string;
    isNewUser?: boolean;
  }
}
