import { getAllTopics, getSearchEntries } from '@/lib/kb';
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
  },
};

export default function HelpHubPage() {
  return <KbHubScreen topics={getAllTopics()} searchEntries={getSearchEntries()} />;
}
