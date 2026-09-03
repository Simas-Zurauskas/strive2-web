'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useVisualViewport } from '@/hooks/useVisualViewport';
import { getConsent, setConsent, subscribeConsent } from '@/lib/cookieConsent';
import * as S from './CookieBanner.styles';

/**
 * Height of the visible banner, published on <html> so the rest of the app
 * can reserve space for it. Nothing else in the product reserves space for a
 * fixed overlay, which is why this one element was the single largest defect
 * source in the 005 sweep: measured at 119px tall with z-index 100, it
 * covered the landing hero CTA (320x568), the "Ask the guide" FAB on every
 * marketing route, the course "Create your first lesson" CTA, 82% of the
 * wizard's goal textarea, and the footer at max scroll — and on
 * /reset-password it covered the "Confirm new password" field, where a
 * mis-tap hit the banner's Privacy Policy link and DISCARDED the password
 * already typed.
 *
 * A custom property rather than a fixed constant because the card's height
 * is content- and width-dependent: it stacks to a column under media.mobile
 * and its buttons grow to 44px on coarse pointers.
 */
const HEIGHT_VAR = '--cookie-banner-height';

/**
 * Bottom-floating cookie consent banner. Renders only when no consent
 * choice exists in localStorage. Two equally-prominent actions, no
 * granular toggles — non-essential storage either flips on (Accept) or
 * stays off (Reject).
 */
export const CookieBanner = () => {
  // Two-step mount: nothing renders during SSR, then on hydration we
  // check localStorage. Reading consent in `useEffect` is the intent —
  // localStorage isn't available during SSR, and starting `show=true`
  // on the server would flash the banner for users who already chose.
  const [show, setShow] = useState(false);
  /**
   * Stand down while the software keyboard is up.
   *
   * This is the S1-4 fix, and it is a data-loss one rather than a cosmetic
   * one. At 375x367 (keyboard-open geometry) the banner's band 232-351
   * completely contained the "Confirm new password" field at 256-306: all
   * five hit-test points returned the banner, and the field's natural centre
   * resolved to the banner's <a href="/privacy"> — so tapping the second
   * password field NAVIGATED AWAY and discarded the password already typed.
   * Reserving document space (see --cookie-banner-height) cannot help here,
   * because the form is centred in the viewport rather than at the end of the
   * document.
   *
   * Consent semantics are untouched: nothing is decided, recorded or assumed
   * while it is hidden, and it returns the moment the keyboard closes.
   */
  const { keyboardOpen } = useVisualViewport();

  useEffect(() => {
    // Support/QA escape hatch. Two sessions were spent proving "the banner
    // is missing on iOS" when the real answer was "this device already
    // consented a month ago" — there was no way to ask the page which it
    // was. `?cookie-preferences` forces the banner open on any device, on
    // any environment, without a devtools connection. A forced banner still
    // writes through setConsent exactly as a natural one does.
    const forced = new URLSearchParams(window.location.search).has('cookie-preferences');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage gate must run post-hydration
    if (forced || getConsent() === null) setShow(true);
    // Cross-tab sync: if another tab clears consent (Footer "Cookie
    // preferences"), this tab's banner re-shows. If another tab sets
    // consent, hide here too.
    return subscribeConsent((value) => setShow(value === null));
  }, []);

  /**
   * Publish the card's real height while the banner is up, and clear it the
   * moment it goes away. A ref callback rather than an effect so the value
   * lands in the same commit the banner mounts in — an effect would leave one
   * frame where the banner is painted over content that has not yet reserved
   * room for it.
   */
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    const root = document.documentElement;
    if (!node) {
      root.style.removeProperty(HEIGHT_VAR);
      return;
    }
    const publish = () => {
      // The gap below the card is part of the occluded band: the container
      // sits at `bottom: max(1rem, var(--safe-area-bottom))`, so content
      // must clear the card *and* that offset.
      root.style.setProperty(HEIGHT_VAR, `${Math.ceil(node.getBoundingClientRect().height)}px`);
    };
    publish();
    // Rotation, a font swap, or the buttons growing on a coarse pointer all
    // change the height after first paint.
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(publish);
    ro.observe(node);
    return () => {
      ro.disconnect();
      root.style.removeProperty(HEIGHT_VAR);
    };
  }, []);

  // Belt and braces: a ref cleanup runs on unmount, but an early `return null`
  // below means the ref callback is the only thing that can clear the var, and
  // React only guarantees that on the render where the node disappears.
  useEffect(() => {
    if (show && !keyboardOpen) return;
    document.documentElement.style.removeProperty(HEIGHT_VAR);
  }, [show, keyboardOpen]);

  if (!show || keyboardOpen) return null;

  const choose = (value: 'all' | 'essential') => {
    setConsent(value);
    setShow(false);
  };

  return (
    <S.Container role="region" aria-label="Cookie consent" ref={measureRef}>
      <S.Card>
        <S.Copy>
          We use cookies for analytics and ads to improve Strive.{' '}
          <S.MobileHidden>Strictly necessary cookies are always on.</S.MobileHidden> See our{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </S.Copy>
        <S.Actions>
          <S.Reject type="button" onClick={() => choose('essential')}>
            Reject
          </S.Reject>
          <S.Accept type="button" onClick={() => choose('all')}>
            Accept
          </S.Accept>
        </S.Actions>
      </S.Card>
    </S.Container>
  );
};
