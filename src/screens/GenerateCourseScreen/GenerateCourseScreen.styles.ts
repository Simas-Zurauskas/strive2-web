import styled from 'styled-components';

export const Layout = styled.div<{ $wide?: boolean }>`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(p) => (p.$wide ? 'flex-start' : 'center')};
  padding: 2rem;
`;

export const Container = styled.div<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.$wide ? '1200px' : '640px')};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex-shrink: 0;
  transition: max-width 0.3s ease;
`;

export const Nav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  z-index: 10;

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: none;
    font-size: 0.875rem;
  }
`;

export const StepperWrapper = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const Content = styled.div``;

export const DeleteLink = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.error};
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CourseName = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: -0.01em;
`;
