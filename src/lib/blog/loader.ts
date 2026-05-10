// Server-only — uses fs/path. Importable from app routes, sitemap.ts, and
// other server modules. Do NOT re-export from `lib/blog/index.ts`; the
// barrel must stay client-safe (see comment in index.ts).
import { createHash } from 'crypto';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import {
  BLOG_CATEGORY_LABELS,
  BLOG_CATEGORY_ORDER,
  type BlogCategory,
  type BlogFrontmatter,
  type BlogPost,
} from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'src/content/blog');

// Average reading speed for general adult prose in English. Conservative side
// of the published 200–300 wpm range so the displayed time errs on the longer
// side and the visitor doesn't feel deceived. Code blocks are stripped before
// counting so a heavy code-sample post isn't counted as a 25-minute read.
const WORDS_PER_MINUTE = 220;

const stripMarkdown = (md: string): string =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const computeReadTime = (body: string): number => {
  const words = stripMarkdown(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

const isValidCategory = (v: unknown): v is BlogCategory =>
  typeof v === 'string' && (BLOG_CATEGORY_ORDER as readonly string[]).includes(v);

// YAML auto-parses unquoted ISO dates (`2026-05-10`) into JavaScript Date
// objects via js-yaml inside gray-matter. Coerce both Date and string forms
// to a YYYY-MM-DD ISO date string. Returns null for anything else.
const coerceIsoDate = (v: unknown): string | null => {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }
  return null;
};

const validateFrontmatter = (
  data: Record<string, unknown>,
  expectedSlug: string,
  filePath: string,
): BlogFrontmatter => {
  const fm = data as Partial<BlogFrontmatter>;
  if (typeof fm.title !== 'string' || !fm.title.trim()) {
    throw new Error(`[blog] Missing or empty "title" in ${filePath}`);
  }
  if (typeof fm.summary !== 'string' || !fm.summary.trim()) {
    throw new Error(`[blog] Missing or empty "summary" in ${filePath}`);
  }
  if (fm.slug !== expectedSlug) {
    throw new Error(
      `[blog] Frontmatter slug "${fm.slug}" does not match filename "${expectedSlug}" in ${filePath}`,
    );
  }
  if (!isValidCategory(fm.category)) {
    throw new Error(`[blog] Invalid category "${fm.category}" in ${filePath}`);
  }
  if (typeof fm.author !== 'string' || !fm.author.trim()) {
    throw new Error(`[blog] Missing "author" in ${filePath}`);
  }
  const published = coerceIsoDate(fm.published);
  if (!published) {
    throw new Error(`[blog] Missing "published" date in ${filePath}`);
  }
  const updated = coerceIsoDate(fm.updated);
  return {
    title: fm.title,
    slug: fm.slug,
    summary: fm.summary,
    category: fm.category,
    author: fm.author,
    published,
    updated: updated ?? undefined,
    tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : [],
    featured: typeof fm.featured === 'boolean' ? fm.featured : false,
    hero: typeof fm.hero === 'string' ? fm.hero : undefined,
  };
};

const readPostFile = (filename: string): BlogPost | null => {
  if (filename.startsWith('_') || !filename.endsWith('.md')) return null;
  const slug = filename.replace(/\.md$/, '');
  const filePath = path.join(CONTENT_ROOT, filename);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = validateFrontmatter(data, slug, filePath);
  const body = content.trim();
  const contentHash = createHash('sha256').update(`${JSON.stringify(fm)}\n${body}`).digest('hex');
  return {
    title: fm.title,
    slug: fm.slug,
    summary: fm.summary,
    category: fm.category,
    categoryLabel: BLOG_CATEGORY_LABELS[fm.category],
    author: fm.author,
    published: fm.published,
    updated: fm.updated,
    tags: fm.tags ?? [],
    featured: fm.featured ?? false,
    hero: fm.hero,
    body,
    href: `/blog/${fm.slug}`,
    readTimeMinutes: computeReadTime(body),
    contentHash,
  };
};

const loadAllPostsFromDisk = (): BlogPost[] => {
  let files: string[];
  try {
    files = readdirSync(CONTENT_ROOT);
  } catch {
    return [];
  }
  const posts: BlogPost[] = [];
  for (const file of files) {
    const post = readPostFile(file);
    if (post) posts.push(post);
  }
  return posts;
};

// Newest first by published date. Cached for the build — file reads only happen
// once per server process, just like lib/kb.
export const getAllBlogPosts = cache((): BlogPost[] =>
  loadAllPostsFromDisk().sort((a, b) =>
    b.published.localeCompare(a.published),
  ),
);

export const getBlogPost = (slug: string): BlogPost | undefined =>
  getAllBlogPosts().find((p) => p.slug === slug);

export const getBlogPostsByCategory = (category: BlogCategory): BlogPost[] =>
  getAllBlogPosts().filter((p) => p.category === category);

export const getRelatedBlogPosts = (post: BlogPost, max = 3): BlogPost[] => {
  const all = getAllBlogPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = all.filter((p) => p.category === post.category);
  const others = all.filter((p) => p.category !== post.category);
  return [...sameCategory, ...others].slice(0, max);
};

export const getFeaturedBlogPost = (): BlogPost | undefined =>
  getAllBlogPosts().find((p) => p.featured);
