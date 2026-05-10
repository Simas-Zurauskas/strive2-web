import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/kb';
import { PrivacyScreen } from '@/screens/PrivacyScreen';

export const metadata: Metadata = {
  title: 'Privacy Policy — Strive',
  description:
    'How Strive collects, uses, and protects your data — including how AI-generated learning content and credit transactions are handled.',
  openGraph: { title: 'Privacy Policy — Strive', type: 'website' },
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  const article = getArticle('legal', 'privacy-policy');
  if (!article) notFound();
  return <PrivacyScreen body={article.body} updated={article.updated} />;
}
