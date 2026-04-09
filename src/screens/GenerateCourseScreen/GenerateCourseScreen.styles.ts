import styled, { keyframes } from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 0 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 0;
  }
`;

export const Container = styled.div<{ $wide?: boolean; $semiWide?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.$wide ? '1200px' : p.$semiWide ? '820px' : '640px')};
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  flex-shrink: 0;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 1.5rem;
`;

export const StepperWrapper = styled.div`
  padding-bottom: 2rem;
  border-bottom: 1px solid ${(p) => p.theme.colorsLib.gray900}1a;
`;

export const Content = styled.div``;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${fadeIn} 0.4s ease;
`;

export const DeleteLink = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    text-decoration: underline;
  }
`;

export const CourseName = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: -0.01em;
  font-style: italic;
`;
