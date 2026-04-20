import styled from 'styled-components';

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(120px, auto);
  grid-auto-flow: dense;
  gap: 1rem;

  ${(p) => p.theme.media.tabletLarge} {
    grid-template-columns: repeat(6, 1fr);
  }

  ${(p) => p.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

type SlotProps = { $cols?: number; $rows?: number };

export const Slot = styled.div<SlotProps>`
  grid-column: span ${({ $cols = 4 }) => $cols};
  grid-row: span ${({ $rows = 1 }) => $rows};
  display: flex;
  min-width: 0;

  > * {
    flex: 1;
    min-width: 0;
  }

  ${(p) => p.theme.media.tablet} {
    grid-column: 1 / -1;
    grid-row: auto;
  }
`;
