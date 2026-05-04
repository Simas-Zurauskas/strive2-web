import styled, { keyframes } from 'styled-components';

const dotPulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50%      { opacity: 1;   transform: scale(1.1);  }
`;

export const Container = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  padding: 1.125rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-lg);
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    border-style: solid;
    background: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 4%, ${p.theme.colors.surface})`};
    box-shadow: var(--shadow-card);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatusDot = styled.span<{ $generating: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => (p.$generating ? p.theme.colors.tertiary : p.theme.colors.muted)};
  animation: ${(p) => (p.$generating ? dotPulse : 'none')} 1.6s ease-in-out infinite;
`;

export const TimeAgo = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

export const Name = styled.h4`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export const Goal = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /* Reserve 2 lines so all draft cards in a row land at the same height. */
  min-height: 2.36rem;
`;

export const EyebrowAccent = styled.span`
  color: ${(p) => p.theme.colors.tertiary};
  font-weight: 600;
`;
