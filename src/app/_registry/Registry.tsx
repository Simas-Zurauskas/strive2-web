'use client';

import { MutationCache, QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { ApiError } from '@/api/types';
import { JobManagerProvider } from '@/hooks/useJobManager';
import { SocketProvider } from '@/hooks/useSocket';
import { ColorScheme } from '@/theme';
import { StyledRegistry } from './comps';

const defaultOptions: DefaultOptions = {
  queries: {
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
  },
  mutations: {
    // A fallback default; gets overridden when a mutation defines its own onError
    onError: (error) => {
      const apiError = error as ApiError;
      console.error(apiError.message || 'An error occurred', apiError.errorCode ? `[${apiError.errorCode}]` : '');
    },
  },
};

/** Fires for ALL mutations — even those with their own onError. */
const mutationCache = new MutationCache({
  onError: (error) => {
    const apiError = error as ApiError;
    console.error(apiError.message || 'An error occurred', apiError.errorCode ? `[${apiError.errorCode}]` : '');
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
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-body-sans), system-ui, sans-serif',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                },
              }}
            />
          </StyledRegistry>
        </NextThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Registry;
