import { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';

export const metadata: Metadata = {
  title: 'Pricing — Strive',
  description:
    'Pay only for what you generate. Pick a plan that matches your monthly allowance — AI-generated courses, lessons, quizzes, and spaced-recall practice.',
  openGraph: {
    title: 'Strive pricing — an allowance that fits your learning pace',
    description:
      'Plans scale by monthly allowance. Top up any time. AI-generated personal courses, lessons, quizzes, and a daily recall queue.',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  alternates: { canonical: '/pricing' },
};

export { default } from '@/screens/PricingScreen';
