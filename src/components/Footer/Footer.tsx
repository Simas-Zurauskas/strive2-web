'use client';

import Link from 'next/link';
import * as S from './Footer.styles';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <S.Container>
      <S.Brand>Strive</S.Brand>
      <S.Links>
        <S.FooterLink as={Link} href="/terms" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </S.FooterLink>
        <S.FooterLink as={Link} href="/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </S.FooterLink>
      </S.Links>
      <S.Copyright>&copy; {year} Strive. All rights reserved.</S.Copyright>
    </S.Container>
  );
};
