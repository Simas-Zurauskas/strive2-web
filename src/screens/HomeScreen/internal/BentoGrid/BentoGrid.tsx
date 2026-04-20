'use client';

import type { ReactNode } from 'react';
import * as S from './BentoGrid.styles';

interface BentoGridProps {
  children: ReactNode;
}

export const BentoGrid = ({ children }: BentoGridProps) => {
  return <S.Grid aria-label="Dashboard widgets">{children}</S.Grid>;
};

interface BentoSlotProps {
  cols?: number;
  rows?: number;
  children: ReactNode;
}

export const BentoSlot = ({ cols, rows, children }: BentoSlotProps) => {
  return (
    <S.Slot $cols={cols} $rows={rows}>
      {children}
    </S.Slot>
  );
};
