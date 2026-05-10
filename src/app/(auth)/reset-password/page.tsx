import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

export const metadata: Metadata = {
  title: 'Set a new password — Strive',
  description: 'Choose a new password for your Strive account.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
