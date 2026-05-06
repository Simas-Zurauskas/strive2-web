'use client';

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
        <S.Wordmark href="/" aria-label="Strive home">
          Strive
        </S.Wordmark>
        <S.NavLinks>
          <S.PricingLink href="/pricing" data-analytics-id="landing.topbar.pricing">
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
