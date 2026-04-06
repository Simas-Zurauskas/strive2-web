import styled, { css, keyframes } from 'styled-components';
import { thinScrollbar } from '@/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ── Shared ─────────────────────────────────────────────

export const BlockWrapper = styled.div`
  line-height: 1.75;
  font-size: 1em;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Intro ──────────────────────────────────────────────

export const IntroText = styled.div`
  font-size: 1.1em;
  line-height: 1.75;
  color: ${(p) => p.theme.colors.foreground};
  position: relative;
  padding-top: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 3px;
    background: ${(p) => p.theme.colors.accent};
    border-radius: 2px;
  }

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

export const SectionContent = styled.div<{ $first?: boolean }>`
  line-height: 1.75;
  font-size: 1em;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) =>
    p.$first &&
    `
    /* Drop cap on the opening paragraph of the first section */
    > p:first-of-type::first-letter {
      font-family: var(--font-heading-serif), Georgia, serif;
      font-size: 3.25em;
      float: left;
      line-height: 0.8;
      margin-right: 0.1em;
      margin-top: 0.1em;
      font-weight: 600;
      color: ${p.theme.colors.foreground};
    }
  `}

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.6em;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    color: ${(p) => p.theme.colors.foreground};
    line-height: 1.25;
  }

  h3 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.2em;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin-top: 1.5rem;
    margin-bottom: 0.625rem;
    color: ${(p) => p.theme.colors.foreground};
  }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1rem;
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
    margin-bottom: 1rem;
    font-size: 0.875em;
    border-radius: 8px;
    overflow: hidden;
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
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const CodeLanguage = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const CopyButton = styled.button`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.background};
  }
`;

export const CodePre = styled.pre`
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.6;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  ${thinScrollbar}

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
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 4px solid;
  font-size: 1em;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.foreground};
  animation: ${fadeIn} 0.3s ease-out;
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
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
  opacity: 0.7;
`;

// ── Key Concept (pull-quote variant) ──────────────────

export const KeyConceptContainer = styled.div`
  text-align: center;
  padding: 2.5rem 2rem;
  margin: 0.5rem 0;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;

  &::before, &::after {
    content: '';
    display: block;
    width: 48px;
    height: 1px;
    background: ${(p) => p.theme.colors.border};
    margin: 0 auto;
  }
  &::before { margin-bottom: 1.5rem; }
  &::after { margin-top: 1.5rem; }
`;

export const KeyConceptLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 1rem;
`;

export const KeyConceptQuote = styled.blockquote`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.45em;
  font-style: italic;
  font-weight: 400;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  max-width: 560px;
  margin: 0 auto;
`;

// ── Mermaid ────────────────────────────────────────────

export const MermaidContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const MermaidDiagram = styled.div`
  padding: 1.5rem;
  overflow: auto;
  background: ${(p) => p.theme.colors.background};
  ${thinScrollbar}

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
  padding: 0.5rem 1rem;
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.6875rem;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Summary ────────────────────────────────────────────

export const SummaryContainer = styled.div`
  padding: 1.75rem;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const SummaryTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 1rem;
`;

export const SummaryList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0;
  margin: 0;
`;

export const SummaryItem = styled.li`
  font-size: 1em;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.foreground};
  padding-left: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5em;
    width: 7px;
    height: 7px;
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
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const LinksHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  transition: background 0.15s, transform 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(p) => `${p.theme.colors.accent}06`};
    transform: translateX(4px);
  }
`;

export const LinkTitle = styled.span`
  font-size: 0.9375em;
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
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const QuizHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const QuizQuestion = styled.p`
  padding: 1.25rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125em;
  font-weight: 500;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
`;

export const QuizOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.25rem 1.25rem;
  gap: 0.5rem;
`;

type QuizOptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export const QuizOption = styled.button<{ $state: QuizOptionState }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.border};
  background: ${(p) =>
    p.$state === 'selected'
      ? `${p.theme.colors.accent}10`
      : p.$state === 'correct'
        ? `${p.theme.colors.success}10`
        : p.$state === 'incorrect'
          ? `${p.theme.colors.error}10`
          : p.theme.colors.background};
  color: ${(p) => (p.$state === 'dimmed' ? p.theme.colors.muted : p.theme.colors.foreground)};
  font-size: 0.9375em;
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$state === 'default' || p.$state === 'selected' ? 'pointer' : 'default')};
  line-height: 1.4;
  transition: all 0.2s ease;

  ${(p) =>
    (p.$state === 'default' || p.$state === 'selected') &&
    `&:hover {
      border-color: ${p.theme.colors.accent};
      background: ${p.theme.colors.surface};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }`}
`;

export const QuizOptionLetter = styled.span<{ $state: QuizOptionState }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.surface};
  color: ${(p) =>
    p.$state === 'selected' || p.$state === 'correct' || p.$state === 'incorrect'
      ? '#fff'
      : p.theme.colors.muted};
  border: 1px solid ${(p) =>
    p.$state === 'selected'
      ? p.theme.colors.accent
      : p.$state === 'correct'
        ? p.theme.colors.success
        : p.$state === 'incorrect'
          ? p.theme.colors.error
          : p.theme.colors.border};
  transition: all 0.2s ease;
`;

export const QuizConfirmButton = styled.button`
  margin: 0.75rem 1.25rem 1rem;
  padding: 0.625rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

export const QuizExplanation = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => `${p.theme.colors.success}08`};
  font-size: 0.9375em;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
`;

// ── Exercise ───────────────────────────────────────────

export const ExerciseContainer = styled.div`
  border-radius: 12px;
  border: 2px solid ${(p) => p.theme.colors.accent};
  overflow: hidden;
  box-shadow: 0 2px 16px ${(p) => `${p.theme.colors.accent}10`};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => `${p.theme.colors.accent}0C`};
  border-bottom: 1px solid ${(p) => `${p.theme.colors.accent}30`};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.accent};
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
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    word-break: break-all;
  }

  pre {
    overflow-x: auto;
    padding: 0.75rem;
    border-radius: 8px;
    background: ${(p) => p.theme.colors.surface};
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
    ${thinScrollbar}
  }
`;

export const ExerciseToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;

export const RunButton = styled.button<{ $running?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  border: none;
  background: ${(p) => (p.$running ? p.theme.colors.muted : p.theme.colors.accent)};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: ${(p) => (p.$running ? 'wait' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: none;
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
  padding: 0.5rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const OutputBody = styled.pre<{ $isError?: boolean }>`
  margin: 0;
  padding: 1rem;
  font-size: 0.8125rem;
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
  padding: 0.5rem 1rem;
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
    border-radius: 6px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-family: var(--font-geist-mono, 'Geist Mono', monospace);
    font-size: 0.75rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// ── Skeleton placeholders ─────────────────────────────

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const skeletonBg = css`
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.surface} 25%,
    ${(p) => p.theme.colors.border} 50%,
    ${(p) => p.theme.colors.surface} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const SkeletonBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
`;

export const SkeletonLine = styled.div<{ $width?: string }>`
  height: 0.875rem;
  width: ${(p) => p.$width ?? '100%'};
  border-radius: 6px;
  ${skeletonBg}
`;

export const SkeletonOption = styled.div`
  height: 2.75rem;
  border-radius: 10px;
  ${skeletonBg}
`;

export const SkeletonCodeBlock = styled.div`
  height: 6rem;
  border-radius: 8px;
  ${skeletonBg}
`;
