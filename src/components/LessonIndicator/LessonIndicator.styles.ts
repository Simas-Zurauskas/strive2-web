import styled, { keyframes } from 'styled-components';
import type { LessonIndicatorState } from './LessonIndicator';

const pulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
`;

export const Wrapper = styled.span<{ $state: LessonIndicatorState }>`
  // Fixed square slot. Height matches the text's line-height so the icon
  // vertically centers with the first line of a (potentially wrapping)
  // lesson name. Matching width keeps the text after the icon at the same
  // horizontal position across all five states — without a fixed width
  // the smaller Circle (6px) shifts text closer than the Check/Minus
  // icons (12-14px), and rows look jagged. Icons center inside the slot
  // via align-items / justify-content.
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.4em;
  height: 1.4em;
  color: ${(p) => {
    switch (p.$state) {
      case 'completed':
        return p.theme.colors.success;
      case 'generating':
      case 'in_progress':
        return p.theme.colors.accent;
      case 'ready':
        return p.theme.colors.muted;
      default:
        return p.theme.colors.border;
    }
  }};
  opacity: ${(p) => (p.$state === 'locked' ? 0.4 : 1)};
`;

export const Pulse = styled.span`
  display: inline-flex;
  animation: ${pulse} 1.1s ease-in-out infinite;
`;
