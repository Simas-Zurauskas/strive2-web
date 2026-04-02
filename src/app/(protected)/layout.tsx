'use client';

import { useAuth } from '@/hooks';

export default function SignedInLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <p style={{ fontSize: '1.25rem', opacity: 0.6 }}>Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
