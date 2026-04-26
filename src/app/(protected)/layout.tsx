'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Navbar, Footer, LowCreditBanner, TextLoader } from '@/components';
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
      <Navbar />
      <main style={{ paddingTop: '56px', minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        <LowCreditBanner />
        {children}
        <Footer />
      </main>
    </>
  );
}
