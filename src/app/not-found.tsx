import { Footer, PublicTopBar } from '@/components';
import { NotFoundScreen } from '@/screens/NotFoundScreen';
import type { Metadata } from 'next';

/**
 * Global 404 — and it is load-bearing, not decoration.
 *
 * Without this file an unknown URL rendered Next's built-in 404 body inside
 * the ROOT layout only. The route-group layouts ((public), (protected),
 * (auth)) are what mount PublicTopBar, <main id="main-content"> and the
 * Footer, and a 404 never enters one — so the page shipped zero navigational
 * links (interactiveCount 1, the skip link), and the root layout's
 * "Skip to main content" anchor pointed at an element that does not exist.
 *
 * `export const dynamicParams = false` on /help/[topic], /help/[topic]/[slug],
 * /learn/[topic], /blog/[slug] and /blog/category/[category] means an unlisted
 * param is rejected at the ROUTING layer: the segment never renders, so
 * `notFound()` never runs and app/(public)/help/not-found.tsx is unreachable.
 * This file is therefore the only 404 those five routes can produce, which is
 * why it has to carry its own chrome.
 */
export const metadata: Metadata = {
  title: 'Page not found · Strive',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PublicTopBar />
      <main
        id="main-content"
        style={{ minHeight: 'calc(100dvh - 56px)', display: 'flex', flexDirection: 'column' }}
      >
        <NotFoundScreen />
      </main>
      <Footer />
    </>
  );
}
