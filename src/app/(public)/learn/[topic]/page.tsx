import { notFound } from 'next/navigation';
import { SITE_URL } from '@/conf/env.server';
import { LEARN_TOPICS, getLearnTopic } from '@/lib/learn';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildLearnCourseJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import { LearnTopicScreen } from '@/screens/LearnScreen';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () => LEARN_TOPICS.map((t) => ({ topic: t.slug }));

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { topic: topicSlug } = await params;
  const topic = getLearnTopic(topicSlug);
  if (!topic) {
    return {
      title: 'Topic not found · Strive',
      alternates: { canonical: `/learn/${topicSlug}` },
    };
  }
  const title = `Learn ${topic.title} — personal AI course · Strive`;
  return {
    title,
    description: topic.metaDescription,
    keywords: [...topic.keywords],
    alternates: { canonical: `/learn/${topic.slug}` },
    openGraph: {
      title,
      description: topic.metaDescription,
      type: 'website',
      url: `/learn/${topic.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: topic.metaDescription,
    },
  };
};

export default async function LearnTopicPage({ params }: RouteParams) {
  const { topic: topicSlug } = await params;
  const topic = getLearnTopic(topicSlug);
  if (!topic) notFound();
  const jsonLd = [
    buildLearnCourseJsonLd({ siteUrl: SITE_URL, topic }),
    buildFaqPageJsonLd(topic.faq),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Learn', url: `${SITE_URL}/learn` },
      { name: topic.title, url: `${SITE_URL}/learn/${topic.slug}` },
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
      <LearnTopicScreen topic={topic} />
    </>
  );
}
