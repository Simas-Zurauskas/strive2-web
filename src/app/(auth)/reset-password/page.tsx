import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

export const metadata: Metadata = {
  title: 'Set a new password — Strive',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
