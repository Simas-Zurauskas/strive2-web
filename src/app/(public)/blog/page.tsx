import { SITE_URL } from '@/conf/env.server';
import { getAllBlogPosts, getFeaturedBlogPost } from '@/lib/blog/loader';
import {
  buildBlogHubJsonLd,
  buildBreadcrumbJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import { BlogHubScreen } from '@/screens/BlogScreen';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog · Strive',
  description:
    'Field notes from teaching, AI, and the design of Strive. Cognitive science behind the recall queue, engineering behind live-streaming lessons, and the product principles that shape what Strive does.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
  openGraph: {
    title: 'Strive blog',
    description: 'Field notes from teaching, AI, and the design of Strive — by Simas Zurauskas.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strive blog',
    description: 'Field notes from teaching, AI, and the design of Strive.',
  },
};

export default function BlogHubPage() {
  const posts = getAllBlogPosts();
  const featured = getFeaturedBlogPost();
  const jsonLd = [
    buildBlogHubJsonLd({ siteUrl: SITE_URL, posts }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
    ]),
  ];
  return (
    <>
      {jsonLd.map((payload, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(payload) }}
        />
      ))}
      <BlogHubScreen posts={posts} featured={featured} />
    </>
  );
}
