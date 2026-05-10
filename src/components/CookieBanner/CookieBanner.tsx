'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConsent, setConsent, subscribeConsent } from '@/lib/cookieConsent';
import * as S from './CookieBanner.styles';

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage gate must run post-hydration
    if (getConsent() === null) setShow(true);
    // Cross-tab sync: if another tab clears consent (Footer "Cookie
    // preferences"), this tab's banner re-shows. If another tab sets
    // consent, hide here too.
    return subscribeConsent((value) => setShow(value === null));
  }, []);

  if (!show) return null;

  const choose = (value: 'all' | 'essential') => {
    setConsent(value);
    setShow(false);
  };

  return (
    <S.Container role="region" aria-label="Cookie consent">
      <S.Card>
        <S.Copy>
          We use cookies for analytics and ads to improve Strive. Strictly necessary
          cookies are always on. See our <Link href="/privacy">Privacy Policy</Link>.
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
