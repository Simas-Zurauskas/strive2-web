import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseWave = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
  animation: ${fadeIn} 0.35s ease-out;
`;

export const Text = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  display: inline-flex;
  flex-wrap: wrap;
  letter-spacing: 0.01em;
`;

export const AnimatedChar = styled.span`
  display: inline-block;
  animation: ${pulseWave} 1.2s ease-in-out infinite;
  opacity: 0.3;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;
  font-size: 0.8125rem;
`;
