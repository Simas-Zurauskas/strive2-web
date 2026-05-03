import { notFound } from 'next/navigation';
import { KB_TOPICS, getArticlesByTopic, getSearchEntries, getTopic } from '@/lib/kb';
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
    },
  };
};

export default async function HelpTopicPage({ params }: RouteParams) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();
  return (
    <KbTopicScreen
      topic={topic}
      articles={getArticlesByTopic(topicSlug)}
      searchEntries={getSearchEntries()}
    />
  );
}
