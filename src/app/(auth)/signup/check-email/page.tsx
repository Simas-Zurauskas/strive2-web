import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check your inbox — Strive',
  description: 'We just sent a verification link to your inbox to finish creating your Strive account.',
  robots: { index: false, follow: false },
};

export { default } from '@/screens/CheckEmailScreen';
