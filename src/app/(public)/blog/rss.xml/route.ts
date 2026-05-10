import { SITE_URL } from '@/conf/env.server';
import { getAllBlogPosts } from '@/lib/blog/loader';

// RSS 2.0 feed for the blog. Served at /blog/rss.xml. Cheap to maintain,
// helps real subscribers + improves crawl signal. Generated at build time
// alongside the rest of the static blog routes.

const escapeXml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toRfc822 = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
};

export const dynamic = 'force-static';
export const revalidate = false;

export function GET(): Response {
  const posts = getAllBlogPosts();
  const lastBuildDate = posts.length > 0 ? toRfc822(posts[0].published) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${post.href}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.published)}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <category>${escapeXml(post.categoryLabel)}</category>
      <author>noreply@strive.school (${escapeXml(post.author)})</author>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Strive blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Field notes from teaching, AI, and the design of Strive — by Simas Zurauskas.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
