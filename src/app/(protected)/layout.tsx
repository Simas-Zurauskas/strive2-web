'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AppziLoader } from '@/app/_registry/comps';
import { Navbar, Footer, TextLoader } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks';

export default function SignedInLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  // Unverified credential users get /me successfully (not gated by
  // requireVerified), but every feature API will 403. Send them to the
  // check-email screen so they aren't stuck on a broken protected page.
  useEffect(() => {
    if (!user || user.emailVerified) return;
    if (user.email) sessionStorage.setItem('pendingVerificationEmail', user.email);
    router.replace(ROUTES.checkEmail());
  }, [user, router]);

  if (isLoading || (user && !user.emailVerified)) {
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
      {/* Appzi feedback widget — loaded only in the signed-in tree AND only
          after the user grants analytics-cookie consent (Appzi sets cookies
          on script execution). The Navbar Feedback button is the sole
          sanctioned trigger; the auto-injected floating button is suppressed
          via a CSS rule in theme/GlobalStyles.tsx. */}
      <AppziLoader />
      <Navbar />
      <main
        id="main-content"
        style={{
          // Tracks the live visible bottom edge of the navbar so content
          // always sits flush below whatever's on-screen — the navbar
          // alone (56px), or navbar + a route-extension like CourseShell's
          // lesson bar (~105px), or just the lesson bar when the nav row
          // tucks away on hide-on-scroll. The CSS variable is written by
          // the Navbar's hide-on-scroll effect and transitions in lockstep.
          paddingTop: 'var(--navbar-offset, 56px)',
          transition: 'padding-top 0.3s ease',
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
