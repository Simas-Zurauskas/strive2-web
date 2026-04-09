import styled, { keyframes } from 'styled-components';
import { thinScrollbar } from '@/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ExerciseContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => p.theme.colors.accent}0a;
  border-bottom: 1px solid ${(p) => p.theme.colors.accent}20;
  color: ${(p) => p.theme.colors.accent};
`;

export const ExerciseHeaderIcon = styled.span`
  display: flex;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2px;
  }
`;

export const ExerciseHeaderLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const ExerciseContent = styled.div`
  padding: 1.25rem;
  font-size: 1em;
  line-height: 1.75;
  color: ${(p) => p.theme.colors.foreground};
  overflow-wrap: break-word;
  word-break: break-word;

  p {
    margin-bottom: 0.75rem;
  }

  ul, ol {
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  strong {
    font-weight: 600;
  }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    word-break: break-all;
  }

  pre {
    overflow-x: auto;
    padding: 0.75rem;
    border-radius: 8px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-size: 0.8125rem;
    line-height: 1.5;
    ${thinScrollbar}

    code {
      background: none;
      border: none;
      padding: 0;
      word-break: normal;
    }
  }
`;

export const ExerciseEditorWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  .cm-editor {
    font-size: 0.8125em;
    max-height: 400px;
  }

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-scroller {
    overflow: auto;
    ${thinScrollbar}
  }

  .cm-gutters {
    border-right: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const ExerciseToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
`;

export const ToolbarInfo = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-left: auto;
`;

export const OutputPanel = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const OutputHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const OutputBody = styled.pre<{ $isError?: boolean }>`
  margin: 0;
  padding: 1rem 1.25rem;
  font-size: 0.8125em;
  line-height: 1.5;
  font-family: var(--font-geist-mono, 'Geist Mono', monospace);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => (p.$isError ? p.theme.colors.error : p.theme.colors.foreground)};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  ${thinScrollbar}
`;

export const ExpectedOutput = styled.div`
  padding: 0.75rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.75em;
  color: ${(p) => p.theme.colors.muted};

  strong {
    font-weight: 600;
  }

  pre {
    margin: 0.375rem 0 0;
    padding: 0.5rem 0.625rem;
    border-radius: 6px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    font-family: var(--font-geist-mono, 'Geist Mono', monospace);
    font-size: 1em;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;
