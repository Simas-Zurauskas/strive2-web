'use client';

import { Footer, Navbar, PublicTopBar } from '@/components';
import { useAuth } from '@/hooks';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Logged-out branch: previously rendered no nav at all, leaving visitors
  // stranded on /terms, /privacy, /pricing, /help with no way back to the
  // landing. The PublicTopBar mirrors LandingTopBar's visual language so
  // the public surface feels cohesive across all pages.
  if (!user) {
    return (
      <>
        <PublicTopBar />
        <main
          id="main-content"
          style={{
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

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        style={{
          paddingTop: '56px',
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
