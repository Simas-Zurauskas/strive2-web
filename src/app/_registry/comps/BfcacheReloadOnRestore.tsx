'use client';

import { useEffect } from 'react';

/**
 * Detects browser back/forward-cache (bfcache) restoration and forces a
 * hard reload.
 *
 * Why this exists: when a browser restores a page from bfcache, the
 * IntersectionObservers and animation runtimes that were paused at freeze
 * time don't always resume cleanly. Symptom on this app: navigating
 * Landing → /pricing → browser Back leaves Landing sections stuck at
 * their `initial` opacity-0 state — JS heap is fine, no errors fire, but
 * the framer-motion runtime never re-applies the `animate` styles to the
 * frozen DOM nodes.
 *
 * Fix shape: when `pageshow` arrives with `event.persisted === true` we
 * are being restored from bfcache; force a reload so the document mounts
 * fresh and animations start from a clean slate. Most assets are
 * HTTP-cached so the perceived UX is "back nav works" rather than a
 * spinner.
 *
 * Trade-off: forfeits the bfcache performance benefit on this app —
 * correctness wins.
 *
 * Sibling fix in [LandingTopBar.tsx]: the topbar's wordmark + pricing
 * link were `styled.a` (raw anchors) and triggered hard navigations,
 * which is what makes browsers bfcache the page in the first place. Both
 * have been switched to Next.js `<Link>` (`as={Link}`) so the soft-nav
 * path is the default. The bfcache reload below remains as a safety net
 * for any other hard-nav path the app may grow into.
 */
export const BfcacheReloadOnRestore = () => {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return null;
};
