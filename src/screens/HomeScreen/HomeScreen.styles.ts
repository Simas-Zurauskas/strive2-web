import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const LoadingText = styled.p`
  font-size: 1rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  padding: 4rem 0;
`;
