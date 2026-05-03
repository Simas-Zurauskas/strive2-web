'use client';

import { Paperclip } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { Markdown } from '@/components/Markdown';
import * as S from './ChatMessage.styles';
import { HandoffButton, type HandoffSuccess } from './HandoffButton';
import type { ChatMessageData, ToolInvocation } from '../types';

interface ChatMessageProps {
  message: ChatMessageData;
  isStreaming?: boolean;
  /**
   * Course slug from the surrounding ChatPanel — used by `HandoffButton`
   * to construct lesson/quiz URLs. Optional because the shared
   * `<Chat>` component is also used in surfaces (e.g. course-creation
   * wizard) that don't have a course slug yet — in those surfaces the
   * agent doesn't emit handoffs, so the prop is simply unused.
   */
  courseSlug?: string;
}

const TOOL_CONFIG: Record<string, { label: string; activeLabel: string }> = {
  web_search: { label: 'Searched the web', activeLabel: 'Searching the web' },
  TavilySearch: { label: 'Searched the web', activeLabel: 'Searching the web' },
  modify_structure: { label: 'Modified structure', activeLabel: 'Modifying structure' },
  search_lesson_content: { label: 'Searched lesson content', activeLabel: 'Searching lesson content' },
  search_product_kb: { label: 'Searched the help center', activeLabel: 'Searching the help center' },
  fetch_url: { label: 'Read URL', activeLabel: 'Reading URL' },
  get_user_progress: { label: 'Checked your progress', activeLabel: 'Checking your progress' },
};

const getToolDisplay = ({ toolName, isActive }: { toolName: string; isActive: boolean }) => {
  const config = TOOL_CONFIG[toolName];
  if (!config) return isActive ? `Running ${toolName}` : toolName;
  return isActive ? config.activeLabel : config.label;
};

/**
 * Tool outputs from the mentor agent come back as JSON strings (the
 * tools call `JSON.stringify(...)` server-side). Parse safely; on
 * malformed JSON return null and we fall back to the plain label.
 */
const parseToolOutput = (output: unknown): Record<string, unknown> | null => {
  if (output == null) return null;
  if (typeof output === 'object') return output as Record<string, unknown>;
  if (typeof output !== 'string') return null;
  try {
    const parsed = JSON.parse(output);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Type-guard for a successful `emit_handoff` tool result. The server
 * returns either `{ ok: true, target, ..., label }` or `{ ok: false,
 * error, message }`; we only render a button on success. Failures are
 * silently dropped — the agent saw the error and either retried with
 * valid params or fell back to plain text.
 */
const parseHandoffSuccess = (output: unknown): HandoffSuccess | null => {
  const parsed = parseToolOutput(output);
  if (!parsed || parsed.ok !== true) return null;
  const target = parsed.target;
  const label = parsed.label;
  if (target !== 'quiz' && target !== 'insights' && target !== 'lesson') return null;
  if (typeof label !== 'string' || label.length === 0) return null;
  const moduleIndex = typeof parsed.moduleIndex === 'number' ? parsed.moduleIndex : undefined;
  const lessonIndex = typeof parsed.lessonIndex === 'number' ? parsed.lessonIndex : undefined;
  return { ok: true, target, moduleIndex, lessonIndex, label };
};

/**
 * Extract a tool-specific suffix to append to the badge label, like
 * "(3 hits)" for search_lesson_content. Returns empty when no useful
 * detail is available so the badge stays compact.
 */
const getToolDetail = ({ toolName, output }: { toolName: string; output: unknown }): string => {
  const parsed = parseToolOutput(output);
  if (!parsed) return '';

  if (toolName === 'search_lesson_content' || toolName === 'search_product_kb') {
    const results = parsed.results;
    if (Array.isArray(results)) {
      if (results.length === 0) return ' · no matches';
      return ` · ${results.length} hit${results.length === 1 ? '' : 's'}`;
    }
  }

  if (toolName === 'fetch_url') {
    if (typeof parsed.error === 'string') {
      const msg = typeof parsed.message === 'string' ? parsed.message : parsed.error;
      return ` · failed: ${msg}`;
    }
    if (typeof parsed.tokens === 'number') {
      return ` · ${parsed.tokens.toLocaleString()} tokens`;
    }
  }

  return '';
};

interface ToolSummary {
  toolName: string;
  count: number;
  isActive: boolean;
  label: string;
}

const summariseTools = (tools: ToolInvocation[]): ToolSummary[] => {
  // Group by toolName, but the per-call output detail is informative
  // only when there's exactly one invocation of that tool — otherwise
  // we'd have to merge multiple outputs. Track the latest output per
  // tool so we can attach a detail suffix for the singleton case.
  const grouped = new Map<
    string,
    { count: number; hasActive: boolean; latestOutput: unknown }
  >();

  for (const t of tools) {
    const key = t.toolName === 'TavilySearch' ? 'web_search' : t.toolName;
    const isActive = t.state !== 'output-available';
    const existing = grouped.get(key);
    if (existing) {
      existing.count++;
      if (isActive) existing.hasActive = true;
      if (!isActive) existing.latestOutput = t.output;
    } else {
      grouped.set(key, { count: 1, hasActive: isActive, latestOutput: isActive ? null : t.output });
    }
  }

  return Array.from(grouped.entries()).map(([toolName, { count, hasActive, latestOutput }]) => {
    const baseLabel = getToolDisplay({ toolName, isActive: hasActive });
    const detail =
      !hasActive && count === 1 ? getToolDetail({ toolName, output: latestOutput }) : '';
    const countSuffix = count > 1 ? ` (${count})` : '';
    return {
      toolName,
      count,
      isActive: hasActive,
      label: `${baseLabel}${countSuffix}${detail}`,
    };
  });
};

/** Reveals text character-by-character at a steady rate for smooth streaming. */
const useTypewriter = ({
  fullText,
  active,
  charsPerFrame = 2,
}: {
  fullText: string;
  active: boolean;
  charsPerFrame?: number;
}) => {
  const [displayed, setDisplayed] = useState(fullText);
  const indexRef = useRef(fullText.length);
  const rafRef = useRef(0);

  useEffect(() => {
    if (active) {
      const tick = () => {
        if (indexRef.current < fullText.length) {
          indexRef.current = Math.min(indexRef.current + charsPerFrame, fullText.length);
          setDisplayed(fullText.slice(0, indexRef.current));
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }
    indexRef.current = fullText.length;
  }, [fullText, active, charsPerFrame]);

  return active ? displayed : fullText;
};

const MemoizedMarkdown = memo(
  ({ content }: { content: string }) => <Markdown>{content}</Markdown>,
  (prev, next) => prev.content === next.content,
);

export const ChatMessage = memo(
  ({ message, isStreaming = false, courseSlug }: ChatMessageProps) => {
    const isUser = message.role === 'user';
    const tools = message.toolInvocations ?? [];

    // Split emit_handoff tool calls out of the badge flow — they render
    // as inline buttons under the message, not as muted status pills.
    // We keep both lists in source order so multiple handoffs render in
    // the same order the agent emitted them.
    const handoffSuccesses: HandoffSuccess[] = [];
    const otherTools: ToolInvocation[] = [];
    for (const t of tools) {
      if (t.toolName === 'emit_handoff') {
        // Only render once the tool has produced output. Mid-call
        // tool-input frames don't carry a payload yet and would render
        // a malformed button if we tried.
        if (t.state === 'output-available') {
          const parsed = parseHandoffSuccess(t.output);
          if (parsed) handoffSuccesses.push(parsed);
        }
        // Failed handoffs (ok: false) and not-yet-resolved ones are
        // intentionally invisible — see parseHandoffSuccess docstring.
        continue;
      }
      otherTools.push(t);
    }

    const toolSummary = otherTools.length > 0 ? summariseTools(otherTools) : [];
    const displayContent = useTypewriter({ fullText: message.content, active: isStreaming });

    const hasContent = isUser ? !!message.content : !!displayContent;
    const attachments = isUser ? message.attachments ?? [] : [];
    const canRenderHandoffs = !!courseSlug && handoffSuccesses.length > 0;

    return (
      <S.MessageWrapper $isUser={isUser}>
        {attachments.length > 0 && (
          <S.AttachmentRow>
            {attachments.map((a) => (
              <S.PastAttachmentChip key={a.id}>
                <Paperclip size={11} />
                <S.PastAttachmentChipLabel title={a.filename}>{a.filename}</S.PastAttachmentChipLabel>
              </S.PastAttachmentChip>
            ))}
          </S.AttachmentRow>
        )}
        {hasContent && (
          <S.MessageBubble $isUser={isUser}>
            {isUser ? message.content : <MemoizedMarkdown content={displayContent} />}
          </S.MessageBubble>
        )}
        {canRenderHandoffs &&
          handoffSuccesses.map((h, i) => (
            <HandoffButton
              key={`handoff-${i}-${h.target}-${h.moduleIndex ?? 'x'}-${h.lessonIndex ?? 'x'}`}
              payload={h}
              courseSlug={courseSlug as string}
            />
          ))}
        {toolSummary.length > 0 && (
          <S.ToolRow>
            {toolSummary.map((t) => (
              <S.ToolBadge key={t.toolName} $isActive={t.isActive}>
                {t.label}
                {t.isActive && <S.ToolSpinner />}
              </S.ToolBadge>
            ))}
          </S.ToolRow>
        )}
      </S.MessageWrapper>
    );
  },
  (prev, next) =>
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.isStreaming === next.isStreaming &&
    prev.message.toolInvocations === next.message.toolInvocations &&
    prev.message.attachments === next.message.attachments &&
    prev.courseSlug === next.courseSlug,
);
