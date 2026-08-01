'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './LegalUpdateNotice.styles';

/**
 * In-product notice that the Terms of Service and Privacy Policy have
 * changed.
 *
 * WHY IT EXISTS. Both documents promise that material changes are
 * "notified by email or in-product before they take effect" (Terms § 15,
 * Privacy Policy § 11). The separate change-notice email campaign was
 * dropped, so this surface is how that promise is discharged — and it
 * reaches *everyone* signed in, including people who have opted out of
 * product-update email, which an email-only notice would not.
 *
 * Mounted in the signed-in shell (`app/(protected)/layout.tsx`) so every
 * authenticated route shows it once.
 *
 * The version string is part of the dismiss key on purpose: bumping
 * NOTICE_VERSION for the next legal change re-shows the bar to everyone
 * who dismissed this one, instead of silently staying hidden forever.
 */
const NOTICE_VERSION = '2026-07-30';
const DISMISS_KEY = `strive.legalUpdateNotice.${NOTICE_VERSION}`;

/** Displayed effective date, and the date the new documents apply from. */
const EFFECTIVE_DATE_LABEL = '1 August 2026';

/**
 * Self-retiring: a notice about a change that landed a month ago is
 * clutter, not notice. After this date the bar stops rendering whether or
 * not it was dismissed.
 */
const NOTICE_EXPIRES_AT = Date.parse('2026-09-01T00:00:00Z');

export const LegalUpdateNotice = () => {
  // Two-step mount, same as CookieBanner: nothing renders during SSR, then
  // on hydration we read localStorage. Starting `show = true` on the server
  // would flash the bar for users who already dismissed it.
  const [show, setShow] = useState(false);
  const { fadeIn } = useMotion();

  useEffect(() => {
    if (Date.now() >= NOTICE_EXPIRES_AT) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      // Private-mode / blocked storage: show the notice. Over-notifying is
      // the safe direction for a legal notice.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage gate must run post-hydration
    if (!dismissed) setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // State alone hides it for this mount; it returns on the next load.
    }
  };

  return (
    <S.Bar role="status" initial={fadeIn.initial} animate={fadeIn.animate} transition={fadeIn.transition}>
      <S.Inner>
        <S.Copy>
          <S.Eyebrow>Notice</S.Eyebrow>
          <S.Text>
            We have updated our <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>. They cover building courses from your own
            documents and links, how to report infringing content, and clearer refund and liability
            terms. The updated documents take effect on <strong>{EFFECTIVE_DATE_LABEL}</strong>.
          </S.Text>
        </S.Copy>
        <S.Dismiss type="button" onClick={dismiss} aria-label="Dismiss notice">
          <X aria-hidden />
        </S.Dismiss>
      </S.Inner>
    </S.Bar>
  );
};
