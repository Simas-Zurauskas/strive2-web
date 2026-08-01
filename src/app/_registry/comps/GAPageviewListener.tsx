'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { gtagPageview } from '@/lib/gtag';
import { fbqPageview } from '@/lib/metaPixel';

/**
 * Fires a pageview on every App Router navigation, for both vendors.
 *
 * The implicit pageview from `gtag('config', ...)` is disabled
 * (send_page_view: false in layout.tsx) and the Meta base snippet's
 * `fbq('track','PageView')` is deliberately omitted, so this listener owns
 * initial + every subsequent SPA navigation for both. Without it each vendor
 * sees only the first server-rendered URL and undercounts navigation by an
 * order of magnitude.
 */
export const GAPageviewListener = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    gtagPageview(pathname);
    fbqPageview();
  }, [pathname]);

  return null;
};
