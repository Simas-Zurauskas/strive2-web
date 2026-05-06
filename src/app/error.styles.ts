import styled from 'styled-components';

export const Container = styled.main`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

export const Card = styled.div`
  max-width: 32rem;
  width: 100%;
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  background: var(--surface);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif, serif);
  font-style: italic;
  font-size: 1.75rem;
  margin: 0;
`;

export const Body = styled.p`
  margin: 0;
  color: var(--foreground-muted);
  line-height: 1.5;
`;

export const Digest = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-family: var(--font-geist-mono, monospace);
  font-size: 0.75rem;
  color: var(--foreground-subtle);
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;
