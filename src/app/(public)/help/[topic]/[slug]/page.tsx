import { notFound } from 'next/navigation';
import { SITE_URL } from '@/conf/env.server';
import { getAllArticles, getArticle, getRelatedArticles, getTopic } from '@/lib/kb';
import { buildBreadcrumbJsonLd, renderJsonLd } from '@/lib/seo/jsonLd';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import { KbArticleScreen } from '@/screens/KbScreen';
import type { KbArticle } from '@/lib/kb';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ topic: string; slug: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () =>
  getAllArticles().map((a) => ({ topic: a.topic, slug: a.slug }));

const LEGAL_CANONICAL: Record<string, string> = {
  'privacy-policy': '/privacy',
  'terms-of-service': '/terms',
};

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { topic, slug } = await params;
  const article = getArticle(topic, slug);
  if (!article) {
    return { title: 'Article not found · Strive', alternates: { canonical: `/help/${topic}/${slug}` } };
  }
  const title = `${article.title} · Strive help`;
  const canonical = topic === 'legal' && LEGAL_CANONICAL[slug] ? LEGAL_CANONICAL[slug] : article.href;
  return {
    title,
    description: article.summary,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: canonical,
      images: DEFAULT_OG_IMAGES,
    },
  };
};

const buildArticleJsonLd = (article: KbArticle) => {
  const absoluteUrl = `${SITE_URL}${article.href}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    inLanguage: 'en',
    keywords: article.tags.join(', '),
    url: absoluteUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl },
    datePublished: article.updated,
    dateModified: article.updated,
    publisher: { '@type': 'Organization', name: 'Strive', url: SITE_URL },
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'Strive Help Center',
      url: `${SITE_URL}/help`,
    },
  };
};

export default async function HelpArticlePage({ params }: RouteParams) {
  const { topic, slug } = await params;
  const article = getArticle(topic, slug);
  if (!article) notFound();
  const topicMeta = getTopic(article.topic);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Help center', url: `${SITE_URL}/help` },
    {
      name: topicMeta?.title ?? article.topicTitle,
      url: `${SITE_URL}/help/${article.topic}`,
    },
    { name: article.title, url: `${SITE_URL}${article.href}` },
  ]);
  const jsonLd = [buildArticleJsonLd(article), breadcrumb];
  return (
    <>
      {jsonLd.map((payload, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(payload) }}
        />
      ))}
      <KbArticleScreen article={article} related={getRelatedArticles(article)} />
    </>
  );
}
