import styled from 'styled-components';
import { pressable, touchHitArea } from '@/theme';

export const MermaidContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: var(--shadow-card-soft);
`;

export const MermaidViewport = styled.div<{ $dragging?: boolean; $zoomed?: boolean }>`
  height: 500px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.background};
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
  user-select: none;

  /* touch-action is STATE-DRIVEN, not a constant.
     It used to be a flat 'none', which meant a 500px-tall diagram sitting
     inline in a lesson swallowed any scroll gesture that happened to start on
     it — the page simply froze under the finger. Measured on the shipping
     build: touchAction "none" on a 324x500 element.

     At base zoom the diagram fits, so nothing needs panning and the browser
     keeps vertical scrolling ('pan-y'). Once the user has zoomed in, one-finger
     drag becomes panning and the browser must yield ('none').

     This has to be state-driven rather than toggled from a pointerdown
     handler: the UA resolves the effective touch-action during hit-testing at
     touch-sequence start, BEFORE pointerdown reaches JS, so a handler-side
     toggle only ever affects the *next* gesture. Pinch is unaffected by
     'pan-y' (it is a two-pointer gesture), which is what lets the user get
     from base zoom to zoomed-in in the first place. */
  touch-action: ${(p) => (p.$zoomed ? 'none' : 'pan-y')};
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

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.surface};
    }
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  ${pressable}

  ${touchHitArea}
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
