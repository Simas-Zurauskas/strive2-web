import { notFound } from 'next/navigation';
import { SITE_URL } from '@/conf/env.server';
import { KB_TOPICS, getArticlesByTopic, getSearchEntries, getTopic } from '@/lib/kb';
import {
  buildBreadcrumbJsonLd,
  buildTopicCollectionJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import { KbTopicScreen } from '@/screens/KbScreen';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () => KB_TOPICS.map((t) => ({ topic: t.slug }));

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) {
    return { title: 'Topic not found · Strive', alternates: { canonical: `/help/${topicSlug}` } };
  }
  const title = `${topic.title} · Strive help`;
  return {
    title,
    description: topic.summary,
    alternates: { canonical: `/help/${topicSlug}` },
    openGraph: {
      title,
      description: topic.summary,
      type: 'website',
      url: `/help/${topicSlug}`,
      images: DEFAULT_OG_IMAGES,
    },
  };
};

export default async function HelpTopicPage({ params }: RouteParams) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();
  const articles = getArticlesByTopic(topicSlug);
  const jsonLd = [
    buildTopicCollectionJsonLd({ siteUrl: SITE_URL, topic, articles }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Help center', url: `${SITE_URL}/help` },
      { name: topic.title, url: `${SITE_URL}${topic.href}` },
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
      <KbTopicScreen topic={topic} articles={articles} searchEntries={getSearchEntries()} />
    </>
  );
}
