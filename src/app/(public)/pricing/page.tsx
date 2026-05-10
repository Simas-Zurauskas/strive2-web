import { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';

export const metadata: Metadata = {
  title: 'Pricing — Strive',
  description:
    'Pay only for what you generate. Buy credits in flexible bundles to power AI-generated courses, lessons, quizzes, and spaced-recall practice.',
  openGraph: {
    title: 'Strive pricing — credits that fit your learning pace',
    description:
      'Top up Strive credits to generate personalised AI courses, lessons, quizzes, and a daily recall queue. No subscription. No expiry.',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  alternates: { canonical: '/pricing' },
};

export { default } from '@/screens/PricingScreen';
