import type { KbTopic } from './types';

type TopicConfig = Pick<KbTopic, 'slug' | 'title' | 'summary' | 'icon' | 'order'>;

export const KB_TOPICS: TopicConfig[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'What Strive is and how to build your first course in five minutes.',
    icon: 'Sparkles',
    order: 10,
  },
  {
    slug: 'how-strive-teaches',
    title: 'How Strive teaches',
    summary:
      'The teaching ideas behind the platform — spaced review, retrieval practice, mastery, and the rhythm of daily progress.',
    icon: 'BrainCircuit',
    order: 20,
  },
  {
    slug: 'building-and-studying',
    title: 'Building courses & studying lessons',
    summary:
      'How the wizard shapes your curriculum, what a generated lesson looks like, and how to make the most of both.',
    icon: 'BookOpen',
    order: 30,
  },
  {
    slug: 'plans-and-account',
    title: 'Plans, billing & account',
    summary: 'Pricing, the allowance system, top-ups, your privacy, and account controls.',
    icon: 'Wallet',
    order: 40,
  },
  {
    slug: 'legal',
    title: 'Legal',
    summary: 'Privacy policy and terms of service — the contract and data-handling rules between you and Strive.',
    icon: 'Scale',
    order: 90,
  },
];

export const getTopicConfig = (slug: string): TopicConfig | undefined =>
  KB_TOPICS.find((t) => t.slug === slug);
