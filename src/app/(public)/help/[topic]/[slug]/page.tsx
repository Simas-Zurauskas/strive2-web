import { notFound } from 'next/navigation';
import { getAllArticles, getArticle, getRelatedArticles } from '@/lib/kb';
import { KbArticleScreen } from '@/screens/KbScreen';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ topic: string; slug: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () =>
  getAllArticles().map((a) => ({ topic: a.topic, slug: a.slug }));

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { topic, slug } = await params;
  const article = getArticle(topic, slug);
  if (!article) {
    return { title: 'Article not found · Strive', alternates: { canonical: `/help/${topic}/${slug}` } };
  }
  const title = `${article.title} · Strive help`;
  return {
    title,
    description: article.summary,
    alternates: { canonical: article.href },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: article.href,
    },
  };
};

export default async function HelpArticlePage({ params }: RouteParams) {
  const { topic, slug } = await params;
  const article = getArticle(topic, slug);
  if (!article) notFound();
  return <KbArticleScreen article={article} related={getRelatedArticles(article)} />;
}
