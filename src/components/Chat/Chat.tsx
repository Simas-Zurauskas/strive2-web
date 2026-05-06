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

import { ArrowDown, ArrowUp, Loader, Paperclip, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import * as S from './Chat.styles';
import { ChatMessage, ToolStatus } from './internal';
import type { ChatMessageData } from './types';

export interface AttachmentChipData {
  filename: string;
  approxTokens: number;
  /**
   * Optional. When set, the chip renders a spinner instead of the close
   * button — useful while extraction is in flight.
   */
  isLoading?: boolean;
}

export interface ChatProps {
  messages: ChatMessageData[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  suggestedPrompts?: readonly string[];
  onSuggestedPromptClick?: (prompt: string) => void;
  placeholder?: string;
  /** Disables both the input and any suggested-prompt buttons. */
  disabled?: boolean;
  /** Show typewriter effect on the latest assistant message. */
  isStreaming?: boolean;
  /** Render the "Thinking..." indicator below the latest message. */
  isThinking?: boolean;
  error?: string | null;
  /**
   * Currently-attached file metadata. When set, a chip renders above
   * the composer. When undefined, no chip + the paperclip is enabled.
   * Pass `isLoading` while extraction is in flight to suppress the
   * close button and show a spinner in its place.
   */
  attachment?: AttachmentChipData;
  /** Called when the learner picks a file via the paperclip. */
  onAttachFile?: (file: File) => void;
  /** Called when the learner removes the current attachment chip. */
  onRemoveAttachment?: () => void;
  /**
   * When set, replaces the send button with a stop button while a
   * response is streaming. Wire this to the AI SDK's `stop` callback.
   */
  onStop?: () => void;
  /**
   * Course slug from the surrounding panel. Threaded to ChatMessage
   * so `emit_handoff` tool results render as clickable navigation
   * buttons. Optional — surfaces without a course context (e.g. the
   * course-creation wizard) leave it undefined and any handoff
   * payload gracefully renders nothing.
   */
  courseSlug?: string;
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
  attachment,
  onAttachFile,
  onRemoveAttachment,
  onStop,
  courseSlug,
}: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gate the wrapper's visibility until use-stick-to-bottom has done its
  // initial scroll-to-bottom. The lib runs that scroll inside its own
  // requestAnimationFrame, so on mount with pre-populated messages
  // there's one paint frame where the scroll position is still 0 (top
  // of the conversation). Two rAFs is enough to be past that frame
  // without being long enough to feel like a delay (~32 ms).
  const [scrollSettled, setScrollSettled] = useState(false);
  useEffect(() => {
    let raf2: number | undefined;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setScrollSettled(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2 !== undefined) cancelAnimationFrame(raf2);
    };
  }, []);

  const handleAttachClick = () => {
    if (!onAttachFile || disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Always reset the input value so the same file can be re-picked
    // after removal (browsers suppress 'change' on identical re-pick).
    e.target.value = '';
    if (!file || !onAttachFile) return;
    onAttachFile(file);
  };

  const isAttaching = attachment?.isLoading === true;
  const attachmentReady = attachment !== undefined && !isAttaching;
  const canSend =
    !isStreaming &&
    !isThinking &&
    !isAttaching &&
    (inputValue.trim().length > 0 || attachmentReady);
  const showStop = (isStreaming || isThinking) && typeof onStop === 'function';

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
      if (canSend) onSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) onSubmit();
  };

  const showEmptyState =
    messages.length === 0 && suggestedPrompts && suggestedPrompts.length > 0;

  return (
    <S.Wrapper $scrollSettled={scrollSettled}>
      <S.ScrollArea>
        <StickToBottom style={{ height: '100%' }} resize="auto" initial="instant">
          <StickToBottom.Content>
            <S.Messages role="log" aria-live="polite" aria-relevant="additions">
              {showEmptyState && (
                <S.EmptyState>
                  <S.EmptyEyebrow>Try asking</S.EmptyEyebrow>
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
                    courseSlug={courseSlug}
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
        {attachment && (
          <S.AttachmentChip>
            <Paperclip size={12} />
            <S.AttachmentChipLabel title={attachment.filename}>
              {attachment.filename}
            </S.AttachmentChipLabel>
            {isAttaching ? (
              <S.AttachLoading>
                <Loader size={12} />
              </S.AttachLoading>
            ) : (
              <S.AttachmentChipClose
                type="button"
                onClick={onRemoveAttachment}
                aria-label="Remove attachment"
                title="Remove attachment"
              >
                <X size={12} />
              </S.AttachmentChipClose>
            )}
          </S.AttachmentChip>
        )}
        <form onSubmit={handleFormSubmit}>
          <S.InputRow>
            {onAttachFile && (
              <>
                <S.AttachButton
                  type="button"
                  onClick={handleAttachClick}
                  disabled={disabled || isAttaching || attachmentReady}
                  aria-label="Attach a file"
                  title={attachmentReady ? 'Remove the existing attachment first' : 'Attach a file'}
                >
                  <Paperclip size={16} />
                </S.AttachButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.md,.markdown,.json,.yml,.yaml,.toml,.xml,.csv,.js,.mjs,.cjs,.ts,.tsx,.jsx,.py,.go,.rs,.rb,.php,.swift,.kt,.java,.scala,.cs,.c,.h,.cc,.cpp,.hpp,.html,.htm,.css,.scss,.sh,.bash,.sql"
                />
              </>
            )}
            <S.ChatInput
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isBusy}
              rows={1}
            />
            {showStop ? (
              <S.StopButton
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </S.StopButton>
            ) : (
              <S.SendButton type="submit" disabled={!canSend}>
                {isStreaming || isThinking || isAttaching ? (
                  <S.LoaderIcon>
                    <Loader size={16} />
                  </S.LoaderIcon>
                ) : (
                  <ArrowUp size={16} />
                )}
              </S.SendButton>
            )}
          </S.InputRow>
        </form>
        {error && <S.ErrorText>{error}</S.ErrorText>}
      </S.InputArea>
    </S.Wrapper>
  );
};
