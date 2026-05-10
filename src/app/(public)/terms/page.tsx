import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/kb';
import { DEFAULT_OG_IMAGES } from '@/lib/seo/sharedMetadata';
import { TermsScreen } from '@/screens/TermsScreen';

export const metadata: Metadata = {
  title: 'Terms of Service — Strive',
  description:
    'The terms governing your use of Strive — credits, AI-generated course content, account responsibilities, and acceptable use.',
  openGraph: { title: 'Terms of Service — Strive', type: 'website', images: DEFAULT_OG_IMAGES },
  alternates: { canonical: '/terms' },
};

export default function Page() {
  const article = getArticle('legal', 'terms-of-service');
  if (!article) notFound();
  return <TermsScreen body={article.body} updated={article.updated} />;
}
