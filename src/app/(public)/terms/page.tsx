import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Strive',
  description:
    'The terms governing your use of Strive — credits, AI-generated course content, account responsibilities, and acceptable use.',
  openGraph: { title: 'Terms of Service — Strive', type: 'website' },
  alternates: { canonical: '/terms' },
};

export { default } from '@/screens/TermsScreen';
