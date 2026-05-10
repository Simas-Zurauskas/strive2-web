import { Metadata } from 'next';
import { SITE_URL } from '@/conf/env.server';
import { safeRedirect } from '@/lib/safeRedirect';
import {
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import LandingScreen from '@/screens/LandingScreen';
import { FAQ } from '@/screens/LandingScreen/constants';

export const metadata: Metadata = {
  title: 'Strive — Personal AI courses on anything you want to learn',
  description:
    'Strive turns any goal into a personalised curriculum — modules, lessons, quizzes, and a daily spaced-recall queue — generated live by AI. Free to start. No credit card.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Strive — Personal AI courses, generated live',
    description:
      'Tell Strive what you want to learn. AI builds your modules, lessons, and quizzes, and a daily recall queue makes them stick.',
    url: SITE_URL,
    siteName: 'Strive',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

type PageProps = {
  searchParams: Promise<{ redirect?: string; auth?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirect = safeRedirect(params.redirect, '/');
  // `?auth=signin|signup` lets external callers (e.g. /pricing CTA buttons,
  // /terms or /privacy "Sign in" link from PublicTopBar) deep-link into the
  // landing with the auth modal already open, instead of dumping the visitor
  // onto the landing and forcing them to click another button.
  const initialAuthMode =
    params.auth === 'signup' || params.auth === 'signin' ? params.auth : null;

  const jsonLd = [
    buildOrganizationJsonLd({ siteUrl: SITE_URL }),
    buildWebSiteJsonLd({ siteUrl: SITE_URL }),
    buildSoftwareApplicationJsonLd({
      siteUrl: SITE_URL,
      description:
        'Strive turns any goal into a personalised AI-generated curriculum: modules, lessons, quizzes, and a daily spaced-recall queue.',
    }),
    buildFaqPageJsonLd(FAQ),
  ];

  return (
    <>
      {jsonLd.map((payload, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(payload) }}
        />
      ))}
      <LandingScreen redirect={redirect} initialAuthMode={initialAuthMode} />
    </>
  );
}
