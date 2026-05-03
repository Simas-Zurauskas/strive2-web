import { NEXT_PUBLIC_SITE_URL } from '@/conf/env';
import { getAllArticles, getAllTopics } from '@/lib/kb';
import type { MetadataRoute } from 'next';

const STATIC_PATHS: { path: string; priority: number; changeFreq: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFreq: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFreq: 'monthly' },
  { path: '/help', priority: 0.9, changeFreq: 'weekly' },
  { path: '/privacy', priority: 0.4, changeFreq: 'monthly' },
  { path: '/terms', priority: 0.4, changeFreq: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = NEXT_PUBLIC_SITE_URL;
  const now = new Date();
  const staticEntries = STATIC_PATHS.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));
  const topicEntries = getAllTopics().map((t) => ({
    url: `${base}${t.href}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  const articleEntries = getAllArticles().map((a) => ({
    url: `${base}${a.href}`,
    lastModified: a.updated ? new Date(a.updated) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...staticEntries, ...topicEntries, ...articleEntries];
}
