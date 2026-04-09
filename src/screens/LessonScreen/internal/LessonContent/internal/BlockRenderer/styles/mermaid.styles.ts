import styled from 'styled-components';

export const MermaidContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const MermaidViewport = styled.div<{ $dragging?: boolean }>`
  height: 500px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.background};
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
  touch-action: none;
  user-select: none;
`;

export const MermaidCanvas = styled.div`
  padding: 1.5rem;
  transform-origin: 0 0;
`;

export const MermaidToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;

export const MermaidToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surface};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const MermaidZoomLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  min-width: 36px;
  text-align: center;
  letter-spacing: 0.02em;
`;

export const MermaidFallback = styled.div`
  padding: 1rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
`;

// Keep old name as alias for backwards compat in case anything imports it
export const MermaidDiagram = MermaidViewport;
