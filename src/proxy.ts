import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NEXTAUTH_SECRET } from '@/conf/env.server';

// `/` is the combined sign-in / sign-up screen (client-side toggle).
const PUBLIC_ROUTES = ['/'];
// Open = accessible regardless of auth state. Includes the post-signup auth
// flow steps PLUS the public marketing/legal surfaces (`/pricing`, `/terms`,
// `/privacy`) — those are linked from the landing's auth modal fine-print
// and the navbar, and must render without bouncing logged-out visitors.
const OPEN_ROUTES = [
  '/verify-email',
  '/signup/check-email',
  '/forgot-password',
  '/reset-password',
  '/pricing',
  '/terms',
  '/privacy',
];
// Path prefixes that are open (auth-state-agnostic). The help center is
// indexable for SEO and serves as a pre-signup conversion surface, so the
// whole /help/* tree must render without redirecting unauthenticated visitors.
const OPEN_PATH_PREFIXES = ['/help'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (OPEN_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (OPEN_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Authenticated users on the auth landing -> send to home
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Unauthenticated users on protected routes -> back to the auth landing
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
