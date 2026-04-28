'use client';

/**
 * Presentational chat surface — renders messages, an empty state with
 * suggested prompts, a tool-status indicator, and a composer (textarea +
 * send button). NO data fetching or `useChat` wiring inside; consumers
 * own that. Pass messages/state/handlers in via props.
 *
 * Used by:
 *  - GenerateCourseScreen course-creation chat (real backend)
 *  - CourseShell lesson-screen mentor panel (placeholder, until wired)
 */

import { ArrowDown, ArrowUp, Loader } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import * as S from './Chat.styles';
import { ChatMessage, ToolStatus } from './internal';
import type { ChatMessageData } from './types';

export interface ChatProps {
  messages: ChatMessageData[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  suggestedPrompts?: string[];
  onSuggestedPromptClick?: (prompt: string) => void;
  placeholder?: string;
  /** Disables both the input and any suggested-prompt buttons. */
  disabled?: boolean;
  /** Show typewriter effect on the latest assistant message. */
  isStreaming?: boolean;
  /** Render the "Thinking..." indicator below the latest message. */
  isThinking?: boolean;
  error?: string | null;
}

const ScrollDownBtn = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <S.ScrollDownButton onClick={() => scrollToBottom()} aria-label="Scroll to bottom">
      <ArrowDown size={14} />
    </S.ScrollDownButton>
  );
};

export const Chat = ({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  suggestedPrompts,
  onSuggestedPromptClick,
  placeholder = 'Ask anything...',
  disabled = false,
  isStreaming = false,
  isThinking = false,
  error,
}: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [inputValue]);

  const isBusy = disabled || isStreaming || isThinking;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isBusy && inputValue.trim()) onSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBusy && inputValue.trim()) onSubmit();
  };

  const showEmptyState =
    messages.length === 0 && suggestedPrompts && suggestedPrompts.length > 0;

  return (
    <S.Wrapper>
      <S.ScrollArea>
        <StickToBottom style={{ height: '100%' }} resize="auto" initial="instant">
          <StickToBottom.Content>
            <S.Messages>
              {showEmptyState && (
                <S.EmptyState>
                  <S.SuggestedPrompts>
                    {suggestedPrompts!.map((prompt) => (
                      <S.SuggestedPrompt
                        key={prompt}
                        type="button"
                        onClick={() => onSuggestedPromptClick?.(prompt)}
                        disabled={disabled || !onSuggestedPromptClick}
                      >
                        {prompt}
                      </S.SuggestedPrompt>
                    ))}
                  </S.SuggestedPrompts>
                </S.EmptyState>
              )}
              {messages.map((message, idx) => {
                const isLastAssistant =
                  isStreaming && message.role === 'assistant' && idx === messages.length - 1;
                return (
                  <ChatMessage
                    key={message.id}
                    isStreaming={isLastAssistant}
                    message={message}
                  />
                );
              })}
              {isThinking && <ToolStatus status="thinking" />}
            </S.Messages>
          </StickToBottom.Content>
          <ScrollDownBtn />
        </StickToBottom>
      </S.ScrollArea>

      <S.InputArea>
        <form onSubmit={handleFormSubmit}>
          <S.InputRow>
            <S.ChatInput
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isBusy}
              rows={1}
            />
            <S.SendButton type="submit" disabled={!inputValue.trim() || isBusy}>
              {isStreaming || isThinking ? (
                <S.LoaderIcon>
                  <Loader size={16} />
                </S.LoaderIcon>
              ) : (
                <ArrowUp size={16} />
              )}
            </S.SendButton>
          </S.InputRow>
        </form>
        {error && <S.ErrorText>{error}</S.ErrorText>}
      </S.InputArea>
    </S.Wrapper>
  );
};
