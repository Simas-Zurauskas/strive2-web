import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;
