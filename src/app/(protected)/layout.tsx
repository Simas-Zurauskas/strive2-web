'use client';

import { Navbar, Footer, TextLoader } from '@/components';
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
        <TextLoader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '56px', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        {children}
        <Footer />
      </main>
    </>
  );
}
