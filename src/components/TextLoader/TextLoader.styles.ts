import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 0;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${fadeIn} 0.4s ease;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
