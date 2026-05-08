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
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { Chat, type ChatMessageData } from '@/components/Chat';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import * as S from './KbChatPanel.styles';

const DEFAULT_SUGGESTED_PROMPTS = [
  'What is Strive?',
  'How does spaced review work?',
  'What plans and pricing do you offer?',
  'How do I create my first course?',
];

const widgetMotionFull = {
  initial: { opacity: 0, scale: 0.85, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 8 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
};

const fabMotionFull = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7 },
  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
};

// prefers-reduced-motion: drop the scale/translate transforms and shrink
// the duration. Opacity-only transitions are exempt from the WCAG 2.3.3
// concern (no parallax / vestibular triggers).
const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
};

interface KbChatPanelProps {
  // Override the default suggested prompt set when the chat is mounted
  // outside the help center — e.g. on the landing page, where prompts
  // should reflect first-visitor concerns rather than help-center context.
  suggestedPrompts?: readonly string[];
}

export const KbChatPanel = ({ suggestedPrompts }: KbChatPanelProps = {}) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const prompts = suggestedPrompts ?? DEFAULT_SUGGESTED_PROMPTS;
  const prefersReduced = useReducedMotion() ?? false;
  const widgetMotion = prefersReduced ? reducedMotion : widgetMotionFull;
  const fabMotion = prefersReduced ? reducedMotion : fabMotionFull;

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
    // Depend on the whole `session` rather than just `session?.token` —
    // React Compiler infers the broader capture from the closure (the
    // header builder reads `session?.token` through `session`), and
    // mismatching the dep keeps the compiler from optimizing this hook.
    // The reference identity of `session` shifts on token rotation
    // anyway, so this rebuilds the transport at the same cadence.
    [session],
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
            <ExpandedPanel onClose={() => setOpen(false)} chat={chat} prompts={prompts} />
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
  prompts: readonly string[];
}

const ExpandedPanel = ({ onClose, chat, prompts }: ExpandedPanelProps) => (
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
      <ChatBody chat={chat} prompts={prompts} />
    </S.Body>
  </S.Widget>
);

interface ChatBodyProps {
  chat: ReturnType<typeof useChat>;
  prompts: readonly string[];
}

const ChatBody = ({ chat, prompts }: ChatBodyProps) => {
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
      suggestedPrompts={prompts}
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
