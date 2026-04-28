'use client';

/**
 * Lesson-screen mentor panel. Currently a placeholder: the shared <Chat>
 * is rendered in disabled mode with a curated set of suggested prompts.
 * Real backend wiring (useChat + transport) will go here in a follow-up,
 * mirroring the GenerateCourseScreen ChatPanel pattern.
 */

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Chat } from '@/components/Chat';
import * as S from './ChatPanel.styles';

interface ChatPanelProps {
  contextLabel?: string;
  onClose: () => void;
}

const PLACEHOLDER_PROMPTS = [
  'Explain this concept differently',
  'Quiz me on this lesson',
  'Give me a real-world example',
];

export const ChatPanel = ({ contextLabel, onClose }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <S.Container>
      <S.Header>
        <S.CollapseButton
          onClick={onClose}
          aria-label="Collapse mentor panel"
          title="Collapse (⌘\)"
        >
          <ChevronRight size={18} />
        </S.CollapseButton>
        <S.HeaderText>
          <S.HeaderEyebrow>Mentor</S.HeaderEyebrow>
          {contextLabel && <S.HeaderContext>{contextLabel}</S.HeaderContext>}
        </S.HeaderText>
      </S.Header>

      <S.Body>
        <Chat
          messages={[]}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={() => {}}
          suggestedPrompts={PLACEHOLDER_PROMPTS}
          placeholder="Coming soon..."
          disabled
        />
      </S.Body>
    </S.Container>
  );
};
