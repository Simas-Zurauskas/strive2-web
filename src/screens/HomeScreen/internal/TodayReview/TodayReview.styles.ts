import styled, { keyframes } from 'styled-components';

const pulseRing = keyframes`
  0%   { transform: scale(0.85); opacity: 0.4; }
  100% { transform: scale(1.6);  opacity: 0;   }
`;

export const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const Label = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

/** Two-column strip with a hairline divider between cells. */
export const Strip = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: stretch;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-xl);
  overflow: hidden;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.span`
  background: ${(p) => p.theme.colors.surfaceBorder};

  ${(p) => p.theme.media.tablet} {
    display: none;
  }
`;

export const Cell = styled.button<{ $passive?: boolean }>`
  text-align: left;
  padding: 1.125rem 1.375rem;
  /* Locks both real cells + skeleton cells to the same vertical footprint
     regardless of which combination of count / label / title / sub renders
     in the body — eliminates the small shift when data lands. */
  min-height: 6rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: none;
  width: 100%;
  font: inherit;
  color: inherit;
  cursor: ${(p) => (p.$passive ? 'default' : 'pointer')};
  transition: background 160ms ease;

  ${(p) =>
    !p.$passive &&
    `
    &:hover {
      background: ${p.theme.colors.accentMuted};
    }
  `}

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: -2px;
  }
`;

export const Count = styled.span<{ $tone: 'active' | 'calm' }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1;
  color: ${(p) => (p.$tone === 'active' ? p.theme.colors.accent : p.theme.colors.muted)};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  min-width: 1.625rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const CountIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.muted};
  width: 1.625rem;
  height: 1.625rem;
  flex-shrink: 0;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  flex: 1;
  min-width: 0;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CellLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
`;

export const CellTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CellTitleCalm = styled(CellTitle)`
  color: ${(p) => p.theme.colors.muted};
`;

export const CellSub = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  transition:
    color 160ms ease,
    transform 160ms ease;

  ${Cell}:hover & {
    color: ${(p) => p.theme.colors.accent};
    transform: translateX(3px);
  }
`;

export const PulseDot = styled.span`
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.error};
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.error};
    opacity: 0.28;
    animation: ${pulseRing} 1.8s ease-out infinite;
  }
`;
