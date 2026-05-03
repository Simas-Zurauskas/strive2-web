'use client';

import { Footer, Navbar } from '@/components';
import { useAuth } from '@/hooks';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
        <Footer />
      </main>
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
