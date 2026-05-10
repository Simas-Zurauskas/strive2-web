'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as S from './LandingTopBar.styles';

interface LandingTopBarProps {
  onOpenSignIn: () => void;
}

export const LandingTopBar = ({ onOpenSignIn }: LandingTopBarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <S.Bar $scrolled={scrolled}>
      <S.Inner>
        <S.Wordmark as={Link} href="/" aria-label="Strive home">
          Strive
        </S.Wordmark>
        <S.NavLinks>
          <S.PricingLink as={Link} href="/blog" data-analytics-id="landing.topbar.blog">
            Blog
          </S.PricingLink>
          <S.PricingLink as={Link} href="/pricing" data-analytics-id="landing.topbar.pricing">
            Pricing
          </S.PricingLink>
          <S.SignInLink
            type="button"
            onClick={onOpenSignIn}
            aria-haspopup="dialog"
            data-analytics-id="landing.topbar.signin"
          >
            Sign in
          </S.SignInLink>
        </S.NavLinks>
      </S.Inner>
    </S.Bar>
  );
};
