import { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import { AboutScreen } from '@/screens/AboutScreen';

export const metadata: Metadata = {
  title: 'About',
  description:
    'What Strive is, who operates it, and who builds it — an AI-powered learning platform by MB Kūrybinis kodas, designed and built by Simas Žurauskas.',
  openGraph: { title: 'About — Strive', type: 'website', images: DEFAULT_OG_IMAGES },
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutScreen />;
}
