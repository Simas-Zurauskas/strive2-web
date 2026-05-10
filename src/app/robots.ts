import { SITE_URL } from '@/conf/env.server';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/help', '/learn', '/blog', '/pricing', '/privacy', '/terms'],
        disallow: ['/api/', '/profile', '/courses', '/library', '/quizzes', '/recall', '/dev'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
