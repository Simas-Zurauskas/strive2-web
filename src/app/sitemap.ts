import { SITE_URL } from '@/conf/env.server';
import { BLOG_CATEGORY_ORDER } from '@/lib/blog';
import { getAllBlogPosts } from '@/lib/blog/loader';
import { getAllArticles, getAllTopics, getArticlesByTopic } from '@/lib/kb';
import { getAllLearnTopics } from '@/lib/learn';
import type { MetadataRoute } from 'next';

const STATIC_LAST_MODIFIED = new Date('2026-05-10');

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}[] = [
  { path: '/', priority: 1.0, changeFreq: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFreq: 'monthly' },
  { path: '/help', priority: 0.9, changeFreq: 'weekly' },
  { path: '/learn', priority: 0.95, changeFreq: 'weekly' },
  { path: '/blog', priority: 0.9, changeFreq: 'weekly' },
  { path: '/blog/rss.xml', priority: 0.5, changeFreq: 'weekly' },
  { path: '/privacy', priority: 0.4, changeFreq: 'yearly' },
  { path: '/terms', priority: 0.4, changeFreq: 'yearly' },
];

const parseUpdated = (updated?: string): Date | null => {
  if (!updated) return null;
  const d = new Date(updated);
  return Number.isNaN(d.getTime()) ? null : d;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const staticEntries = STATIC_PATHS.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));
  const topicEntries = getAllTopics().map((t) => {
    const articleDates = getArticlesByTopic(t.slug)
      .map((a) => parseUpdated(a.updated))
      .filter((d): d is Date => d !== null);
    const lastModified =
      articleDates.length > 0
        ? new Date(Math.max(...articleDates.map((d) => d.getTime())))
        : STATIC_LAST_MODIFIED;
    return {
      url: `${base}${t.href}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });
  const articleEntries = getAllArticles().map((a) => ({
    url: `${base}${a.href}`,
    lastModified: parseUpdated(a.updated) ?? STATIC_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const learnEntries = getAllLearnTopics().map((t) => ({
    url: `${base}/learn/${t.slug}`,
    lastModified: parseUpdated(t.updated) ?? STATIC_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));
  const blogPostEntries = getAllBlogPosts().map((p) => ({
    url: `${base}${p.href}`,
    lastModified: parseUpdated(p.updated) ?? parseUpdated(p.published) ?? STATIC_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  const blogCategoryEntries = BLOG_CATEGORY_ORDER.map((category) => ({
    url: `${base}/blog/category/${category}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));
  return [
    ...staticEntries,
    ...topicEntries,
    ...articleEntries,
    ...learnEntries,
    ...blogPostEntries,
    ...blogCategoryEntries,
  ];
}
