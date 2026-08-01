import styled from 'styled-components';

export const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

export const Trigger = styled.button`
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  color: inherit;
  /* Icon triggers are small — pad the hit area to WCAG 2.2's 24px
     minimum, with a negative margin so layout doesn't shift. */
  padding: 5px;
  margin: -5px;

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Bubble = styled.span<{ $open: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 50;
  width: max-content;
  max-width: min(280px, 78vw);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-lift-strong);
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  white-space: normal;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  visibility: ${(p) => (p.$open ? 'visible' : 'hidden')};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transform: translateX(-50%) translateY(${(p) => (p.$open ? '0' : '2px')});
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s;

  /* Keyboard focus reveals regardless of pointer capability. */
  ${Trigger}:focus-visible + & {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  ${(p) => p.theme.media.hover} {
    ${Wrap}:hover & {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
