import {
  BookOpen,
  BrainCircuit,
  Sparkles,
  Trophy,
  UserCog,
  Wallet,
  Wand2,
  type LucideIcon,
} from 'lucide-react';
import * as S from '../KbScreen.styles';
import type { KbTopic } from '@/lib/kb';

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  BrainCircuit,
  Sparkles,
  Trophy,
  UserCog,
  Wallet,
  Wand2,
};

interface KbTopicCardProps {
  topic: KbTopic;
}

export const KbTopicCard = ({ topic }: KbTopicCardProps) => {
  const Icon = ICONS[topic.icon] ?? Sparkles;
  return (
    <S.TopicCardLink href={topic.href}>
      <S.TopicCardIconWrap aria-hidden="true">
        <Icon size={20} strokeWidth={1.5} />
      </S.TopicCardIconWrap>
      <S.TopicCardTitle>{topic.title}</S.TopicCardTitle>
      <S.TopicCardSummary>{topic.summary}</S.TopicCardSummary>
      <S.TopicCardCount>
        {topic.articleCount === 0
          ? 'Coming soon'
          : `${topic.articleCount} article${topic.articleCount === 1 ? '' : 's'}`}
      </S.TopicCardCount>
    </S.TopicCardLink>
  );
};
