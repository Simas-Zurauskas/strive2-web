'use client';

import { MutationCache, QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ClientApiError } from '@/api/types';
import { AppToaster } from '@/components';
import { JobManagerProvider } from '@/hooks/useJobManager';
import { SocketProvider } from '@/hooks/useSocket';
import { ColorScheme } from '@/theme';
import { StyledRegistry } from './comps';

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
 */
const mutationCache = new MutationCache({
  onError: (error, _vars, _ctx, mutation) => {
    const apiError = error as ClientApiError;
    console.error(apiError.message || 'An error occurred', apiError.errorCode ? `[${apiError.errorCode}]` : '');

    if (apiError.status === 401) return;
    if (mutation.meta?.silent) return;

    const fallback = typeof mutation.meta?.errorMessage === 'string' ? mutation.meta.errorMessage : DEFAULT_ERROR_MESSAGE;
    toast.error(apiError.message || fallback);
  },
});

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
          <StyledRegistry>
            <SocketProvider>
              <JobManagerProvider>
                {children}
              </JobManagerProvider>
            </SocketProvider>
            <AppToaster />
          </StyledRegistry>
        </NextThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Registry;
