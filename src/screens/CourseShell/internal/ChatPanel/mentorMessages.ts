import type { ChatMessageAttachment, ChatMessageData } from '@/components/Chat';
import type { UIMessage } from 'ai';

interface PersistedMessage {
  role?: string;
  content?: string | null;
  attachments?: { attachmentId: string }[];
  handoffs?: unknown;
}

/**
 * Convert a persisted chat-history message into UIMessage parts so
 * `useChat` rehydrates with the same shape it would have produced from
 * a live SSE stream. Crucially this synthesises a `dynamic-tool` part
 * for every persisted handoff — without it, reload would show the
 * assistant's text but no HandoffButton.
 */
export const buildPartsFromPersistedMessage = (msg: PersistedMessage, messageId: string): UIMessage['parts'] => {
  const parts: UIMessage['parts'] = [{ type: 'text' as const, text: msg.content ?? '' }];
  const persistedHandoffs = msg.handoffs;
  if (Array.isArray(persistedHandoffs)) {
    persistedHandoffs.forEach((h, idx) => {
      if (!h || typeof h !== 'object') return;
      parts.push({
        type: 'dynamic-tool' as const,
        toolCallId: `restored-handoff-${messageId}-${idx}`,
        toolName: 'emit_handoff',
        state: 'output-available',
        input: undefined,
        output: { ok: true, ...(h as Record<string, unknown>) },
      } as UIMessage['parts'][number]);
    });
  }
  return parts;
};

/**
 * Convert UIMessages from `useChat` into the panel's ChatMessageData
 * shape. Both lesson and course panels do this identically — only the
 * lesson panel additionally attaches per-message file chips, so the
 * attachments map is optional.
 */
export const uiMessagesToChatData = (
  messages: UIMessage[],
  attachmentsByMessageId?: Record<string, ChatMessageAttachment[]>,
): ChatMessageData[] =>
  messages.map((m) => {
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
    const messageAttachments = m.role === 'user' ? attachmentsByMessageId?.[m.id] : undefined;
    return {
      id: m.id,
      role: m.role,
      content: text,
      toolInvocations: tools,
      attachments: messageAttachments,
    };
  });
