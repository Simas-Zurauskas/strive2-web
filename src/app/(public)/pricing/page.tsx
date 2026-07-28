import { Metadata } from 'next';
import { SITE_URL } from '@/conf/env.server';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, renderJsonLd } from '@/lib/seo/jsonLd';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import PricingScreen from '@/screens/PricingScreen';
import { PRICING_FAQ } from '@/screens/PricingScreen/constants';

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

// No `Offer` / `Product` schema here on purpose. Plan prices are fetched from
// the billing catalog at runtime and their source of truth is
// `api/src/lib/pricingConfig.ts`; restating them in static markup would create
// a second copy that drifts silently, and a wrong price in a search result is
// worse than no price at all. The FAQ answers below are static, so they carry
// no such risk.
const jsonLd = [
  buildFaqPageJsonLd(PRICING_FAQ),
  buildBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Pricing', url: `${SITE_URL}/pricing` },
  ]),
];

export default function PricingPage() {
  return (
    <>
      {jsonLd.map((payload, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(payload) }}
        />
      ))}
      <PricingScreen />
    </>
  );
}
