import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NEXTAUTH_SECRET } from '@/conf/env.server';

const PUBLIC_ROUTES = ['/login', '/signup'];
const OPEN_ROUTES = ['/verify-email', '/signup/check-email']; // accessible regardless of auth state

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (OPEN_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Authenticated users on public routes -> redirect to home
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated users on protected routes -> redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
