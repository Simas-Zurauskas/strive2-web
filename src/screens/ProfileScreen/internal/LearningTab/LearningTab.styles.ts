import styled from 'styled-components';

export const SideBySide = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 0;

    > *:first-child {
      margin-bottom: 1.5rem;
    }
  }
`;
