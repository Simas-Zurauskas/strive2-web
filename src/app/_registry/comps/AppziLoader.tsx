'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getConsent, subscribeConsent, type ConsentValue } from '@/lib/cookieConsent';

/**
 * Gates the Appzi feedback widget script on cookie consent.
 *
 * Appzi sets cookies the moment its script executes. In the opt-out model
 * the `<Script>` loads by default — for both `'all'` and the unset
 * (`null`) state — and is only withheld when the user explicitly chooses
 * `'essential'`, in which case the Navbar Feedback button is a no-op.
 *
 * Caveat: once Appzi has loaded in a session, revoking consent later
 * unmounts this component (so we stop offering the script on subsequent
 * navigations) but does NOT clear cookies the script already set or
 * unload its global. True consent-revoke requires a page reload + cookie
 * clear; documented in the privacy policy.
 *
 * Mounted inside `(protected)/layout.tsx` so it only loads in the
 * signed-in tree, mirroring the prior unconditional placement.
 */
export const AppziLoader = () => {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getConsent());
    return subscribeConsent(setConsent);
  }, []);

  if (consent === 'essential') return null;

  return <Script id="appzi" src="https://w.appzi.io/w.js?token=vYiQf" strategy="lazyOnload" />;
};
