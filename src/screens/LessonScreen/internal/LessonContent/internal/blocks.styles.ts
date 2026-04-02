import styled, { css } from 'styled-components';

// ── Shared ─────────────────────────────────────────────

export const BlockWrapper = styled.div`
  line-height: 1.7;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Intro ──────────────────────────────────────────────

export const IntroText = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.foreground};

  strong {
    font-weight: 600;
  }
  em {
    font-style: italic;
  }
  code {
    font-size: 0.875em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
  }
`;

// ── Section ────────────────────────────────────────────

export const SectionContent = styled.div`
  line-height: 1.7;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.375rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 0.75rem;
    color: ${(p) => p.theme.colors.foreground};
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: ${(p) => p.theme.colors.foreground};
  }

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

  em {
    font-style: italic;
  }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0.75rem;
    font-size: 0.8125rem;
  }

  th, td {
    padding: 0.5rem 0.75rem;
    border: 1px solid ${(p) => p.theme.colors.border};
    text-align: left;
  }

  th {
    background: ${(p) => p.theme.colors.surface};
    font-weight: 600;
  }


  tr:nth-child(even) {
    background: ${(p) => `${p.theme.colors.surface}80`};
  }
`;

// ── Code ───────────────────────────────────────────────

export const CodeContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const CodeLanguage = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CopyButton = styled.button`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0.125rem 0.25rem;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const CodePre = styled.pre`
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.6;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};

  code {
    font-family: var(--font-geist-mono, 'Geist Mono', 'SF Mono', 'Fira Code', monospace);
  }
`;

// ── Callout ────────────────────────────────────────────

const calloutVariants = {
  info: css`
    border-left-color: ${(p) => p.theme.colors.accent};
    background: ${(p) => `${p.theme.colors.accent}08`};
  `,
  tip: css`
    border-left-color: ${(p) => p.theme.colors.success};
    background: ${(p) => `${p.theme.colors.success}08`};
  `,
  warning: css`
    border-left-color: ${(p) => p.theme.colors.warning};
    background: ${(p) => `${p.theme.colors.warning}08`};
  `,
  important: css`
    border-left-color: ${(p) => p.theme.colors.error};
    background: ${(p) => `${p.theme.colors.error}08`};
  `,
};

export const CalloutContainer = styled.div<{ $variant: 'info' | 'tip' | 'warning' | 'important' }>`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border-left: 3px solid;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.foreground};
  ${(p) => calloutVariants[p.$variant]}

  strong {
    font-weight: 600;
  }
  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const CalloutLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
  opacity: 0.7;
`;

// ── Mermaid ────────────────────────────────────────────

export const MermaidContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const MermaidDiagram = styled.div`
  padding: 1.5rem;
  overflow: auto;
  background: ${(p) => p.theme.colors.background};

  .mermaid {
    display: flex;
    justify-content: center;
  }

  svg {
    height: auto;
  }
`;

export const MermaidFallback = styled.div`
  padding: 1rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
`;

export const MermaidCodeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.6875rem;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Summary ────────────────────────────────────────────

export const SummaryContainer = styled.div`
  padding: 1.25rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const SummaryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.75rem;
`;

export const SummaryList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
`;

export const SummaryItem = styled.li`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  padding-left: 1.25rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
  }

  p {
    margin: 0;
  }

  strong {
    font-weight: 600;
  }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
  }
`;

// ── Links ──────────────────────────────────────────────

export const LinksContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const LinksHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.625rem 1rem;
  text-decoration: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;

export const LinkTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};
`;

export const LinkDescription = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

// ── Quiz ───────────────────────────────────────────────

export const QuizContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const QuizHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;

export const QuizQuestion = styled.p`
  padding: 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem;
  gap: 0.5rem;
`;

export const QuizOption = styled.button<{ $state: 'default' | 'correct' | 'incorrect' | 'dimmed' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(p) =>
    p.$state === 'correct'
      ? p.theme.colors.success
      : p.$state === 'incorrect'
        ? p.theme.colors.error
        : p.theme.colors.border};
  background: ${(p) =>
    p.$state === 'correct'
      ? `${p.theme.colors.success}10`
      : p.$state === 'incorrect'
        ? `${p.theme.colors.error}10`
        : p.theme.colors.background};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-size: 0.875rem;
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' ? 'pointer' : 'default')};
  line-height: 1.4;
  transition: border-color 0.15s, background 0.15s;

  ${(p) =>
    p.$state === 'default' &&
    `&:hover {
      border-color: ${p.theme.colors.accent};
      background: ${p.theme.colors.surface};
    }`}
`;

export const QuizOptionLetter = styled.span<{ $state: 'default' | 'correct' | 'incorrect' | 'dimmed' }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${(p) =>
    p.$state === 'correct'
      ? p.theme.colors.success
      : p.$state === 'incorrect'
        ? p.theme.colors.error
        : p.theme.colors.surface};
  color: ${(p) =>
    p.$state === 'correct' || p.$state === 'incorrect'
      ? '#fff'
      : p.theme.colors.muted};
  border: 1px solid ${(p) =>
    p.$state === 'correct'
      ? p.theme.colors.success
      : p.$state === 'incorrect'
        ? p.theme.colors.error
        : p.theme.colors.border};
`;

export const QuizExplanation = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Exercise ───────────────────────────────────────────

export const ExerciseContainer = styled.div`
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.accent};
  overflow: hidden;
`;

export const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${(p) => `${p.theme.colors.accent}10`};
  border-bottom: 1px solid ${(p) => p.theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.accent};
`;

export const ExerciseContent = styled.div`
  padding: 1rem;
  font-size: 0.9375rem;
  line-height: 1.7;
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
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    word-break: break-all;
  }

  pre {
    overflow-x: auto;
    padding: 0.75rem;
    border-radius: 6px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-size: 0.8125rem;
    line-height: 1.5;

    code {
      background: none;
      border: none;
      padding: 0;
      word-break: normal;
    }
  }
`;

export const ExerciseEditorWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};

  .cm-editor {
    font-size: 0.8125rem;
    max-height: 400px;
  }

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-scroller {
    overflow: auto;
  }
`;

export const ExerciseToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;

export const RunButton = styled.button<{ $running?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  border: none;
  background: ${(p) => (p.$running ? p.theme.colors.muted : p.theme.colors.accent)};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: ${(p) => (p.$running ? 'wait' : 'pointer')};
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
  }
`;

export const ToolbarInfo = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-left: auto;
`;

export const OutputPanel = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

export const OutputHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;

export const OutputBody = styled.pre<{ $isError?: boolean }>`
  margin: 0;
  padding: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  font-family: var(--font-geist-mono, 'Geist Mono', monospace);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => (p.$isError ? p.theme.colors.error : p.theme.colors.foreground)};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
`;

export const ExpectedOutput = styled.div`
  padding: 0.5rem 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    font-weight: 600;
  }

  pre {
    margin: 0.375rem 0 0;
    padding: 0.5rem 0.625rem;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-family: var(--font-geist-mono, 'Geist Mono', monospace);
    font-size: 0.75rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;
