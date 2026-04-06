'use client';

import * as S from './Footer.styles';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <S.Container>
      <S.Brand>Strive</S.Brand>
      <S.Copyright>&copy; {year} Strive. All rights reserved.</S.Copyright>
    </S.Container>
  );
};
