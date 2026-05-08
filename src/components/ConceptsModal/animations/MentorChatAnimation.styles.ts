import styled, { css, keyframes } from 'styled-components';

// Used to estimate steps for the typing animation. We pick the longest
// of the two prompts so neither over-runs.
const COURSE_PROMPT_LEN = 22;

const typeIn = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  align-items: stretch;
  position: relative;
`;

export const Panel = styled.div<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  opacity: ${(p) => (p.$active ? 1 : 0.5)};
  filter: ${(p) => (p.$active ? 'none' : 'saturate(0.55)')};
  transform: scale(${(p) => (p.$active ? 1 : 0.96)});
  transition:
    opacity 0.45s ease,
    border-color 0.4s ease,
    filter 0.4s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(p) => (p.$active ? 'var(--shadow-pop)' : 'none')};
`;

// Vertical divider separating the two scopes
export const Divider = styled.span`
  display: block;
  width: 1px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  margin: 1rem 0;
  flex-shrink: 0;
`;

export const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const PanelEyebrow = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const PanelHint = styled.span`
  font-size: 0.6rem;
  color: ${(p) => p.theme.colors.muted};
  font-style: italic;
`;

// ── Lesson scope content ──
export const LessonPage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
`;

export const PageRow = styled.span<{ $w: number; $highlight?: boolean }>`
  display: block;
  height: 6px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) =>
    p.$highlight ? p.theme.colors.tertiary : p.theme.colors.muted};
  opacity: ${(p) => (p.$highlight ? 0.85 : 0.4)};
  transition: background 0.3s ease, opacity 0.3s ease;
`;

// ── Course scope content ──
export const Outline = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
`;

export const OutRow = styled.span<{
  $w: number;
  $indent?: boolean;
  $highlight?: boolean;
  $checked?: boolean;
}>`
  position: relative;
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) =>
    p.$highlight ? p.theme.colors.tertiary : p.theme.colors.muted};
  opacity: ${(p) => (p.$highlight ? 0.85 : 0.4)};
  margin-left: ${(p) => (p.$indent ? '12px' : '0')};
  transition: background 0.3s ease, opacity 0.3s ease;

  ${(p) =>
    p.$checked &&
    `
    &::after {
      content: '✓';
      position: absolute;
      right: -14px;
      top: -6px;
      font-size: 0.625rem;
      font-weight: 700;
      color: ${p.theme.colors.success};
      line-height: 1;
    }
  `}
`;

// ── Chat bubble ──
export const Bubble = styled.div<{ $on: boolean }>`
  margin-top: 4px;
  padding: 6px 8px 6px 6px;
  border-radius: 12px 12px 12px 2px;
  background: ${(p) => (p.$on ? p.theme.colors.tertiaryMuted : p.theme.colors.surface)};
  border: 1px solid
    ${(p) => (p.$on ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: ${(p) => (p.$on ? 1 : 0.45)};
  transform: translateY(${(p) => (p.$on ? '0' : '4px')});
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  ${(p) => p.$on && css`animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);`}
`;

export const BubbleAvatar = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  background: ${(p) => p.theme.colors.tertiary};
  color: ${(p) => p.theme.colors.surface};
  flex-shrink: 0;
`;

// Typing animation: width grows from 0 to 100%, with overflow-hidden +
// monospace nowrap so it reads as "characters appearing"
export const BubbleText = styled.span<{ $typing: boolean }>`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  font-family: var(--font-mono, monospace);
  ${(p) => p.$typing && css`animation: ${typeIn} 1.4s steps(${COURSE_PROMPT_LEN}, end);`}
`;
