import styled from 'styled-components';

export const TabWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const IntroTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const IntroText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
`;
