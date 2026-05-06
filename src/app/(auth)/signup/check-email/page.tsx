import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check your inbox — Strive',
  robots: { index: false, follow: false },
};

export { default } from '@/screens/CheckEmailScreen';
