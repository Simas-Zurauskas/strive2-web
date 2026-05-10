import { SITE_URL } from '@/conf/env.server';
import { getAllTopics, getSearchEntries } from '@/lib/kb';
import { buildBreadcrumbJsonLd, buildHelpHubJsonLd, renderJsonLd } from '@/lib/seo/jsonLd';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import { KbHubScreen } from '@/screens/KbScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help center · Strive',
  description:
    'Browse articles or chat with the Strive guide. Learn how the platform builds personalized courses, how spaced review works, and how billing is metered.',
  alternates: { canonical: '/help' },
  openGraph: {
    title: 'Help center · Strive',
    description: 'Articles, guides, and answers about the Strive learning platform.',
    type: 'website',
    url: '/help',
    images: DEFAULT_OG_IMAGES,
  },
};

export default function HelpHubPage() {
  const topics = getAllTopics();
  const jsonLd = [
    buildHelpHubJsonLd({ siteUrl: SITE_URL, topics }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Help center', url: `${SITE_URL}/help` },
    ]),
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
      <KbHubScreen topics={topics} searchEntries={getSearchEntries()} />
    </>
  );
}
