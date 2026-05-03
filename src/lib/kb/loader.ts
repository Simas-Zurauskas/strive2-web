import { createHash } from 'crypto';
import { readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { KB_TOPICS, getTopicConfig } from './topics';
import type { KbArticle, KbFrontmatter, KbSearchEntry, KbTopic } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'src/content/kb');

const stripMarkdown = (md: string): string =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildExcerpt = (body: string, max = 200): string => {
  const plain = stripMarkdown(body);
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, '')}…`;
};

const validateFrontmatter = (
  data: Record<string, unknown>,
  expectedTopic: string,
  expectedSlug: string,
  filePath: string
): KbFrontmatter => {
  const fm = data as Partial<KbFrontmatter>;
  if (typeof fm.title !== 'string' || !fm.title.trim()) {
    throw new Error(`[kb] Missing or empty "title" in ${filePath}`);
  }
  if (typeof fm.summary !== 'string' || !fm.summary.trim()) {
    throw new Error(`[kb] Missing or empty "summary" in ${filePath}`);
  }
  if (fm.slug !== expectedSlug) {
    throw new Error(
      `[kb] Frontmatter slug "${fm.slug}" does not match filename "${expectedSlug}" in ${filePath}`
    );
  }
  if (fm.topic !== expectedTopic) {
    throw new Error(
      `[kb] Frontmatter topic "${fm.topic}" does not match folder "${expectedTopic}" in ${filePath}`
    );
  }
  if (!getTopicConfig(expectedTopic)) {
    throw new Error(`[kb] Topic "${expectedTopic}" is not registered in topics.ts (file: ${filePath})`);
  }
  return {
    title: fm.title,
    slug: fm.slug,
    topic: fm.topic,
    summary: fm.summary,
    tags: Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : [],
    order: typeof fm.order === 'number' ? fm.order : 100,
    updated: typeof fm.updated === 'string' ? fm.updated : undefined,
    related: Array.isArray(fm.related) ? fm.related.filter((r): r is string => typeof r === 'string') : [],
  };
};

const readArticleFile = (topic: string, filename: string): KbArticle | null => {
  if (filename.startsWith('_') || !filename.endsWith('.md')) return null;
  const slug = filename.replace(/\.md$/, '');
  const filePath = path.join(CONTENT_ROOT, topic, filename);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = validateFrontmatter(data, topic, slug, filePath);
  const topicCfg = getTopicConfig(topic);
  const body = content.trim();
  const contentHash = createHash('sha256').update(`${JSON.stringify(fm)}\n${body}`).digest('hex');
  return {
    title: fm.title,
    slug: fm.slug,
    topic: fm.topic,
    topicTitle: topicCfg?.title ?? fm.topic,
    summary: fm.summary,
    tags: fm.tags ?? [],
    order: fm.order ?? 100,
    updated: fm.updated,
    relatedSlugs: fm.related ?? [],
    body,
    href: `/help/${fm.topic}/${fm.slug}`,
    contentHash,
  };
};

const loadAllArticlesFromDisk = (): KbArticle[] => {
  const articles: KbArticle[] = [];
  let topicDirs: string[];
  try {
    topicDirs = readdirSync(CONTENT_ROOT);
  } catch {
    return [];
  }
  for (const topic of topicDirs) {
    const topicPath = path.join(CONTENT_ROOT, topic);
    if (!statSync(topicPath).isDirectory()) continue;
    if (!getTopicConfig(topic)) continue;
    const files = readdirSync(topicPath);
    for (const filename of files) {
      const article = readArticleFile(topic, filename);
      if (article) articles.push(article);
    }
  }
  articles.sort((a, b) => {
    if (a.topic !== b.topic) {
      const ao = getTopicConfig(a.topic)?.order ?? 999;
      const bo = getTopicConfig(b.topic)?.order ?? 999;
      return ao - bo;
    }
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
  return articles;
};

export const getAllArticles = cache((): KbArticle[] => loadAllArticlesFromDisk());

export const getArticle = cache((topic: string, slug: string): KbArticle | null => {
  const all = getAllArticles();
  return all.find((a) => a.topic === topic && a.slug === slug) ?? null;
});

export const getArticlesByTopic = cache((topic: string): KbArticle[] =>
  getAllArticles().filter((a) => a.topic === topic)
);

export const getAllTopics = cache((): KbTopic[] =>
  KB_TOPICS.map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    icon: t.icon,
    order: t.order,
    href: `/help/${t.slug}`,
    articleCount: getArticlesByTopic(t.slug).length,
  })).sort((a, b) => a.order - b.order)
);

export const getTopic = cache((slug: string): KbTopic | null => {
  const all = getAllTopics();
  return all.find((t) => t.slug === slug) ?? null;
});

export const getRelatedArticles = cache((article: KbArticle, max = 3): KbArticle[] => {
  const all = getAllArticles();
  if (article.relatedSlugs.length > 0) {
    const curated = article.relatedSlugs
      .map((slug) => all.find((a) => a.slug === slug))
      .filter((a): a is KbArticle => Boolean(a));
    if (curated.length >= max) return curated.slice(0, max);
  }
  const remaining = max - (article.relatedSlugs.length || 0);
  if (remaining <= 0) return [];
  const tagSet = new Set(article.tags);
  const scored = all
    .filter(
      (a) =>
        a.slug !== article.slug && !article.relatedSlugs.includes(a.slug) && a.tags.some((t) => tagSet.has(t))
    )
    .map((a) => ({
      article: a,
      score: a.tags.filter((t) => tagSet.has(t)).length + (a.topic === article.topic ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((s) => s.article);
  const curated = article.relatedSlugs
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is KbArticle => Boolean(a));
  return [...curated, ...scored].slice(0, max);
});

export const getSearchEntries = cache((): KbSearchEntry[] =>
  getAllArticles().map((a) => ({
    title: a.title,
    topic: a.topic,
    topicTitle: a.topicTitle,
    slug: a.slug,
    summary: a.summary,
    tags: a.tags,
    excerpt: buildExcerpt(a.body),
    href: a.href,
  }))
);
