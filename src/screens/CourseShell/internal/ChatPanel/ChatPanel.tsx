'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage, DefaultChatTransport } from 'ai';
import { ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { attachAttachment } from '@/api/routes/attachment';
import {
  clearLessonChat,
  getLessonChatHistory,
  lessonMentorChatUrl,
  clearCourseMentor,
  getCourseMentorHistory,
  courseMentorChatUrl,
} from '@/api/routes/course';
import { Chat } from '@/components/Chat';
import { HelpAnchor } from '@/components/HelpAnchor';
import { TOASTS } from '@/constants/toasts';
import { useJobManager } from '@/hooks/useJobManager';
import { useLessonContent } from '@/hooks/useLessonContent';
import { analytics } from '@/lib/analytics';
import { creditAwareFetch } from '@/lib/creditAwareFetch';
import { isInsufficientCreditsError } from '@/lib/insufficientCreditsError';
import * as S from './ChatPanel.styles';
import { buildPartsFromPersistedMessage, uiMessagesToChatData } from './mentorMessages';
import type { AttachmentChipData, ChatMessageAttachment, ChatMessageData } from '@/components/Chat';

interface ChatPanelProps {
  contextLabel?: string;
  courseSlug: string;
  moduleIndex?: number;
  lessonIndex?: number;
  onClose: () => void;
}

let idCounter = 0;
const nextId = () => `history-${++idCounter}`;

/**
 * Header overflow menu — tucks the destructive "Clear chat history"
 * action behind a kebab `⋮` so it can't be hit accidentally from the
 * navigation row. Sits in the same header slot that previously held a
 * bare trash icon; the indirection makes the destructive choice
 * require intent (open menu → pick option) without burying it.
 *
 * Rendered via React portal to escape the chat-panel header's
 * `overflow: hidden` (which was added to clamp long lesson titles).
 * Without the portal the popover would be clipped just below the
 * header bottom edge. We compute the trigger's bounding rect on open
 * and on resize/scroll to keep the popover anchored to the trigger's
 * right edge.
 *
 * Closes on:
 *   - click outside the menu
 *   - Escape key
 *   - selecting an item
 *   - scroll outside the panel (popover would otherwise drift)
 */
const HeaderMenu = ({
  onClear,
  disabled,
  ariaLabel,
}: {
  onClear: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

  // Compute the popover position from the trigger rect. Right-aligned
  // to the trigger so the menu opens leftward from the kebab — matches
  // the natural reading flow and keeps the menu inside the panel.
  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  // Position on open (and re-position when the trigger moves due to
  // scroll/resize). `useLayoutEffect` so the popover mounts in the
  // right place rather than flashing at 0,0 first.
  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const reposition = () => updatePosition();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <S.HeaderMenuRoot>
      <S.HeaderMenuTrigger
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
      >
        <MoreVertical size={16} />
      </S.HeaderMenuTrigger>
      {open && portalTarget && position
        ? createPortal(
            <S.HeaderMenuPopover
              ref={popoverRef}
              role="menu"
              style={{ top: position.top, right: position.right }}
            >
              <S.HeaderMenuItem
                role="menuitem"
                type="button"
                onClick={() => {
                  setOpen(false);
                  onClear();
                }}
                disabled={disabled}
              >
                <Trash2 size={14} strokeWidth={2} />
                Clear chat history
              </S.HeaderMenuItem>
            </S.HeaderMenuPopover>,
            portalTarget,
          )
        : null}
    </S.HeaderMenuRoot>
  );
};

/**
 * Top-level dispatcher. Two scopes share the same panel chrome:
 *   - Lesson scope: renders `LessonChatPanel` (the existing
 *     content-grounded mentor) when both `moduleIndex` and `lessonIndex`
 *     are set — i.e. the learner is inside a specific lesson.
 *   - Course scope: renders `CourseChatPanel` (the navigator/compass)
 *     when no lesson is selected — i.e. the learner is on the
 *     course-overview view.
 *
 * The two are independent sessions with their own history; navigating
 * between them is fine. They share the same panel chrome and animation,
 * so the user perceives "one chat panel" while the underlying agent
 * differs.
 */
export const ChatPanel = ({ contextLabel, courseSlug, moduleIndex, lessonIndex, onClose }: ChatPanelProps) => {
  const hasLessonContext = moduleIndex !== undefined && lessonIndex !== undefined;

  if (hasLessonContext) {
    return (
      <LessonChatPanel
        contextLabel={contextLabel}
        courseSlug={courseSlug}
        moduleIndex={moduleIndex}
        lessonIndex={lessonIndex}
        onClose={onClose}
      />
    );
  }

  return <CourseChatPanel contextLabel={contextLabel} courseSlug={courseSlug} onClose={onClose} />;
};

// ──────────────────────────────────────────────────────────
// Lesson-scoped panel — the content-grounded mentor.
// ──────────────────────────────────────────────────────────

interface LessonChatPanelProps {
  contextLabel?: string;
  courseSlug: string;
  moduleIndex: number;
  lessonIndex: number;
  onClose: () => void;
}

const LessonChatPanel = ({ contextLabel, courseSlug, moduleIndex, lessonIndex, onClose }: LessonChatPanelProps) => {
  const { data: session } = useSession();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | undefined>(undefined);
  const [initialAttachmentsByMessageId, setInitialAttachmentsByMessageId] = useState<
    Record<string, ChatMessageAttachment[]>
  >({});
  // Empty until the history fetch resolves with the server-computed
  // prompts (lesson-specific / state-based / generic fallback). Showing
  // hardcoded placeholders here would flash for ~100 ms before being
  // replaced — exactly the "feels templated" UX we don't want.
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  // `null` while the history fetch is in flight — the body renders an
  // empty state during this window so we don't flash a populated chat
  // (with stale or empty content) before snapping to the real one.
  const [lessonGenerated, setLessonGenerated] = useState<boolean | null>(null);
  // Bumped when history arrives so LessonChatPanelInner remounts with the correct initialMessages
  const [innerKey, setInnerKey] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  const { data: lessonContent } = useLessonContent({
    courseId: courseSlug,
    moduleIndex,
    lessonIndex,
  });
  const hasContent = (lessonContent?.blocks?.length ?? 0) > 0;

  // JobManager tracks which lesson is actively generating (set on
  // job:started, cleared on job:status completed/failed). We treat the
  // lesson as "settled" only when no generation job is in flight for
  // it AND the body has rendered. While streaming, the lesson-content
  // cache may populate partially via the LessonContent panel's
  // polling — `hasContent` alone is NOT a "done" signal. Pairing it
  // with `!isGeneratingThis` is.
  const { generatingLesson } = useJobManager();
  const isGeneratingThis =
    !!generatingLesson &&
    generatingLesson.moduleIndex === moduleIndex &&
    generatingLesson.lessonIndex === lessonIndex;
  const lessonReady = hasContent && !isGeneratingThis;

  const [historyRefetchKey, setHistoryRefetchKey] = useState(0);

  // Bump refetch the moment the lesson transitions from "in-flight" to
  // "settled". This catches the post-generation moment without needing
  // a separate socket subscription — JobManager already clears
  // generatingLesson on completion, which flips `lessonReady` here.
  const prevReadyRef = useRef(lessonReady);
  useEffect(() => {
    if (!prevReadyRef.current && lessonReady) {
      setHistoryRefetchKey((k) => k + 1);
    }
    prevReadyRef.current = lessonReady;
  }, [lessonReady]);

  // Poll the history endpoint while the lesson is settled but the gate
  // hasn't flipped yet — the server only returns non-empty
  // `suggestedPrompts` once the full post-generation chain (recall cards,
  // hero, links, prompt-building) finishes, which can lag the
  // generate_lesson job by a few seconds. Caps at 20 attempts × 2s = 40s
  // so we don't loop forever if a downstream job is stuck.
  useEffect(() => {
    if (lessonGenerated === true) return;
    if (!lessonReady) return;
    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (attempts > 20) {
        window.clearInterval(id);
        return;
      }
      setHistoryRefetchKey((k) => k + 1);
    }, 2000);
    return () => window.clearInterval(id);
  }, [lessonGenerated, lessonReady]);

  const handleClear = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearLessonChat({ courseId: courseSlug, moduleIndex, lessonIndex });
      setInitialMessages(undefined);
      setInitialAttachmentsByMessageId({});
      setHasMessages(false);
      setInnerKey((k) => k + 1);
    } catch (err) {
      console.error('[MentorPanel] Failed to clear chat:', err);
      toast.error('Failed to clear chat');
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    getLessonChatHistory({ courseId: courseSlug, moduleIndex, lessonIndex })
      .then(
        ({ messages, attachmentsById, suggestedPrompts: serverPrompts, lessonGenerated: serverLessonGenerated }) => {
          if (cancelled) return;
          // Unlock only when the server reports the lesson generated AND
          // has produced suggested prompts. The server only returns a
          // non-empty prompts array once the post-generation chain
          // (recall cards, hero, links, prompt-building) finishes — using
          // it as the gate avoids unlocking the chat while those tasks
          // are still in flight. Ratchet so we never demote once ready.
          const ready = serverLessonGenerated && (serverPrompts?.length ?? 0) > 0;
          setLessonGenerated((prev) => (prev === true ? true : ready));
          if (serverPrompts?.length) {
            setSuggestedPrompts(serverPrompts);
          }
          if (messages.length > 0) {
            const idMap: Record<string, ChatMessageAttachment[]> = {};
            const uiMessages: UIMessage[] = messages.map((m) => {
              const id = nextId();
              if (m.attachments?.length) {
                const resolved = m.attachments
                  .map((ref) => attachmentsById[ref.attachmentId])
                  .filter((a): a is ChatMessageAttachment => Boolean(a));
                if (resolved.length > 0) idMap[id] = resolved;
              }
              return {
                id,
                role: (m.role ?? 'user') as 'user' | 'assistant',
                parts: buildPartsFromPersistedMessage(m, id),
              };
            });
            setInitialMessages(uiMessages);
            setInitialAttachmentsByMessageId(idMap);
            setInnerKey((k) => k + 1);
          }
        },
      )
      .catch((err) => {
        if (cancelled) return;
        console.error('[MentorPanel] Failed to load chat history:', err);
        toast.error(TOASTS.CHAT_HISTORY_ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [courseSlug, moduleIndex, lessonIndex, session?.token, historyRefetchKey]);

  const header = (
    <S.Header>
      <S.CollapseButton onClick={onClose} aria-label="Collapse lesson mentor panel" title="Collapse (⌘\)">
        <ChevronRight size={18} />
      </S.CollapseButton>
      <S.HeaderText>
        <S.HeaderEyebrow>
          Lesson mentor <HelpAnchor concept="mentor-chat" size="sm" />
        </S.HeaderEyebrow>
        {contextLabel && <S.HeaderContext>{contextLabel}</S.HeaderContext>}
      </S.HeaderText>
      {lessonGenerated === true && hasMessages && (
        <HeaderMenu
          onClear={handleClear}
          disabled={isClearing}
          ariaLabel="Lesson mentor menu"
        />
      )}
    </S.Header>
  );

  // History fetch in flight — render an empty body to avoid a content-swap blip.
  if (lessonGenerated === null) {
    return (
      <S.Container>
        {header}
        <S.Body />
      </S.Container>
    );
  }

  // Pre-generation empty state. The mentor's value comes from being
  // grounded in the lesson's content — without it, generic prompts and
  // a degraded chat actively mislead the learner about what the panel
  // can do. Show a clear gate instead.
  if (lessonGenerated === false) {
    return (
      <S.Container>
        {header}
        <S.Body>
          <S.EmptyState>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>Lesson mentor</S.EmptyEyebrow>
            <S.EmptyHeading>Grounded in the lesson.</S.EmptyHeading>
            <S.EmptyHint>
              Generate the lesson on the left to begin. Your mentor reads it with you — ready for
              questions, more examples, and anything that&rsquo;s not landing.
            </S.EmptyHint>
          </S.EmptyState>
        </S.Body>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {header}
      <S.Body>
        <LessonChatPanelInner
          key={innerKey}
          courseSlug={courseSlug}
          moduleIndex={moduleIndex}
          lessonIndex={lessonIndex}
          initialMessages={initialMessages}
          initialAttachmentsByMessageId={initialAttachmentsByMessageId}
          suggestedPrompts={suggestedPrompts}
          onHasMessagesChange={setHasMessages}
        />
      </S.Body>
    </S.Container>
  );
};

interface LessonInnerProps {
  courseSlug: string;
  moduleIndex: number;
  lessonIndex: number;
  initialMessages?: UIMessage[];
  initialAttachmentsByMessageId: Record<string, ChatMessageAttachment[]>;
  suggestedPrompts: string[];
  /** Pushes the live "has any messages" signal up so the header can gate the clear button. */
  onHasMessagesChange: (hasMessages: boolean) => void;
}

interface AttachmentState extends AttachmentChipData {
  /** Attachment id assigned by the server's persist endpoint. Empty while isLoading. */
  id: string;
  kind: 'pdf' | 'text';
}

const LessonChatPanelInner = ({
  courseSlug,
  moduleIndex,
  lessonIndex,
  initialMessages,
  initialAttachmentsByMessageId,
  suggestedPrompts,
  onHasMessagesChange,
}: LessonInnerProps) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [attachment, setAttachment] = useState<AttachmentState | undefined>(undefined);

  const [attachmentsByMessageId, setAttachmentsByMessageId] =
    useState<Record<string, ChatMessageAttachment[]>>(initialAttachmentsByMessageId);
  const pendingAttachmentsRef = useRef<ChatMessageAttachment[] | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: lessonMentorChatUrl({ courseId: courseSlug, moduleIndex, lessonIndex }),
        // creditAwareFetch fires the global Out-of-Credits modal on 402
        // before the SDK throws. Without it, the streaming surface bypasses
        // our axios client + React Query MutationCache and the modal never
        // opens for paid-action 402s on the mentor stream.
        fetch: creditAwareFetch,
        headers: () => ({
          Authorization: `Bearer ${session?.token ?? ''}`,
        }),
      }),
    [courseSlug, moduleIndex, lessonIndex, session?.token],
  );

  const { messages, sendMessage, status, error, stop } = useChat({
    id: `mentor-${courseSlug}-${moduleIndex}-${lessonIndex}`,
    transport,
    ...(initialMessages ? { messages: initialMessages } : {}),
    onError: (err) => {
      console.error('[MentorPanel] onError —', err);
    },
  });

  // The modal owns the 402 UX; muting the inline banner here keeps the
  // panel from doubling up with a redundant "API error" string.
  const displayError = error && !isInsufficientCreditsError(error) ? error.message : null;

  const hasMessages = messages.length > 0;
  useEffect(() => {
    onHasMessagesChange(hasMessages);
  }, [hasMessages, onHasMessagesChange]);

  useEffect(() => {
    if (!pendingAttachmentsRef.current) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    if (attachmentsByMessageId[lastUserMsg.id]) return;
    const attached = pendingAttachmentsRef.current;
    pendingAttachmentsRef.current = null;
    setAttachmentsByMessageId((prev) => ({ ...prev, [lastUserMsg.id]: attached }));
  }, [messages, attachmentsByMessageId]);

  const chatMessages: ChatMessageData[] = useMemo(
    () => uiMessagesToChatData(messages, attachmentsByMessageId),
    [messages, attachmentsByMessageId],
  );

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';

  const handleAttachFile = async (file: File) => {
    setAttachment({
      id: '',
      kind: 'text',
      filename: file.name,
      approxTokens: 0,
      isLoading: true,
    });
    try {
      const result = await attachAttachment({ courseId: courseSlug, moduleIndex, lessonIndex, file });
      setAttachment({
        id: result.id,
        kind: result.kind,
        filename: result.filename,
        approxTokens: result.approxTokens,
        isLoading: false,
      });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Failed to attach file');
      console.error('[MentorPanel] attach failed:', err);
      toast.error(message);
      setAttachment(undefined);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(undefined);
  };

  const handleSubmit = () => {
    const typed = inputValue.trim();
    const ready = attachment && !attachment.isLoading && attachment.id;
    if (!typed && !ready) return;

    if (ready) {
      pendingAttachmentsRef.current = [
        {
          id: attachment.id,
          filename: attachment.filename,
          kind: attachment.kind,
          approxTokens: attachment.approxTokens,
        },
      ];
    }

    analytics.track('mentor_chat_message_sent', {
      course_id: courseSlug,
      module_index: moduleIndex,
      lesson_index: lessonIndex,
      lesson_id: `${courseSlug}-${moduleIndex}-${lessonIndex}`,
      message_length_chars: typed.length,
      has_attachment: !!ready,
      chat_message_count: messages.length + 1,
    });
    sendMessage({ text: typed }, { body: { attachmentIds: ready ? [attachment.id] : [] } });
    setInputValue('');
    setAttachment(undefined);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    analytics.track('mentor_chat_message_sent', {
      course_id: courseSlug,
      module_index: moduleIndex,
      lesson_index: lessonIndex,
      lesson_id: `${courseSlug}-${moduleIndex}-${lessonIndex}`,
      message_length_chars: prompt.length,
      from_suggested_prompt: true,
      chat_message_count: messages.length + 1,
    });
    sendMessage({ text: prompt });
  };

  return (
    <Chat
      messages={chatMessages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      suggestedPrompts={suggestedPrompts}
      onSuggestedPromptClick={handleSuggestedPrompt}
      placeholder="Ask your mentor..."
      isStreaming={isStreaming}
      isThinking={isSubmitted}
      error={displayError}
      attachment={
        attachment
          ? {
              filename: attachment.filename,
              approxTokens: attachment.approxTokens,
              isLoading: attachment.isLoading,
            }
          : undefined
      }
      onAttachFile={handleAttachFile}
      onRemoveAttachment={handleRemoveAttachment}
      onStop={stop}
      courseSlug={courseSlug}
    />
  );
};

// ──────────────────────────────────────────────────────────
// Course-scoped panel — the navigator/compass.
//
// Distinct from the lesson panel:
//   - No attachments. (Course mentor doesn't accept files in v1.)
//   - History endpoint is /mentor/chat/history at course scope, not
//     lesson scope.
//   - Empty states are different: "course not ready" gate when the
//     learner hasn't accepted their structure; otherwise the active
//     compass with state-derived suggested prompts.
//   - Header label reads "Course mentor" (vs "Lesson mentor" on the
//     lesson-scope companion) so learners can tell which scope they
//     are talking to when navigating between the two.
// ──────────────────────────────────────────────────────────

interface CourseChatPanelProps {
  contextLabel?: string;
  courseSlug: string;
  onClose: () => void;
}

const CourseChatPanel = ({ contextLabel, courseSlug, onClose }: CourseChatPanelProps) => {
  const { data: session } = useSession();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | undefined>(undefined);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [courseGenerated, setCourseGenerated] = useState<boolean | null>(null);
  const [innerKey, setInnerKey] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  const handleClear = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearCourseMentor(courseSlug);
      setInitialMessages(undefined);
      setHasMessages(false);
      setInnerKey((k) => k + 1);
    } catch (err) {
      console.error('[GuidePanel] Failed to clear chat:', err);
      toast.error('Failed to clear chat');
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    getCourseMentorHistory(courseSlug)
      .then(({ messages, suggestedPrompts: serverPrompts, courseGenerated: serverCourseGenerated }) => {
        if (cancelled) return;
        setCourseGenerated(serverCourseGenerated);
        if (serverPrompts?.length) {
          setSuggestedPrompts(serverPrompts);
        }
        if (messages.length > 0) {
          const uiMessages: UIMessage[] = messages.map((m) => {
            const id = nextId();
            return {
              id,
              role: (m.role ?? 'user') as 'user' | 'assistant',
              parts: buildPartsFromPersistedMessage(m, id),
            };
          });
          setInitialMessages(uiMessages);
          setInnerKey((k) => k + 1);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[GuidePanel] Failed to load chat history:', err);
        toast.error(TOASTS.CHAT_HISTORY_ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [courseSlug, session?.token]);

  const header = (
    <S.Header>
      <S.CollapseButton onClick={onClose} aria-label="Collapse course mentor panel" title="Collapse (⌘\)">
        <ChevronRight size={18} />
      </S.CollapseButton>
      <S.HeaderText>
        <S.HeaderEyebrow>
          Course mentor <HelpAnchor concept="mentor-chat" size="sm" />
        </S.HeaderEyebrow>
        {contextLabel && <S.HeaderContext>{contextLabel}</S.HeaderContext>}
      </S.HeaderText>
      {courseGenerated === true && hasMessages && (
        <HeaderMenu
          onClear={handleClear}
          disabled={isClearing}
          ariaLabel="Course mentor menu"
        />
      )}
    </S.Header>
  );

  // History fetch in flight — empty body to avoid the content-swap blip.
  if (courseGenerated === null) {
    return (
      <S.Container>
        {header}
        <S.Body />
      </S.Container>
    );
  }

  // Pre-acceptance gate. When the course is still in 'creating' status
  // (wizard not yet accepted), there's no structure to navigate yet —
  // chatting with a mentor that doesn't know its course makes no sense.
  if (courseGenerated === false) {
    return (
      <S.Container>
        {header}
        <S.Body>
          <S.EmptyState>
            <S.EmptyRule aria-hidden />
            <S.EmptyEyebrow>Course mentor</S.EmptyEyebrow>
            <S.EmptyHeading>Mapped to your course.</S.EmptyHeading>
            <S.EmptyHint>
              Accept the course on the left to begin. Your mentor knows your modules and lessons,
              your progress, and where you might be stuck — and helps you decide what to do next.
            </S.EmptyHint>
          </S.EmptyState>
        </S.Body>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {header}
      <S.Body>
        <CourseChatPanelInner
          key={innerKey}
          courseSlug={courseSlug}
          initialMessages={initialMessages}
          suggestedPrompts={suggestedPrompts}
          onHasMessagesChange={setHasMessages}
        />
      </S.Body>
    </S.Container>
  );
};

interface CourseInnerProps {
  courseSlug: string;
  initialMessages?: UIMessage[];
  suggestedPrompts: string[];
  onHasMessagesChange: (hasMessages: boolean) => void;
}

const CourseChatPanelInner = ({
  courseSlug,
  initialMessages,
  suggestedPrompts,
  onHasMessagesChange,
}: CourseInnerProps) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: courseMentorChatUrl(courseSlug),
        // See LessonChatPanelInner above for the rationale — the global
        // Out-of-Credits modal lives behind the React Query mutation cache,
        // and streaming chat surfaces would otherwise dodge it on 402.
        fetch: creditAwareFetch,
        headers: () => ({
          Authorization: `Bearer ${session?.token ?? ''}`,
        }),
      }),
    [courseSlug, session?.token],
  );

  const { messages, sendMessage, status, error, stop } = useChat({
    id: `course-mentor-${courseSlug}`,
    transport,
    ...(initialMessages ? { messages: initialMessages } : {}),
    onError: (err) => {
      console.error('[GuidePanel] onError —', err);
    },
  });

  const displayError = error && !isInsufficientCreditsError(error) ? error.message : null;

  const hasMessages = messages.length > 0;
  useEffect(() => {
    onHasMessagesChange(hasMessages);
  }, [hasMessages, onHasMessagesChange]);

  const chatMessages: ChatMessageData[] = useMemo(() => uiMessagesToChatData(messages), [messages]);

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';

  const handleSubmit = () => {
    const typed = inputValue.trim();
    if (!typed) return;
    sendMessage({ text: typed });
    setInputValue('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  return (
    <Chat
      messages={chatMessages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSubmit={handleSubmit}
      suggestedPrompts={suggestedPrompts}
      onSuggestedPromptClick={handleSuggestedPrompt}
      placeholder="Ask your mentor..."
      isStreaming={isStreaming}
      isThinking={isSubmitted}
      error={displayError}
      onStop={stop}
      courseSlug={courseSlug}
    />
  );
};
