import styled, { css, keyframes } from 'styled-components';

const travel = keyframes`
  from { left: 4%; opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  to   { left: 88%; opacity: 0; }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.5rem 0;
`;

export const SourcesCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ColLabel = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const SourceCard = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  box-shadow: ${(p) => (p.$active ? 'var(--shadow-pop)' : 'none')};
  opacity: ${(p) => (p.$active ? 1 : 0.6)};
  transform: scale(${(p) => (p.$active ? 1 : 0.97)});
  transition:
    opacity 0.4s ease,
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const SourceKind = styled.span`
  flex-shrink: 0;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
`;

export const SourceName = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const Flow = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 8px;
  align-self: center;
`;

export const FlowLine = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: ${(p) => p.theme.colors.surfaceBorder};
`;

export const FlowDot = styled.span<{ $animate: boolean }>`
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  margin-top: -3.5px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
  ${(p) =>
    p.$animate
      ? css`
          animation: ${travel} 1.4s ease-in-out;
        `
      : css`
          left: 88%;
        `}
`;

export const CourseCol = styled.div`
  flex: 1.1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const OutlineCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-card);
`;

export const OutlineRow = styled.span<{ $lit: boolean; $indent?: boolean; $w: number }>`
  height: 6px;
  border-radius: 9999px;
  width: ${(p) => p.$w}%;
  margin-left: ${(p) => (p.$indent ? '14%' : '0')};
  background: ${(p) => (p.$lit ? p.theme.colors.tertiary : p.theme.colors.border)};
  opacity: ${(p) => (p.$lit ? 0.85 : 0.45)};
  transition:
    background 0.4s ease,
    opacity 0.4s ease;
`;
