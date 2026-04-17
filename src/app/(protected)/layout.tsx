'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Navbar, Footer, TextLoader } from '@/components';
import { useAuth } from '@/hooks';

export default function SignedInLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

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
