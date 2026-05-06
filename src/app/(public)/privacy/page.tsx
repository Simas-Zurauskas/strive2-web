import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Strive',
  description:
    'How Strive collects, uses, and protects your data — including how AI-generated learning content and credit transactions are handled.',
  openGraph: { title: 'Privacy Policy — Strive', type: 'website' },
  alternates: { canonical: '/privacy' },
};

export { default } from '@/screens/PrivacyScreen';
