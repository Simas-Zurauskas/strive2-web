'use client';

/**
 * Floating help-center chat widget. Renders as a fixed FAB in the
 * bottom-right corner; clicking expands it into a 380×640 panel that
 * hosts the chat UI. Collapses back to the FAB without losing state —
 * messages live in `useChat` at this component's scope, so the
 * AnimatePresence cycle on the surface below doesn't tear them down.
 *
 * Mounted once at the help-section layout (`(public)/help/layout.tsx`)
 * so navigation between articles preserves the conversation. The chat
 * is fully public: anonymous visitors get the same surface signed-in
 * users do. Abuse is bounded by per-IP/per-user rate limiters on the
 * server route, not by an auth gate. When a session is present the
 * Authorization header is forwarded so server-side telemetry can bind
 * spend to the user; otherwise the request goes through anonymously.
 */

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { Chat, type ChatMessageData } from '@/components/Chat';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import * as S from './KbChatPanel.styles';

const SUGGESTED_PROMPTS = [
  'What is Strive?',
  'How does spaced review work?',
  'What plans and pricing do you offer?',
  'How do I create my first course?',
];

const widgetMotion = {
  initial: { opacity: 0, scale: 0.85, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 8 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
};

const fabMotion = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7 },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
};

export const KbChatPanel = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Live chat state. Hosted at the panel level so collapsing the widget
  // (and even navigating between /help articles when this is mounted at
  // the help layout) preserves the conversation. The transport rebuilds
  // when the auth token changes — sign-in/sign-out shifts identity but
  // not chat capability, since the route is public either way.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${NEXT_PUBLIC_API_URL}/api/product-kb/chat`,
        headers: () => {
          // Forward the bearer only when a real session exists; the server
          // treats absence as "anonymous visitor" rather than failing auth.
          const h: Record<string, string> = {};
          if (session?.token) h.Authorization = `Bearer ${session.token}`;
          return h;
        },
      }),
    [session?.token],
  );

  const chat = useChat({
    id: 'product-kb-chat',
    transport,
    onError: (err) => {
      console.error('[KbChatPanel] onError —', err);
    },
  });

  return (
    <S.Root>
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div key="widget" {...widgetMotion} style={{ transformOrigin: 'bottom right' }}>
            <ExpandedPanel onClose={() => setOpen(false)} chat={chat} />
          </motion.div>
        ) : (
          <motion.div key="fab" {...fabMotion} style={{ transformOrigin: 'bottom right' }}>
            <S.Fab type="button" onClick={() => setOpen(true)} aria-label="Open the Strive guide chat">
              <Sparkles size={18} strokeWidth={2} />
              <S.FabLabel>Ask the guide</S.FabLabel>
            </S.Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </S.Root>
  );
};

interface ExpandedPanelProps {
  onClose: () => void;
  chat: ReturnType<typeof useChat>;
}

const ExpandedPanel = ({ onClose, chat }: ExpandedPanelProps) => (
  <S.Widget role="dialog" aria-label="Strive guide chat">
    <S.Header>
      <S.HeaderAvatar aria-hidden="true">
        <MessageCircle size={16} strokeWidth={1.75} />
      </S.HeaderAvatar>
      <S.HeaderText>
        <S.HeaderTitle>Strive guide</S.HeaderTitle>
      </S.HeaderText>
      <S.HeaderAction type="button" onClick={onClose} aria-label="Minimize chat" title="Minimize">
        <ChevronDown size={18} />
      </S.HeaderAction>
    </S.Header>
    <S.Body>
      <ChatBody chat={chat} />
    </S.Body>
    <S.Footnote>Chats aren&rsquo;t saved between sessions.</S.Footnote>
  </S.Widget>
);

interface ChatBodyProps {
  chat: ReturnType<typeof useChat>;
}

const ChatBody = ({ chat }: ChatBodyProps) => {
  const { messages, sendMessage, status, error, stop } = chat;
  const [inputValue, setInputValue] = useState('');

  const isStreaming = status === 'streaming';
  const isThinking = status === 'submitted';

  const chatMessages: ChatMessageData[] = useMemo(
    () => messages.map((m: UIMessage) => uiMessageToChatData(m)),
    [messages],
  );

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue('');
    sendMessage({ text: trimmed });
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    setInputValue('');
    sendMessage({ text: prompt });
  };

  return (
    <Chat
      messages={chatMessages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      onSuggestedPromptClick={handleSuggestedPromptClick}
      suggestedPrompts={SUGGESTED_PROMPTS}
      placeholder="Ask about Strive..."
      isStreaming={isStreaming}
      isThinking={isThinking}
      error={error?.message ?? null}
      onStop={stop}
    />
  );
};

const uiMessageToChatData = (m: UIMessage): ChatMessageData => {
  const text =
    m.parts
      ?.filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
      .map((p) => p.text)
      .join('') ?? '';
  const tools =
    m.parts
      ?.filter((p): p is Extract<typeof p, { type: 'dynamic-tool' }> => p.type === 'dynamic-tool')
      .map((p) => ({
        toolName: p.toolName,
        state: p.state,
        output: 'output' in p ? (p as { output?: unknown }).output : undefined,
      })) ?? [];
  return {
    id: m.id,
    role: m.role,
    content: text,
    toolInvocations: tools,
  };
};
