'use client';

import * as S from './BentoGrid.styles';
import type { ReactNode } from 'react';

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
