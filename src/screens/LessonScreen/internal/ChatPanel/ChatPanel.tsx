'use client';

import * as S from './ChatPanel.styles';

interface ChatPanelProps {
  lessonName: string;
  onClose: () => void;
}

export const ChatPanel = ({ lessonName, onClose }: ChatPanelProps) => {
  return (
    <S.Container>
      <S.Header>
        <S.MentorAvatar>AI</S.MentorAvatar>
        <S.HeaderInfo>
          <S.Title>AI Mentor</S.Title>
          <S.StatusBadge>Ready</S.StatusBadge>
        </S.HeaderInfo>
        <S.CloseButton onClick={onClose} aria-label="Close chat">
          &times;
        </S.CloseButton>
      </S.Header>

      <S.Messages>
        <S.ContextBadge>Lesson: {lessonName}</S.ContextBadge>
        <S.PlaceholderMessage>
          Ask me anything about this lesson. I can explain concepts, give examples, or help you work through exercises.
        </S.PlaceholderMessage>
        <S.SuggestedPrompts>
          <S.PromptChip disabled>Explain the key concepts</S.PromptChip>
          <S.PromptChip disabled>Give me an example</S.PromptChip>
          <S.PromptChip disabled>Quiz me on this</S.PromptChip>
        </S.SuggestedPrompts>
      </S.Messages>

      <S.InputArea>
        <S.Input
          type="text"
          placeholder="Ask the mentor..."
          disabled
        />
      </S.InputArea>
    </S.Container>
  );
};
