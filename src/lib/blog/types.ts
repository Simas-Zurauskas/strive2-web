// Blog content types. Mirrors lib/kb in shape — frontmatter + body, validated
// at load time. Posts live in client/src/content/blog/<slug>.md.

export type BlogCategory =
  | 'learning-science'
  | 'engineering'
  | 'product'
  | 'guide';

export interface BlogFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: BlogCategory;
  author: string;
  published: string;
  updated?: string;
  tags?: string[];
  featured?: boolean;
  hero?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  category: BlogCategory;
  categoryLabel: string;
  author: string;
  published: string;
  updated?: string;
  tags: string[];
  featured: boolean;
  hero?: string;
  body: string;
  href: string;
  readTimeMinutes: number;
  contentHash: string;
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  'learning-science': 'Learning science',
  engineering: 'Engineering',
  product: 'Product',
  guide: 'Guide',
};

export const BLOG_CATEGORY_ORDER: readonly BlogCategory[] = [
  'learning-science',
  'engineering',
  'product',
  'guide',
];
