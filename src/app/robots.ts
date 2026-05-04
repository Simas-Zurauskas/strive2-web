import { NEXT_PUBLIC_SITE_URL } from '@/conf/env';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/help', '/pricing', '/privacy', '/terms'],
        disallow: ['/api/', '/profile', '/courses', '/library', '/quizzes', '/recall', '/dev'],
      },
    ],
    sitemap: `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
