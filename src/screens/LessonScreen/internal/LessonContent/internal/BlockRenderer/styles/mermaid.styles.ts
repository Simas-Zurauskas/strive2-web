import styled from 'styled-components';
import { pressable, touchHitArea } from '@/theme';

export const MermaidContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: var(--shadow-card-soft);
`;

export const MermaidViewport = styled.div<{ $dragging?: boolean; $zoomed?: boolean }>`
  /* Was a flat 'height: 500px'. On a 320x568 phone that made the widget 543px
     of a 568px viewport (96%) around a 238x147 diagram — 353px of empty box.
     Worse, in landscape (852x393) a 543px widget means the diagram and the
     three zoom buttons that fix an illegible diagram can never be on screen at
     the same time: with the diagram centred the toolbar sat 91-119px below the
     fold. Size against the viewport instead, capped at the old value so nothing
     changes on a normal desktop window (>=834px tall resolves to exactly 500px).
     calcFit() in MermaidBlock is driven by a ResizeObserver on this element, so
     auto-fit re-runs on every height change and nothing here needs the number. */
  height: min(60dvh, 500px);

  /* Narrow phones: the diagram must not eat the lesson it illustrates.
     320x568 -> 284 + 41px toolbar = 325px, 57% of the viewport (was 96%). */
  ${(p) => p.theme.media.mobile} {
    height: min(50dvh, 380px);
  }

  /* Landscape phones: height, not width, is the scarce axis. Ordered after the
     width query so it wins when both match. 852x393 -> 216 + 41 = 257px (65%),
     which is the first height at which the diagram and the zoom controls are
     co-visible — at 543px the widget was 138% of the viewport. */
  @media (max-height: 500px) {
    height: min(55dvh, 260px);
  }

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
