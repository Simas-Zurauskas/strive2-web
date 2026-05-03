'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage, DefaultChatTransport } from 'ai';
import { ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { TOASTS } from '@/constants/toasts';
import { useLessonContent } from '@/hooks/useLessonContent';
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

  // Subscribe to the lesson-content react-query cache. The JobManager
  // already invalidates this on `generate_lesson` completion (see
  // hooks/useJobManager.tsx — handleStatus invalidates LESSON_CONTENT),
  // so the moment generation finishes, `lessonContent.blocks` flips
  // from empty to populated. We use that transition as the trigger to
  // refetch the chat history — without it, the panel would stay on the
  // pre-generation empty state until the user manually reloads, even
  // though the lesson body has rendered next to it.
  const { data: lessonContent } = useLessonContent({
    courseId: courseSlug,
    moduleIndex,
    lessonIndex,
  });
  const hasContent = (lessonContent?.blocks?.length ?? 0) > 0;
  const [historyRefetchKey, setHistoryRefetchKey] = useState(0);
  const prevHasContentRef = useRef(hasContent);
  useEffect(() => {
    // Only react to the no-content → has-content transition. Other
    // transitions (e.g. has-content → has-content as new blocks
    // arrive during regeneration) shouldn't blow away the user's
    // in-flight chat session by remounting the inner panel.
    if (!prevHasContentRef.current && hasContent) {
      setHistoryRefetchKey((k) => k + 1);
    }
    prevHasContentRef.current = hasContent;
  }, [hasContent]);

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
          setLessonGenerated(serverLessonGenerated);
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
      <S.CollapseButton onClick={onClose} aria-label="Collapse mentor panel" title="Collapse (⌘\)">
        <ChevronRight size={18} />
      </S.CollapseButton>
      <S.HeaderText>
        <S.HeaderEyebrow>Mentor</S.HeaderEyebrow>
        {contextLabel && <S.HeaderContext>{contextLabel}</S.HeaderContext>}
      </S.HeaderText>
      {lessonGenerated === true && hasMessages && (
        <S.ClearButton onClick={handleClear} disabled={isClearing} aria-label="Clear chat history" title="Clear chat">
          <Trash2 size={16} />
        </S.ClearButton>
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
            <S.EmptyIcon>
              <Sparkles size={22} />
            </S.EmptyIcon>
            <S.EmptyHeading>Generate this lesson to start chatting</S.EmptyHeading>
            <S.EmptyHint>
              Your mentor uses the lesson content to answer questions, surface what you&rsquo;re missing, and quiz you
              on the key concepts.
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

    sendMessage({ text: typed }, { body: { attachmentIds: ready ? [attachment.id] : [] } });
    setInputValue('');
    setAttachment(undefined);
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
      error={error?.message ?? null}
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
//   - Header label reads "Guide", not "Mentor", to disambiguate from
//     the lesson-scope companion when navigating between the two.
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
      <S.CollapseButton onClick={onClose} aria-label="Collapse guide panel" title="Collapse (⌘\)">
        <ChevronRight size={18} />
      </S.CollapseButton>
      <S.HeaderText>
        <S.HeaderEyebrow>Guide</S.HeaderEyebrow>
        {contextLabel && <S.HeaderContext>{contextLabel}</S.HeaderContext>}
      </S.HeaderText>
      {courseGenerated === true && hasMessages && (
        <S.ClearButton onClick={handleClear} disabled={isClearing} aria-label="Clear chat history" title="Clear chat">
          <Trash2 size={16} />
        </S.ClearButton>
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
  // chatting with a guide that doesn't know its course makes no sense.
  if (courseGenerated === false) {
    return (
      <S.Container>
        {header}
        <S.Body>
          <S.EmptyState>
            <S.EmptyIcon>
              <Sparkles size={22} />
            </S.EmptyIcon>
            <S.EmptyHeading>Accept your course to start chatting</S.EmptyHeading>
            <S.EmptyHint>
              Your guide knows your modules and lessons, your progress, and where you might be stuck — once your course
              is ready it can help you decide what to do next.
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
      placeholder="Ask your guide..."
      isStreaming={isStreaming}
      isThinking={isSubmitted}
      error={error?.message ?? null}
      onStop={stop}
      courseSlug={courseSlug}
    />
  );
};
