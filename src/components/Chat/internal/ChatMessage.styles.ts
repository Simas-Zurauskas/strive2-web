import styled, { keyframes } from 'styled-components';
import { onAccent, onColorWashes } from '@/theme';

const toolFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;

export const MessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$isUser ? 'flex-end' : 'flex-start')};
  gap: 0.3rem;
`;

/**
 * User messages render as a pill bubble (right-aligned, accent fill).
 * Assistant messages render as full-width plain prose — no bubble, no
 * border, no fill — matching the ChatGPT / Claude.ai pattern. The
 * earlier shared-bubble approach gave assistant messages a faint
 * surface fill that disappeared in dark mode and added visual weight
 * that fights with markdown/code-block formatting.
 */
export const MessageBubble = styled.div<{ $isUser: boolean }>`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${(p) => (p.$isUser ? onAccent : p.theme.colors.foreground)};

  ${(p) =>
    p.$isUser
      ? `
        max-width: min(85%, 480px);
        padding: 0.75rem 1rem;
        border-radius: 1.25rem;
        border-top-right-radius: 0.375rem;
        background: ${p.theme.colors.accent};
        transition: background 0.2s ease;
      `
      : `
        width: 100%;
        max-width: 100%;
        padding: 0.25rem 0;
        background: transparent;
      `}

  p {
    margin: 0;
  }

  p + p {
    margin-top: 0.5rem;
  }

  ul,
  ol {
    margin: 0.375rem 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  /* Inline code:
   *  - User side: subtle white-on-accent pill (existing behavior).
   *  - Assistant side: \`surface\` — page background is \`background\`,
   *    so we use the surface color to give inline code a visible
   *    contrast on both light and dark themes without resurrecting the
   *    full-bubble look. */
  code {
    font-size: 0.8125rem;
    background: ${(p) =>
      p.$isUser ? onColorWashes.inlineCodeBg : p.theme.colors.surface};
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
`;

export const ToolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ToolSpinner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`;

export const ToolBadge = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  opacity: ${(p) => (p.$isActive ? 0.8 : 1)};
  animation: ${toolFadeIn} 0.25s ease-out both;
  transition: opacity 0.2s ease;
`;

// ── Past-message attachment chips ─────────────────────
//
// Rendered above the user bubble (matches ChatGPT/Claude.ai). Mirrors
// the composer chip styling but read-only (no remove button — files
// can't be detached from a sent message in v1).

export const AttachmentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: flex-end;
  max-width: min(85%, 480px);
`;

export const PastAttachmentChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  max-width: 100%;
  min-width: 0;
  animation: ${toolFadeIn} 0.25s ease-out both;
`;

export const PastAttachmentChipLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 14rem;
`;

