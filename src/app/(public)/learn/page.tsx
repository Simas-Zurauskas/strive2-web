import { SITE_URL } from '@/conf/env.server';
import { getAllLearnTopics } from '@/lib/learn';
import {
  buildBreadcrumbJsonLd,
  buildLearnHubJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/sharedMetadata';
import { LearnHubScreen } from '@/screens/LearnScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn anything · Strive',
  description:
    'Pick a topic and Strive builds a personal AI course around your goal — modules, lessons, quizzes, and a daily spaced-recall queue. Free to start.',
  alternates: { canonical: '/learn' },
  openGraph: {
    title: 'Learn anything on Strive',
    description:
      'Personal AI courses on Python, Spanish, calculus, Meta Ads, negotiation, and more — generated around your goal.',
    type: 'website',
    url: '/learn',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn anything on Strive',
    description: 'Pick a topic. Strive builds the course around your goal.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function LearnHubPage() {
  const topics = getAllLearnTopics();
  const jsonLd = [
    buildLearnHubJsonLd({ siteUrl: SITE_URL, topics }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Learn', url: `${SITE_URL}/learn` },
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
      <LearnHubScreen topics={topics} />
    </>
  );
}
