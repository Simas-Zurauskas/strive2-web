import styled, { keyframes } from 'styled-components';
import type { GradeVerdict } from '@/api/types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  animation: ${fadeIn} 0.2s ease;

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem;
  }
`;

export const SourceRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const SourceLink = styled.a`
  color: inherit;
  text-decoration: none;
  min-width: 0;
  word-break: break-word;

  svg {
    display: inline-block;
    vertical-align: -1px;
    margin-left: 0.25rem;
  }

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    text-decoration: underline;
  }
`;

export const SourceBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

// ── Mode toggle (segmented control) ─────────────────
//
// Icon + short text label makes it read as an interactive control at a
// glance rather than decorative metadata. Active option uses accent fill
// (inverted text) for strong visual presence — unambiguously "selected."

export const ModeToggle = styled.div`
  display: inline-flex;
  align-items: stretch;
  padding: 3px;
  border-radius: 9999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
`;

export const ModeOption = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  border: none;
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.muted)};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    color: ${(p) => (p.$active ? p.theme.colors.surface : p.theme.colors.foreground)};
  }

  &:disabled {
    cursor: default;
  }
`;

export const Badge = styled.span<{ $variant?: 'kind' | 'new' | 'box' | 'mode' }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${(p) => {
    if (p.$variant === 'new') return `${p.theme.colors.accent}20`;
    if (p.$variant === 'box') return `${p.theme.colors.success}18`;
    if (p.$variant === 'mode') return `${p.theme.colors.warning}20`;
    return p.theme.colors.surfaceBorder;
  }};
  color: ${(p) => {
    if (p.$variant === 'new') return p.theme.colors.accent;
    if (p.$variant === 'box') return p.theme.colors.success;
    if (p.$variant === 'mode') return p.theme.colors.warning;
    return p.theme.colors.muted;
  }};
`;

export const Prompt = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.01em;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.tablet} {
    font-size: 1.125rem;
  }
`;

export const BlankSlot = styled.span<{ $revealed: boolean }>`
  display: inline-block;
  min-width: 4rem;
  padding: 0 0.375rem;
  border-radius: 4px;
  background: ${(p) => (p.$revealed ? `${p.theme.colors.success}20` : p.theme.colors.surfaceBorder)};
  color: ${(p) => (p.$revealed ? p.theme.colors.success : 'transparent')};
  border-bottom: 2px solid ${(p) => (p.$revealed ? p.theme.colors.success : p.theme.colors.muted)};
  font-family: inherit;
  font-weight: 600;
`;

export const AnswerBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem 1.125rem;
  background: ${(p) => p.theme.colors.background};
  border-left: 3px solid ${(p) => p.theme.colors.accent};
  border-radius: 6px;
  animation: ${fadeIn} 0.2s ease;
`;

export const AnswerLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(p) => p.theme.colors.muted};
`;

export const AnswerText = styled.span`
  font-size: 1.0625rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;

// ── Reveal divider (tap-mode primary action) ────────
//
// Anki-style card flip affordance — a horizontal rule with a centered action
// label. Quieter than a filled button but unmistakably interactive. The
// button is full-width so the hit target is generous on mobile.

export const RevealDivider = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) => p.theme.colors.border};
    transition: background 0.15s;
  }

  &:hover {
    color: ${(p) => p.theme.colors.accent};

    &::before,
    &::after {
      background: ${(p) => p.theme.colors.accent};
    }
  }

  &:focus-visible {
    outline: none;
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const RevealLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

// ── Footer (tags + Skip escape hatch) ───────────────

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SkipLink = styled.button`
  padding: 0;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Typed recall ─────────────────────────────────────

export const TypedRow = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
`;

export const TypedInput = styled.input`
  flex: 1;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.9375rem;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const TypedSubmit = styled.button`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.accent};
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => p.theme.colors.surface};
  font-family: inherit;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
`;

// ── Verdict panel (AI-graded typed recall) ───────────

const verdictColor = (
  verdict: GradeVerdict | null,
  colors: { success: string; accent: string; error: string; muted: string },
): string => {
  switch (verdict) {
    case 'correct': return colors.success;
    case 'partial': return colors.accent;
    case 'incorrect': return colors.error;
    default: return colors.muted;
  }
};

export const VerdictPanel = styled.div<{ $verdict: GradeVerdict | null }>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => `${verdictColor(p.$verdict, p.theme.colors)}33`};
  background: ${(p) => `${verdictColor(p.$verdict, p.theme.colors)}0D`};
`;

export const VerdictHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const YourAnswer = styled.span`
  font-size: 0.8125rem;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const VerdictPill = styled.span<{ $verdict: GradeVerdict }>`
  display: inline-block;
  padding: 0.1875rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
  background: ${(p) => `${verdictColor(p.$verdict, p.theme.colors)}22`};
  color: ${(p) => verdictColor(p.$verdict, p.theme.colors)};
`;

export const GradingSpinner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const VerdictFeedback = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

// ── Tags ─────────────────────────────────────────────

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const Tag = styled.span`
  padding: 0.1875rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 500;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.tertiary};
`;
