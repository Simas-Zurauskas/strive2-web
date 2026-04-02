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
        <S.Title>AI Mentor</S.Title>
        <S.CloseButton onClick={onClose} aria-label="Close chat">
          &times;
        </S.CloseButton>
      </S.Header>

      <S.Messages>
        <S.ContextBadge>Lesson: {lessonName}</S.ContextBadge>
        <S.PlaceholderMessage>
          Ask me anything about this lesson. I can explain concepts, give examples, quiz you, or help you work through exercises.
        </S.PlaceholderMessage>
      </S.Messages>

      <S.InputArea>
        <S.Input
          type="text"
          placeholder="Ask a question..."
          disabled
        />
      </S.InputArea>
    </S.Container>
  );
};
