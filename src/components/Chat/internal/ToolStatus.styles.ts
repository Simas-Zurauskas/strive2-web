import styled, { keyframes } from 'styled-components';

// "Typing dots" indicator — universal chat vocabulary (iMessage,
// ChatGPT, Slack). Three small dots that wave in sequence, fading in
// and rising slightly on each pulse, then fading out. Reads as
// "the assistant is preparing a response" at a glance.

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Each dot is offset by 160ms so the pulse runs as a wave across the
// row. The 0%/60%/100% rest opacity gives a clear "off-then-pulse"
// rhythm rather than a constant breathe.
const dotPulse = keyframes`
  0%, 60%, 100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.125rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Dot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.tertiary};
  animation: ${dotPulse} 1.2s ease-in-out infinite;
`;
