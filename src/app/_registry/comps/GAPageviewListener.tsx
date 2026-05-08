'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { gtagPageview } from '@/lib/gtag';

/**
 * Fires a gtag page_view on every App Router navigation. The implicit
 * pageview from `gtag('config', ...)` is disabled (send_page_view: false
 * in layout.tsx) so this listener owns initial + every subsequent SPA
 * navigation. Without it, GA4 sees only the first server-rendered URL
 * and undercounts navigation by an order of magnitude.
 */
export const GAPageviewListener = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    gtagPageview(pathname);
  }, [pathname]);

  return null;
};
