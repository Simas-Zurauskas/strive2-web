import styled from 'styled-components';

export const CalendarWrap = styled.div<{ $loading?: boolean }>`
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;

  /* Hide calendar visually while loading but keep it for sizing */
  ${(p) =>
    p.$loading &&
    `
    pointer-events: none;
    > :first-child {
      visibility: hidden;
    }
  `}

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;

export const SkeletonOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;
