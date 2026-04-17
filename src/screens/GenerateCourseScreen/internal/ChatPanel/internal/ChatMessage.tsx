'use client';

import _ from 'lodash';
import { memo, useEffect, useRef, useState } from 'react';
import { Markdown } from '@/components';
import * as S from './ChatMessage.styles';

interface ToolInvocation {
  toolName: string;
  state: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    role: string;
    content: string;
    toolInvocations?: ToolInvocation[];
  };
  isStreaming?: boolean;
}

const TOOL_CONFIG: Record<string, { label: string; activeLabel: string }> = {
  web_search: { label: 'Searched the web', activeLabel: 'Searching the web' },
  TavilySearch: { label: 'Searched the web', activeLabel: 'Searching the web' },
  modify_structure: { label: 'Modified structure', activeLabel: 'Modifying structure' },
};

const getToolDisplay = (toolName: string, isActive: boolean) => {
  const config = TOOL_CONFIG[toolName];
  if (!config) return isActive ? `Running ${toolName}` : toolName;
  return isActive ? config.activeLabel : config.label;
};

const summariseTools = (tools: ToolInvocation[]) => {
  const grouped = new Map<string, { count: number; hasActive: boolean }>();

  for (const t of tools) {
    const key = t.toolName === 'TavilySearch' ? 'web_search' : t.toolName;
    const isActive = t.state !== 'output-available';
    const existing = grouped.get(key);
    if (existing) {
      existing.count++;
      if (isActive) existing.hasActive = true;
    } else {
      grouped.set(key, { count: 1, hasActive: isActive });
    }
  }

  return Array.from(grouped.entries()).map(([toolName, { count, hasActive }]) => ({
    toolName,
    count,
    isActive: hasActive,
    label: getToolDisplay(toolName, hasActive) + (count > 1 ? ` (${count})` : ''),
  }));
};

/** Reveals text character-by-character at a steady rate for smooth streaming. */
const useTypewriter = (fullText: string, active: boolean, charsPerFrame = 2) => {
  const [displayed, setDisplayed] = useState(fullText);
  const indexRef = useRef(fullText.length);
  const rafRef = useRef(0);

  // When not active, return fullText directly — no effect needed
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
    // When streaming stops, sync index for next time
    indexRef.current = fullText.length;
  }, [fullText, active, charsPerFrame]);

  return active ? displayed : fullText;
};

const MemoizedMarkdown = memo(
  ({ content }: { content: string }) => <Markdown>{content}</Markdown>,
  (prev, next) => prev.content === next.content,
);

export const ChatMessage = memo(({ message, isStreaming = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const tools = message.toolInvocations ?? [];
  const toolSummary = tools.length > 0 ? summariseTools(tools) : [];
  const displayContent = useTypewriter(message.content, isStreaming);

  const hasContent = isUser ? !!message.content : !!displayContent;

  return (
    <S.MessageWrapper $isUser={isUser}>
      {hasContent && (
        <S.MessageBubble $isUser={isUser}>
          {isUser ? message.content : <MemoizedMarkdown content={displayContent} />}
        </S.MessageBubble>
      )}
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
}, (prev, next) =>
  prev.message.id === next.message.id &&
  prev.message.content === next.message.content &&
  prev.isStreaming === next.isStreaming &&
  prev.message.toolInvocations === next.message.toolInvocations,
);
