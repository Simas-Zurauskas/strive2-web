'use client';

import { MutationCache, QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ClientApiError } from '@/api/types';
import { AppToaster, OutOfCreditsModal } from '@/components';
import { useCreditsSocketSync } from '@/hooks/useCreditsSocketSync';
import { JobManagerProvider } from '@/hooks/useJobManager';
import { LessonStreamProvider } from '@/hooks/useLessonStream';
import { SocketProvider } from '@/hooks/useSocket';
import { fireInsufficientCredits } from '@/lib/creditModalBus';
import { ColorScheme } from '@/theme';
import { StyledRegistry, ThemeSessionSync } from './comps';

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
 * 409 DEPTH_OVERRIDE_REQUIRES_ACK is also skipped: it's not really an
 * error, it's a "please confirm the scope" signal that the course-creation
 * wizard renders as a dedicated confirmation dialog. Toasting on top of
 * the dialog would be redundant noise.
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
    const ackCode = (apiError as { code?: string; errorCode?: string }).code
      ?? apiError.errorCode;
    if (apiError.status === 409 && ackCode === 'DEPTH_OVERRIDE_REQUIRES_ACK') return;

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
            <AppToaster />
          </StyledRegistry>
        </NextThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Registry;
