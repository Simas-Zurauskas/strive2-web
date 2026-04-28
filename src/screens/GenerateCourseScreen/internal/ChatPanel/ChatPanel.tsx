'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { DefaultChatTransport } from 'ai';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getChatHistory } from '@/api/routes/course';
import { Chat } from '@/components/Chat';
import type { ChatMessageData } from '@/components/Chat';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { TOASTS } from '@/constants/toasts';
import * as S from './ChatPanel.styles';

interface ChatPanelProps {
  courseId: string;
  onStructureModified: () => void;
  onModifying?: (active: boolean) => void;
}

const SUGGESTED_PROMPTS = [
  'Why this module order?',
  'Add more practical exercises',
  'Skip the basics, I know them',
];

let idCounter = 0;
const nextId = () => `history-${++idCounter}`;

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
        <Chat
          messages={[]}
          inputValue=""
          onInputChange={() => {}}
          onSubmit={() => {}}
          isThinking
          disabled
          placeholder="Loading chat..."
        />
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
          String(raw.type ?? '').includes('modify_structure') ||
          String(raw.toolName ?? '').includes('modify_structure')
        );
      });
      if (modified) {
        onStructureModified();

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
          if (
            'type' in p &&
            typeof p.type === 'string' &&
            p.type.startsWith('tool-') &&
            'toolCallId' in p
          ) {
            return String((p as Record<string, unknown>).toolName ?? '').includes(
              'modify_structure',
            );
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
        (p) =>
          p.type === 'dynamic-tool' &&
          p.toolName === 'modify_structure' &&
          p.state !== 'output-available',
      ),
    );
    onModifying?.(hasActiveTool);
  }, [messages, onModifying]);

  // Project AI SDK messages into the shared Chat shape
  const chatMessages: ChatMessageData[] = useMemo(
    () =>
      messages.map((m) => {
        const text = m.parts
          ?.filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
          .map((p) => p.text)
          .join('') ?? '';
        const tools =
          m.parts
            ?.filter((p): p is Extract<typeof p, { type: 'dynamic-tool' }> => p.type === 'dynamic-tool')
            .map((p) => ({ toolName: p.toolName, state: p.state })) ?? [];
        return {
          id: m.id,
          role: m.role,
          content: text,
          toolInvocations: tools,
        };
      }),
    [messages],
  );

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (!value) return;
    sendMessage({ text: value });
    setInputValue('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  return (
    <S.Container>
      <Chat
        messages={chatMessages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        suggestedPrompts={SUGGESTED_PROMPTS}
        onSuggestedPromptClick={handleSuggestedPrompt}
        placeholder="Ask about the structure or request changes..."
        isStreaming={isStreaming}
        isThinking={isSubmitted}
        error={error?.message ?? null}
      />
    </S.Container>
  );
};
