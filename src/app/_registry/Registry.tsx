'use client';

import { MutationCache, QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ClientApiError } from '@/api/types';
import { AppToaster, ConceptModal, OutOfCreditsModal } from '@/components';
import { useCreditsSocketSync } from '@/hooks/useCreditsSocketSync';
import { JobManagerProvider } from '@/hooks/useJobManager';
import { LessonStreamProvider } from '@/hooks/useLessonStream';
import { SocketProvider } from '@/hooks/useSocket';
import { fireInsufficientCredits } from '@/lib/creditModalBus';
import { ColorScheme } from '@/theme';
import { AuthTokenSync, GAPageviewListener, GlobalErrorListener, StyledRegistry, ThemeSessionSync } from './comps';

const defaultOptions: DefaultOptions = {
  queries: {
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
  },
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Global mutation error handler. Any mutation without `meta.silent = true`
 * shows a toast; `meta.errorMessage` provides a domain-specific fallback
 * when the server-sent message is missing. 401s are skipped — the axios
 * interceptor already triggers sign-out.
 *
 * 409 DEPTH_OVERRIDE_REQUIRES_ACK / DEPTH_UNDERCOMMIT_REQUIRES_ACK are also
 * skipped: they're not really errors, they're "please confirm the scope"
 * signals that the course-creation wizard renders as a dedicated
 * confirmation dialog. Toasting on top of the dialog would be redundant
 * noise.
 */
const mutationCache = new MutationCache({
  onError: (error, _vars, _ctx, mutation) => {
    const apiError = error as ClientApiError;
    console.error(apiError.message || 'An error occurred', apiError.errorCode ? `[${apiError.errorCode}]` : '');

    if (apiError.status === 401) return;
    if (mutation.meta?.silent) return;
    // Depth-override gate uses a `code` field (not `errorCode`) because it's
    // emitted outside the standard error middleware. Check both shapes so
    // this guard holds whether the server aligns on `errorCode` later or not.
    // Bidirectional: overcommit AND undercommit both surface as ack-required
    // signals that the wizard handles via DepthOverrideDialog.
    const ackCode = (apiError as { code?: string; errorCode?: string }).code
      ?? apiError.errorCode;
    if (
      apiError.status === 409 &&
      (ackCode === 'DEPTH_OVERRIDE_REQUIRES_ACK' || ackCode === 'DEPTH_UNDERCOMMIT_REQUIRES_ACK')
    ) {
      return;
    }

    // 402 INSUFFICIENT_CREDITS → open the Out of Credits modal. The payload
    // carries `{ need, have }` under `meta`. Never fall through to a toast —
    // the modal is already richer than any toast, and doubling up is noise.
    if (apiError.status === 402 && apiError.errorCode === 'INSUFFICIENT_CREDITS') {
      const meta = (apiError as { meta?: { need?: number; have?: number } }).meta;
      fireInsufficientCredits({
        need: typeof meta?.need === 'number' ? meta.need : 0,
        have: typeof meta?.have === 'number' ? meta.have : 0,
      });
      return;
    }

    const fallback = typeof mutation.meta?.errorMessage === 'string' ? mutation.meta.errorMessage : DEFAULT_ERROR_MESSAGE;
    toast.error(apiError.message || fallback);
  },
});

/**
 * Small inner component that subscribes to `credits:updated` socket events.
 * Must live inside SocketProvider + QueryClientProvider to have access to
 * the socket and the React Query client. Rendering a component that
 * returns null is the cleanest way to mount the effect without introducing
 * another provider layer.
 */
const CreditsSocketSync = () => {
  useCreditsSocketSync();
  return null;
};

const Registry = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions, mutationCache }));

  return (
    <SessionProvider>
      {/* Routes window.error and unhandledrejection through the central
          reporter; outermost so it captures errors anywhere in the tree. */}
      <GlobalErrorListener />
      {/* Owns gtag page_view emission across SPA navigation. The gtag
          config in layout.tsx disables auto pageviews so this listener is
          the single source of truth — initial load + every subsequent
          client-side route change. */}
      <GAPageviewListener />
      {/* Mirrors session.token into the api/client's bearer-token store
          synchronously during render, before any descendant's React Query
          query function runs. Without this, queries gated on
          `status === "authenticated"` could fire one tick before useAuth's
          useEffect propagated the token, hit 401, and the response
          interceptor's auto-signOut evicted the user. */}
      <AuthTokenSync />
      <QueryClientProvider client={queryClient}>
        <NextThemeProvider
          enableSystem
          attribute="data-theme"
          defaultTheme="system"
          disableTransitionOnChange
          themes={['light', 'dark', 'system'] satisfies ColorScheme[]}
        >
          <ThemeSessionSync />
          <StyledRegistry>
            <SocketProvider>
              <CreditsSocketSync />
              <JobManagerProvider>
                <LessonStreamProvider>
                  {children}
                </LessonStreamProvider>
              </JobManagerProvider>
            </SocketProvider>
            {/* Global 402 handler — must live outside SocketProvider so it
                renders even when the socket is down (e.g. reconnecting). */}
            <OutOfCreditsModal />
            {/* Singleton concept-tutorial modal, opened from any HelpAnchor
                via conceptModalBus. Mounted at the same layer as the credits
                modal — visible across every authenticated and public route. */}
            <ConceptModal />
            <AppToaster />
          </StyledRegistry>
        </NextThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Registry;
