'use client';

import { useEffect, useState } from 'react';
import { Footer, Navbar, PublicTopBar } from '@/components';
import { useAuth } from '@/hooks';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // SSR can't read the auth state (client-only); rendering the wrong branch
  // here triggers React 19 / Next 16 hydration warnings AND a visible flash
  // of the wrong nav for signed-in users on /pricing, /terms, /privacy,
  // /help. Solution: render an unauth-shape shell during SSR + the first
  // client paint, then flip to the authed nav in a post-mount effect. The
  // <main>+<Footer> shell stays identical across both branches so only the
  // top nav element changes, minimising layout shift.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const showAuthedNav = mounted && user;

  return (
    <>
      {showAuthedNav ? <Navbar /> : <PublicTopBar />}
      <main
        id="main-content"
        style={{
          paddingTop: showAuthedNav ? '56px' : undefined,
          minHeight: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
