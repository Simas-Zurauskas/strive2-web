import { Metadata } from 'next';
import { NEXT_PUBLIC_SITE_URL } from '@/conf/env';
import { safeRedirect } from '@/lib/safeRedirect';
import LandingScreen from '@/screens/LandingScreen';

export const metadata: Metadata = {
  title: 'Strive — Personal AI courses on anything you want to learn',
  description:
    'Strive turns any goal into a personalised curriculum — modules, lessons, quizzes, and a daily spaced-recall queue — generated live by AI. Free to start. No credit card.',
  openGraph: {
    title: 'Strive — Personal AI courses, generated live',
    description:
      'Tell Strive what you want to learn. AI builds your modules, lessons, and quizzes, and a daily recall queue makes them stick.',
    url: NEXT_PUBLIC_SITE_URL,
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
  return <LandingScreen redirect={redirect} initialAuthMode={initialAuthMode} />;
}
