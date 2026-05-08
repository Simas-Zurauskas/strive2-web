import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Route gating + URL canonicalisation.
//
// Goals:
//   1. `/` is the single canonical URL for the app entrypoint. Authed
//      users see the home dashboard at `/`; unauthed users see the
//      landing. The URL bar always shows `/`.
//   2. `/home` (the route file's actual location, kept so the rewrite
//      target exists) redirects to `/` so any link, history entry, or
//      external referer lands on the canonical URL.
//   3. Protected paths (`/course/*`, `/courses/*`, `/recall`, etc.)
//      bounce unauthed visitors back to `/` rather than rendering an
//      empty/error shell.
//
// Auth source of truth: NextAuth's signed JWT cookie, read via
// `getToken`. No API call — fast, no flash, no flaky-network gating.

const OPEN_PATHS = new Set([
  '/verify-email',
  '/signup/check-email',
  '/forgot-password',
  '/reset-password',
  '/pricing',
  '/terms',
  '/privacy',
]);

const OPEN_PREFIXES = ['/help'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /home → / (canonical URL preference). Preserves search params via
  // url.clone(); status defaults to 307 which is the right thing for a
  // user-initiated GET.
  if (pathname === '/home') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (OPEN_PATHS.has(pathname)) return NextResponse.next();
  if (OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthed = !!token;

  // Authed user on /: serve the home dashboard internally so the URL
  // bar stays /. The rewrite target points at the existing route file
  // under (protected)/home/page.tsx — its `(protected)` layout chrome
  // (Navbar, Footer, gates) runs as usual.
  if (pathname === '/' && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.rewrite(url);
  }

  // Unauthed visitor on a protected path: bounce to /. Drop the search
  // params — they belonged to the protected page (e.g. ?tab=account from
  // /profile) and would otherwise stick to the landing URL after logout.
  if (pathname !== '/' && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes, and any path that looks like a
  // static asset (contains a `.`). Everything else routes through here.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
