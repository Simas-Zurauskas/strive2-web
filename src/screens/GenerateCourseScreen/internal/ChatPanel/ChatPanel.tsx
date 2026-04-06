'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { DefaultChatTransport } from 'ai';
import { ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { toast } from 'sonner';
import { getChatHistory } from '@/api/routes/course';
import { TOASTS } from '@/constants/toasts';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import * as S from './ChatPanel.styles';
import { ChatMessage, ToolStatus } from './internal';

interface ChatPanelProps {
  courseId: string;
  onStructureModified: () => void;
  onModifying?: (active: boolean) => void;
}

const SUGGESTED_PROMPTS = ['Why this module order?', 'Add more practical exercises', 'Skip the basics, I know them'];

let idCounter = 0;
const nextId = () => `history-${++idCounter}`;

/** Scroll-to-bottom button — uses StickToBottom context, isolated from parent renders. */
const ScrollDownBtn = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <S.ScrollDownButton onClick={() => scrollToBottom()} aria-label="Scroll to bottom">
      <ArrowDown size={14} />
    </S.ScrollDownButton>
  );
};

/** Outer wrapper — fetches history, then mounts the chat once ready. */
export const ChatPanel = ({ courseId, onStructureModified, onModifying }: ChatPanelProps) => {
  const { data: session } = useSession();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    if (!session?.token) return;

    getChatHistory(courseId)
      .then(({ messages }) => {
        if (messages.length > 0) {
          const uiMessages: UIMessage[] = messages.map((m) => ({
            id: nextId(),
            role: (m.role ?? 'user') as 'user' | 'assistant',
            parts: [{ type: 'text' as const, text: m.content ?? '' }],
          }));
          setInitialMessages(uiMessages);
        }
      })
      .catch((err) => {
        console.error('[ChatPanel] Failed to load chat history:', err);
        toast.error(TOASTS.CHAT_HISTORY_ERROR);
      })
      .finally(() => {
        setHistoryLoaded(true);
      });
  }, [courseId, session?.token]);

  if (!historyLoaded) {
    return (
      <S.Container>
        <S.ChatScrollArea>
          <S.MessagesArea>
            <ToolStatus status="thinking" />
          </S.MessagesArea>
        </S.ChatScrollArea>
      </S.Container>
    );
  }

  return (
    <ChatPanelInner
      courseId={courseId}
      onStructureModified={onStructureModified}
      onModifying={onModifying}
      initialMessages={initialMessages ?? undefined}
    />
  );
};

/** Inner chat — only mounts after history is resolved, so useChat gets correct initial messages. */
const ChatPanelInner = ({
  courseId,
  onStructureModified,
  onModifying,
  initialMessages,
}: ChatPanelProps & { initialMessages?: UIMessage[] }) => {
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${NEXT_PUBLIC_API_URL}/api/course/${courseId}/chat`,
        headers: () => ({
          Authorization: `Bearer ${session?.token ?? ''}`,
        }),
      }),
    [courseId, session?.token],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `course-design-${courseId}`,
    transport,
    ...(initialMessages ? { messages: initialMessages } : {}),
    onFinish: ({ message }) => {
      const modified = message.parts?.some((p) => {
        const raw = p as Record<string, unknown>;
        return (
          String(raw.type ?? '').includes('modify_structure') || String(raw.toolName ?? '').includes('modify_structure')
        );
      });
      if (modified) {
        onStructureModified();

        // Check if modify_structure cleared existing content/progress
        const clearedContent = message.parts?.some((p) => {
          if (p.type !== 'dynamic-tool' || p.toolName !== 'modify_structure') return false;
          if (p.state !== 'output-available') return false;
          try {
            const output = JSON.parse(String((p as Record<string, unknown>).output ?? '{}'));
            return output.contentCleared === true;
          } catch {
            return false;
          }
        });
        if (clearedContent) {
          toast.info(TOASTS.CONTENT_RESET);
        }
      }
    },
    onError: (err) => {
      console.error('[ChatPanel] onError —', err);
    },
  });

  // Fallback: when streaming ends, check if any message has modify_structure tool
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === 'streaming' && status === 'ready') {
      const hasModify = messages.some((m) =>
        m.parts?.some((p) => {
          if (p.type === 'dynamic-tool' && p.toolName === 'modify_structure') return true;
          if ('type' in p && typeof p.type === 'string' && p.type.startsWith('tool-') && 'toolCallId' in p) {
            return String((p as Record<string, unknown>).toolName ?? '').includes('modify_structure');
          }
          return false;
        }),
      );
      if (hasModify) {
        onStructureModified();
      }
    }
    prevStatus.current = status;
  }, [status, messages, onStructureModified]);

  // Notify parent when modify_structure tool is active
  useEffect(() => {
    const hasActiveTool = messages.some((m) =>
      m.parts?.some(
        (p) => p.type === 'dynamic-tool' && p.toolName === 'modify_structure' && p.state !== 'output-available',
      ),
    );
    onModifying?.(hasActiveTool);
  }, [messages, onModifying]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [inputValue]);

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';
  const isBusy = isStreaming || isSubmitted;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isBusy) return;
    sendMessage({ text: inputValue.trim() });
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <S.Container>
      <S.ChatScrollArea>
        <StickToBottom style={{ height: '100%' }} resize="auto" initial="instant">
          <StickToBottom.Content>
            <S.MessagesArea>
              {messages.length === 0 && (
                <S.EmptyState>
                  <S.SuggestedPrompts>
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <S.SuggestedPrompt key={prompt} type="button" onClick={() => handleSuggestedPrompt(prompt)}>
                        {prompt}
                      </S.SuggestedPrompt>
                    ))}
                  </S.SuggestedPrompts>
                </S.EmptyState>
              )}
              {messages.map((message, idx) => {
                const textContent = message.parts
                  ?.filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
                  .map((p) => p.text)
                  .join('');

                const toolParts = message.parts
                  ?.filter((p): p is Extract<typeof p, { type: 'dynamic-tool' }> => p.type === 'dynamic-tool')
                  .map((p) => ({ toolName: p.toolName, state: p.state }));

                const isLastAssistant = isStreaming && message.role === 'assistant' && idx === messages.length - 1;

                return (
                  <ChatMessage
                    key={message.id}
                    isStreaming={isLastAssistant}
                    message={{
                      id: message.id,
                      role: message.role,
                      content: textContent || '',
                      toolInvocations: toolParts,
                    }}
                  />
                );
              })}
              {isSubmitted && <ToolStatus status="thinking" />}
            </S.MessagesArea>
          </StickToBottom.Content>
          <ScrollDownBtn />
        </StickToBottom>
      </S.ChatScrollArea>

      <S.InputArea>
        <form onSubmit={handleSubmit}>
          <S.InputRow>
            <S.ChatInput
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the structure or request changes..."
              disabled={isBusy}
              rows={1}
            />
            <S.SendButton type="submit" disabled={!inputValue.trim() || isBusy}>
              {isBusy ? (
                <S.LoaderIcon>
                  <Loader size={16} />
                </S.LoaderIcon>
              ) : (
                <ArrowUp size={16} />
              )}
            </S.SendButton>
          </S.InputRow>
        </form>
        {error && <S.ErrorText>{error.message}</S.ErrorText>}
      </S.InputArea>
    </S.Container>
  );
};
