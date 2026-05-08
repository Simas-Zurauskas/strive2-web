import styled, { css, keyframes } from 'styled-components';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
`;

type Variant = 'inline' | 'module';

const tone = (v: Variant, theme: { colors: { tertiary: string; accent: string } }) =>
  v === 'inline' ? theme.colors.tertiary : theme.colors.accent;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const Stage = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Sequenced crossfade: outgoing card drifts a few pixels back to its
   home side + scales down + fades out fast (no delay); incoming card
   drifts in from its home side + scales up + fades in with a small
   delay. The brief gap between exit-end and entry-start keeps both
   cards from rendering at half-opacity at the same time. */
export const Card = styled.div<{ $active: boolean; $variant: Variant; $index: number }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.125rem 0.875rem;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$active ? tone(p.$variant, p.theme) : p.theme.colors.surfaceBorder)};
  box-shadow: ${(p) => (p.$active ? 'var(--shadow-panel-lg)' : 'var(--shadow-lift)')};
  transform-origin: center center;
  transform: ${(p) => {
    if (p.$active) return 'translateX(0) scale(1)';
    return p.$index === 0
      ? 'translateX(-14px) scale(0.985)'
      : 'translateX(14px) scale(0.985)';
  }};
  opacity: ${(p) => (p.$active ? 1 : 0)};
  pointer-events: ${(p) => (p.$active ? 'auto' : 'none')};
  z-index: ${(p) => (p.$active ? 2 : 1)};
  transition: ${(p) =>
    p.$active
      ? 'transform 0.6s cubic-bezier(0.32, 0.72, 0, 1) 140ms, opacity 0.42s cubic-bezier(0.4, 0, 0.2, 1) 170ms, border-color 0.4s ease, box-shadow 0.5s ease'
      : 'transform 0.42s cubic-bezier(0.4, 0, 1, 1), opacity 0.28s cubic-bezier(0.4, 0, 1, 1), border-color 0.4s ease, box-shadow 0.5s ease'};
`;

export const Eyebrow = styled.span<{ $variant: Variant }>`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  color: ${(p) => tone(p.$variant, p.theme)};
`;

export const Label = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Question = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 4px;
`;

export const QuestionLine = styled.span<{ $w: number; $delay: number }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.muted};
  opacity: 0.45;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const Options = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

export const Option = styled.span<{ $on?: boolean; $delay: number }>`
  flex: 1;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 6px 0;
  border-radius: 6px;
  background: ${(p) => (p.$on ? p.theme.colors.tertiary : p.theme.colors.surface)};
  color: ${(p) => (p.$on ? p.theme.colors.surface : p.theme.colors.muted)};
  border: 1px solid
    ${(p) => (p.$on ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${(p) => p.$delay}ms backwards;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 6px;
`;

export const ScoreBadge = styled.span<{ $on: boolean }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};
  ${(p) => p.$on && css`animation: ${popIn} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 380ms backwards;`}
`;

export const Detail = styled.span`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  margin-left: auto;
`;
