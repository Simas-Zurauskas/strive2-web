export interface KbFrontmatter {
  title: string;
  slug: string;
  topic: string;
  summary: string;
  tags?: string[];
  order?: number;
  updated?: string;
  related?: string[];
}

export interface KbArticle {
  title: string;
  slug: string;
  topic: string;
  topicTitle: string;
  summary: string;
  tags: string[];
  order: number;
  updated?: string;
  relatedSlugs: string[];
  body: string;
  href: string;
  contentHash: string;
}

export interface KbTopic {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  order: number;
  href: string;
  articleCount: number;
}

export interface KbSearchEntry {
  title: string;
  topic: string;
  topicTitle: string;
  slug: string;
  summary: string;
  tags: string[];
  excerpt: string;
  href: string;
}
