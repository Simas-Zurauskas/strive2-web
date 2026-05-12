import styled from 'styled-components';

// Outer chrome for the course-creation chat — mirrors the lesson
// mentor's panel chrome (CourseShell ChatPanel.styles): a header strip
// with an eyebrow + help anchor and an optional close button, then a
// body that holds the shared `<Chat>` component. Same vocabulary so
// users perceive "one chat panel" across the app.

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  background: ${(p) => p.theme.colors.surface};
  /* On desktop this lives as a rounded card embedded inside the
     two-column layout. The drawer wrapper at tablet supplies its own
     border-left + shadow, so the rounded card treatment here would
     fight it; keep the chrome simple and let the surrounding context
     decide the framing. */
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 1rem;
  min-height: 0;
  overflow: hidden;

  /* Inside the structure-step drawer (tablet+below) the surrounding
     ChatColumn already provides a left border, padding, and shadow,
     so the inner panel drops its own card framing to keep one clean
     visual edge. */
  ${(p) => p.theme.media.desktop} {
    border: none;
    border-radius: 0;
    background: transparent;
  }
`;

// Top strip — collapse/close button at the inner edge, eyebrow + help
// anchor in the middle, optional clear button at the outer edge. Same
// shape as the lesson mentor panel's header.
export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  flex-shrink: 0;
  min-height: 52px;
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
  flex: 1;
`;

export const HeaderEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const HeaderContext = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
`;

export const Body = styled.div`
  min-height: 0;
  overflow: hidden;
`;
