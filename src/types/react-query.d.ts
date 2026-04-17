// See Registry.tsx for how these are consumed by the global mutation error handler.
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Skip the global error toast (caller renders errors inline). */
      silent?: boolean;
      /** Fallback toast copy when the server-sent message is empty. */
      errorMessage?: string;
    };
  }
}

export {};
