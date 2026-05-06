import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  &:last-child {
    border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const Trigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-2) var(--space-4) 0;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;

export const TriggerLabel = styled.span`
  flex: 1;
  line-height: 1.4;
`;

// Editorial italic-serif "+" / "–" character — matches Strive's typographic
// voice (the same italic-serif used for headings, eyebrows, accents). Reads
// as a scholarly "Q&A" appendix rather than a help-center accordion.
export const TriggerIcon = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1;
  color: ${(p) => p.theme.colors.tertiary};
  flex-shrink: 0;
  width: 14px;
  text-align: center;
  user-select: none;
`;

// Smooth open/close via grid-template-rows transition: a modern CSS-only
// pattern that animates between auto and 0 height for any content.
// Container goes 0fr → 1fr; the inner clip has overflow: hidden so the
// content visually expands/collapses without JS height-measurement.
export const Body = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.25s ease;
`;

export const BodyClip = styled.div`
  overflow: hidden;
`;

export const BodyInner = styled.div`
  padding: 0 var(--space-2) var(--space-4) 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.muted};
  max-width: 60ch;

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
  }

  em {
    font-style: italic;
    color: ${(p) => p.theme.colors.foreground};
  }

  & > p {
    margin: 0;
  }

  & > p + p {
    margin-top: var(--space-2);
  }
`;
