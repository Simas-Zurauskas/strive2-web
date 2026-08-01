import { Metadata } from 'next';

// Public, session-less landing for the unsubscribe link in a promotional
// email. `/unsubscribed` is in `middleware.ts` OPEN_PATHS — without that,
// the logged-out recipient is redirected to `/` with the query string
// stripped and never sees their opt-out confirmed.
export const metadata: Metadata = {
  title: 'Unsubscribed — Strive',
  description: 'You have been unsubscribed from Strive product updates.',
  // Not a page anyone should reach from search, and it exists only as the
  // tail of an email link.
  robots: { index: false, follow: false },
};

export { default } from '@/screens/UnsubscribedScreen';
