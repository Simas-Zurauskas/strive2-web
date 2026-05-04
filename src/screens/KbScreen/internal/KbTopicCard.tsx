import * as S from '../KbScreen.styles';
import type { KbTopic } from '@/lib/kb';

interface KbTopicCardProps {
  topic: KbTopic;
}

export const KbTopicCard = ({ topic }: KbTopicCardProps) => {
  const articleLabel =
    topic.articleCount === 0
      ? 'Soon'
      : `${topic.articleCount} article${topic.articleCount === 1 ? '' : 's'}`;
  return (
    <S.TopicCardLink href={topic.href}>
      <S.TopicCardHead>
        <S.TopicCardTitle>{topic.title}</S.TopicCardTitle>
        <S.TopicCardCount>{articleLabel}</S.TopicCardCount>
      </S.TopicCardHead>
      <S.TopicCardSummary>{topic.summary}</S.TopicCardSummary>
      {topic.articleCount > 0 && <S.TopicCardArrow>Browse →</S.TopicCardArrow>}
    </S.TopicCardLink>
  );
};
