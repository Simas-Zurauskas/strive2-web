'use client';

import { useEffect, useState } from 'react';
import * as S from './PublicTopBar.styles';

// Minimal top bar for the (public) route group when the visitor is not
// authenticated. Used on /terms, /privacy, /pricing, /help — pages that
// otherwise had no nav at all for logged-out users, leaving them stranded
// without a way back to the landing.
//
// Mirrors the visual language of LandingTopBar (italic-serif wordmark,
// scroll-activated bottom border) but uses plain links for Sign in /
// Pricing rather than the landing's modal-opening button — visitors here
// will navigate to / and hit the auth modal naturally.
export const PublicTopBar = () => {
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
          <S.NavLink href="/pricing" data-analytics-id="public-nav.pricing">
            Pricing
          </S.NavLink>
          <S.SignInLink href="/?auth=signin" data-analytics-id="public-nav.signin">
            Sign in
          </S.SignInLink>
        </S.NavLinks>
      </S.Inner>
    </S.Bar>
  );
};
