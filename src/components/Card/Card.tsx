'use client';

import * as S from './Card.styles';

interface CardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const Card = ({ header, children }: CardProps) => {
  return (
    <S.Container>
      {header && <S.Header>{header}</S.Header>}
      {children}
    </S.Container>
  );
};
