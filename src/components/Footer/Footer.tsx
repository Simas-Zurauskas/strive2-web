'use client';

import Link from 'next/link';
import * as S from './Footer.styles';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <S.Container>
      <S.Inner>
        <S.Top>
          <S.Brand>
            <S.Wordmark>Strive</S.Wordmark>
            <S.Tagline>
              A real course on anything you want to learn.
              <br />
              Generated for you.
            </S.Tagline>
          </S.Brand>

          <S.Nav aria-label="Footer">
            <S.FooterLink as={Link} href="/help">
              Help center
            </S.FooterLink>
            <S.FooterLink as={Link} href="/pricing">
              Pricing
            </S.FooterLink>
            <S.FooterLink as={Link} href="/terms" target="_blank" rel="noopener noreferrer">
              Terms
            </S.FooterLink>
            <S.FooterLink as={Link} href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy
            </S.FooterLink>
          </S.Nav>
        </S.Top>

        <S.Divider aria-hidden />

        <S.Bottom>
          <S.Copyright>&copy; {year} Strive</S.Copyright>
          <S.ContactLink
            href="mailto:admin@strive-learning.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            admin@strive-learning.com
          </S.ContactLink>
        </S.Bottom>
      </S.Inner>
    </S.Container>
  );
};
