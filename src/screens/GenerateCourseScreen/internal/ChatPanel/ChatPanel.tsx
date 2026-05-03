'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { DefaultChatTransport } from 'ai';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getChatHistory } from '@/api/routes/course';
import { Chat } from '@/components/Chat';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { TOASTS } from '@/constants/toasts';
import * as S from './ChatPanel.styles';
import type { ChatMessageData } from '@/components/Chat';

interface ChatPanelProps {
  courseId: string;
  onStructureModified: () => void;
  onModifying?: (active: boolean) => void;
}

/**
 * Last-resort fallback if the server response somehow omits
 * `suggestedPrompts` (e.g. very old API). The server itself returns its
 * own hardcoded fallback when the dynamic generator hasn't run, so this
 * client-side array should almost never be used in practice. Kept short
 * + generic enough to be useful even with no course context.
 */
const FALLBACK_SUGGESTED_PROMPTS = [
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
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(FALLBACK_SUGGESTED_PROMPTS);
  // Bumped after each modify_structure tool run so the inner panel
  // refetches the chat history → picks up the regenerated suggested
  // prompts. Background regeneration on the server may take ~1-2s, so
  // there's an inherent staleness window the user may notice; that's
  // acceptable because the chat is mid-conversation and the prompts
  // are an empty-state aid.
  const [refetchTick, setRefetchTick] = useState(0);

  useEffect(() => {
    if (!session?.token) return;

    getChatHistory(courseId)
      .then((data) => {
        const { messages } = data;
        if (messages.length > 0) {
          const uiMessages: UIMessage[] = messages.map((m) => ({
            id: nextId(),
            role: (m.role ?? 'user') as 'user' | 'assistant',
            parts: [{ type: 'text' as const, text: m.content ?? '' }],
          }));
          setInitialMessages(uiMessages);
        }
        // `suggestedPrompts` is a new server field; tolerate older
        // codegen output by reading defensively. Falls back to the
        // hardcoded array when missing or empty.
        const serverPrompts = (data as { suggestedPrompts?: unknown }).suggestedPrompts;
        if (Array.isArray(serverPrompts) && serverPrompts.length > 0) {
          setSuggestedPrompts(serverPrompts.filter((p): p is string => typeof p === 'string'));
        }
      })
      .catch((err) => {
        console.error('[ChatPanel] Failed to load chat history:', err);
        toast.error(TOASTS.CHAT_HISTORY_ERROR);
      })
      .finally(() => {
        setHistoryLoaded(true);
      });
  }, [courseId, session?.token, refetchTick]);

  // Refresh the suggested prompts after each structure modification.
  // We wrap the parent's onStructureModified so the chat panel
  // independently refetches without coupling to the parent's state.
  const handleStructureModified = () => {
    onStructureModified();
    // Small delay so the server-side background regeneration has time
    // to land before we refetch. Not foolproof — the regen may still
    // be in-flight — but the client UX degrades gracefully (stays on
    // the last set of prompts until the next refetch).
    setTimeout(() => setRefetchTick((n) => n + 1), 2000);
  };

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
      onStructureModified={handleStructureModified}
      onModifying={onModifying}
      initialMessages={initialMessages ?? undefined}
      suggestedPrompts={suggestedPrompts}
    />
  );
};

/** Inner chat — only mounts after history is resolved, so useChat gets correct initial messages. */
const ChatPanelInner = ({
  courseId,
  onStructureModified,
  onModifying,
  initialMessages,
  suggestedPrompts,
}: ChatPanelProps & { initialMessages?: UIMessage[]; suggestedPrompts: string[] }) => {
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
        suggestedPrompts={suggestedPrompts}
        onSuggestedPromptClick={handleSuggestedPrompt}
        placeholder="Ask about the structure or request changes..."
        isStreaming={isStreaming}
        isThinking={isSubmitted}
        error={error?.message ?? null}
      />
    </S.Container>
  );
};
