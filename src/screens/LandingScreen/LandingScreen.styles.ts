'use client';

import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${(p) => p.theme.colors.background};
`;

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SectionInner = styled.div`
  width: 100%;
  max-width: 1120px;
  padding: 0 var(--space-8);

  ${(p) => p.theme.media.tabletLarge} {
    padding: 0 var(--space-5);
  }
`;
