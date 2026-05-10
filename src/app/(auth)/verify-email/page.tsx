import { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyEmailScreen from '@/screens/VerifyEmailScreen';

export const metadata: Metadata = {
  title: 'Verify your email — Strive',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailScreen />
    </Suspense>
  );
}
