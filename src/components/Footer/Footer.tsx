'use client';

import Link from 'next/link';
import { clearConsent } from '@/lib/cookieConsent';
import * as S from './Footer.styles';

/**
 * Each column is a small static list. Help-center topic slugs are
 * mirrored against `client/src/lib/kb/topics.ts` — re-import the source
 * if they change there so the footer never points at a 404.
 */
const LEARN_LINKS: { label: string; href: string }[] = [
  { label: 'Browse topics', href: '/learn' },
  { label: 'Blog', href: '/blog' },
  { label: 'Help center', href: '/help' },
  { label: 'How Strive teaches', href: '/help/how-strive-teaches' },
  { label: 'Plans & billing', href: '/help/plans-and-account' },
];

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Terms of service', href: '/terms' },
  { label: 'Privacy policy', href: '/privacy' },
];

const SUPPORT_EMAIL = 'admin@strive-learning.com';

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

          <S.ColumnGrid>
            <S.Column>
              <S.ColumnTitle>Learn</S.ColumnTitle>
              {LEARN_LINKS.map((link) => (
                <S.FooterLink as={Link} key={link.href} href={link.href}>
                  {link.label}
                </S.FooterLink>
              ))}
            </S.Column>

            <S.Column>
              <S.ColumnTitle>Legal</S.ColumnTitle>
              {LEGAL_LINKS.map((link) => (
                <S.FooterLink
                  as={Link}
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </S.FooterLink>
              ))}
              {/* GDPR Art. 7(3): withdrawal must be as easy as giving consent.
                  Clears the local choice → CookieBanner subscribes to
                  consent changes and re-shows immediately. Mixpanel gates
                  every emit on `hasAnalyticsConsent()`, gtag uses Consent
                  Mode v2 (CookieConsentBootstrap flips storage signals
                  back to 'denied'). Appzi may stay live for the current
                  session if already loaded — acceptable edge case; its
                  cookies persist across reload anyway. */}
              <S.FooterLinkButton type="button" onClick={() => clearConsent()}>
                Cookie preferences
              </S.FooterLinkButton>
            </S.Column>

            <S.Column>
              <S.ColumnTitle>Contact</S.ColumnTitle>
              <S.FooterLink
                href={`mailto:${SUPPORT_EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SUPPORT_EMAIL}
              </S.FooterLink>
            </S.Column>
          </S.ColumnGrid>
        </S.Top>

        <S.Divider aria-hidden />

        <S.Bottom>
          <S.Copyright>&copy; {year} Strive</S.Copyright>
          <S.BottomHint>Made for learners.</S.BottomHint>
        </S.Bottom>
      </S.Inner>
    </S.Container>
  );
};
