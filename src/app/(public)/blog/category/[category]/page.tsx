import { notFound } from 'next/navigation';
import { SITE_URL } from '@/conf/env.server';
import {
  BLOG_CATEGORY_LABELS,
  BLOG_CATEGORY_ORDER,
  type BlogCategory,
} from '@/lib/blog';
import { getAllBlogPosts, getBlogPostsByCategory } from '@/lib/blog/loader';
import { buildBreadcrumbJsonLd, renderJsonLd } from '@/lib/seo/jsonLd';
import { BlogHubScreen } from '@/screens/BlogScreen';
import type { Metadata } from 'next';

interface RouteParams {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () =>
  BLOG_CATEGORY_ORDER.map((category) => ({ category }));

const isValidCategory = (v: string): v is BlogCategory =>
  (BLOG_CATEGORY_ORDER as readonly string[]).includes(v);

export const generateMetadata = async ({ params }: RouteParams): Promise<Metadata> => {
  const { category } = await params;
  if (!isValidCategory(category)) {
    return {
      title: 'Category not found · Strive blog',
      alternates: { canonical: `/blog/category/${category}` },
    };
  }
  const label = BLOG_CATEGORY_LABELS[category];
  return {
    title: `${label} · Strive blog`,
    description: `${label} posts from the Strive blog — by Simas Zurauskas.`,
    alternates: { canonical: `/blog/category/${category}` },
    openGraph: {
      title: `${label} · Strive blog`,
      description: `${label} posts from the Strive blog.`,
      type: 'website',
      url: `/blog/category/${category}`,
    },
  };
};

export default async function BlogCategoryPage({ params }: RouteParams) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();
  const posts = getBlogPostsByCategory(category);
  // Empty categories at launch are still indexable — gives the structure to
  // crawl. Visitors see the friendly empty-state from BlogHubScreen.
  if (posts.length === 0 && getAllBlogPosts().length > 0) {
    // Allow empty category page to render rather than 404 — the filter UX is
    // the value, and posts will land in this category eventually.
  }
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: BLOG_CATEGORY_LABELS[category], url: `${SITE_URL}/blog/category/${category}` },
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
      <BlogHubScreen posts={posts} activeCategory={category} />
    </>
  );
}
