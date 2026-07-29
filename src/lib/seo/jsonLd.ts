import type { BlogPost } from '@/lib/blog';
import type { KbArticle, KbTopic } from '@/lib/kb';
import type { LearnTopic } from '@/lib/learn';

interface OrgInput {
  siteUrl: string;
}

// Claimed brand profiles, in the order they were verified. This is the field
// Google reads to connect the site to its social presence, so every entry must
// resolve — a sameAs pointing at a 404 is worse than an empty array. Append
// only after the profile is live and publicly reachable.
//
// Verify these in a browser, not with curl: Product Hunt sits behind Cloudflare
// and returns 403 to any scripted client regardless of user-agent, while
// serving real browsers and search crawlers normally. A failing curl is not
// evidence the entry is dead.
//
// GitHub (github.com/Strive-learning) is deliberately absent: the profile's
// website field is still empty, so it references strive-learning.com nowhere
// and corroborates nothing. Add it once that field is set.
export const SAME_AS: readonly string[] = [
  'https://www.linkedin.com/company/strivelearnhq/',
  'https://www.facebook.com/profile.php?id=61592246957087',
  'https://www.instagram.com/strivelearnhq/',
  'https://www.threads.net/@strivelearnhq',
  'https://x.com/strivelearnhq',
  'https://www.producthunt.com/products/strive-10',
];

export const buildOrganizationJsonLd = ({ siteUrl }: OrgInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Strive',
  url: siteUrl,
  logo: `${siteUrl}/icon1.png`,
  sameAs: [...SAME_AS],
});

export const buildWebSiteJsonLd = ({ siteUrl }: OrgInput) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Strive',
  url: siteUrl,
  inLanguage: 'en',
  publisher: { '@type': 'Organization', name: 'Strive', url: siteUrl },
});

interface SoftwareAppInput {
  siteUrl: string;
  description: string;
}

export const buildSoftwareApplicationJsonLd = ({ siteUrl, description }: SoftwareAppInput) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Strive',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  url: siteUrl,
  description,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
});

interface FaqEntry {
  question: string;
  answer: string;
}

export const buildFaqPageJsonLd = (entries: readonly FaqEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: entries.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: { '@type': 'Answer', text: entry.answer },
  })),
});

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const buildBreadcrumbJsonLd = (items: readonly BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
});

interface CollectionPageInput {
  siteUrl: string;
  topics: readonly KbTopic[];
}

export const buildHelpHubJsonLd = ({ siteUrl, topics }: CollectionPageInput) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Strive Help Center',
  url: `${siteUrl}/help`,
  description:
    'Browse articles or chat with the Strive guide. Learn how the platform builds personalized courses, how spaced review works, and how billing is metered.',
  hasPart: topics.map((topic) => ({
    '@type': 'CollectionPage',
    name: topic.title,
    url: `${siteUrl}${topic.href}`,
    description: topic.summary,
  })),
});

interface TopicCollectionInput {
  siteUrl: string;
  topic: KbTopic;
  articles: readonly KbArticle[];
}

export const buildTopicCollectionJsonLd = ({ siteUrl, topic, articles }: TopicCollectionInput) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: topic.title,
  url: `${siteUrl}${topic.href}`,
  description: topic.summary,
  isPartOf: { '@type': 'CollectionPage', name: 'Strive Help Center', url: `${siteUrl}/help` },
  hasPart: articles.map((article) => ({
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    url: `${siteUrl}${article.href}`,
    datePublished: article.updated,
    dateModified: article.updated,
  })),
});

// ── /learn — topic landing pages ──────────────────────────
//
// These pages describe *the course Strive offers on a topic*, not any
// individual user's generated course. Course content is templated, not
// taken from learner data — see lib/learn/topics.ts for the source.
// `Course` schema unlocks Google's dedicated course rich results.

interface LearnHubInput {
  siteUrl: string;
  topics: readonly LearnTopic[];
}

export const buildLearnHubJsonLd = ({ siteUrl, topics }: LearnHubInput) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Learn anything on Strive',
  url: `${siteUrl}/learn`,
  description:
    'Pick a topic and Strive builds a personal AI course around your goal — modules, lessons, quizzes, and a daily spaced-recall queue.',
  hasPart: topics.map((t) => ({
    '@type': 'Course',
    name: `Learn ${t.title} on Strive`,
    description: t.subhead,
    url: `${siteUrl}/learn/${t.slug}`,
    provider: { '@type': 'Organization', name: 'Strive', url: siteUrl },
  })),
});

interface LearnCourseInput {
  siteUrl: string;
  topic: LearnTopic;
}

export const buildLearnCourseJsonLd = ({ siteUrl, topic }: LearnCourseInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: `Learn ${topic.title} on Strive`,
  description: topic.subhead,
  url: `${siteUrl}/learn/${topic.slug}`,
  inLanguage: 'en',
  provider: {
    '@type': 'Organization',
    name: 'Strive',
    sameAs: siteUrl,
    url: siteUrl,
  },
  educationalLevel: topic.difficulty ?? 'all',
  about: { '@type': 'Thing', name: topic.title },
  teaches: topic.outcomes.map((text) => ({ '@type': 'DefinedTerm', name: text })),
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: topic.estimatedHours,
      inLanguage: 'en',
    },
  ],
  offers: {
    '@type': 'Offer',
    category: 'Free trial — no credit card',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${siteUrl}/learn/${topic.slug}`,
  },
});

// ── /blog — articles ──────────────────────────────────────

interface BlogPostJsonLdInput {
  siteUrl: string;
  post: BlogPost;
}

export const buildBlogPostJsonLd = ({ siteUrl, post }: BlogPostJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.summary,
  url: `${siteUrl}${post.href}`,
  datePublished: post.published,
  dateModified: post.updated ?? post.published,
  author: {
    '@type': 'Person',
    name: post.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Strive',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/icon1.png` },
  },
  inLanguage: 'en',
  articleSection: post.categoryLabel,
  keywords: post.tags.join(', '),
  ...(post.hero ? { image: `${siteUrl}${post.hero}` } : {}),
});

interface BlogHubJsonLdInput {
  siteUrl: string;
  posts: readonly BlogPost[];
}

export const buildBlogHubJsonLd = ({ siteUrl, posts }: BlogHubJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Strive blog',
  url: `${siteUrl}/blog`,
  description:
    'Field notes from teaching, AI, and the design of Strive — written by the founder.',
  blogPost: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${siteUrl}${post.href}`,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: { '@type': 'Person', name: post.author },
  })),
});

export const renderJsonLd = (payload: unknown) =>
  JSON.stringify(payload).replace(/</g, '\\u003c');
