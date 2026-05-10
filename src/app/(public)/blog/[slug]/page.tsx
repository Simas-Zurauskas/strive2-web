import { notFound } from 'next/navigation';
import { SITE_URL } from '@/conf/env.server';
import {
  getAllBlogPosts,
  getBlogPost,
  getRelatedBlogPosts,
} from '@/lib/blog/loader';
import { getReadNext } from '@/lib/blog/readNext';
import {
  buildBlogPostJsonLd,
  buildBreadcrumbJsonLd,
  renderJsonLd,
} from '@/lib/seo/jsonLd';
import { BlogPostScreen } from '@/screens/BlogScreen';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () =>
  getAllBlogPosts().map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: 'Post not found · Strive blog',
      alternates: { canonical: `/blog/${slug}` },
    };
  }
  return {
    title: `${post.title} · Strive`,
    description: post.summary,
    keywords: post.tags.length > 0 ? [...post.tags] : undefined,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `/blog/${post.slug}`,
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [post.author],
      tags: [...post.tags],
      ...(post.hero ? { images: [{ url: post.hero }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
};

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  // Filter `related` so it doesn't duplicate the curated `readNext` card.
  const readNext = getReadNext(post);
  const related = getRelatedBlogPosts(post).filter((p) => p.slug !== readNext?.slug);
  const jsonLd = [
    buildBlogPostJsonLd({ siteUrl: SITE_URL, post }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: post.title, url: `${SITE_URL}${post.href}` },
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
      <BlogPostScreen post={post} related={related} readNext={readNext} />
    </>
  );
}
