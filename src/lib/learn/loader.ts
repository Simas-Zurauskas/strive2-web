import { LEARN_TOPICS } from './topics';
import type { LearnTopic } from './types';

export const getAllLearnTopics = (): readonly LearnTopic[] => LEARN_TOPICS;

export const getLearnTopic = (slug: string): LearnTopic | undefined =>
  LEARN_TOPICS.find((t) => t.slug === slug);

export const getLearnTopicSlugs = (): string[] => LEARN_TOPICS.map((t) => t.slug);
