import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/util';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import { ROUTES } from '@/constants/routes';

// Server-component gate. Runs before any client JS for the /admin tree
// boots, so a non-admin who guesses the URL never sees the chrome —
// they're redirected at the response boundary.
//
// The check is deliberately a live call to /api/auth/me rather than a
// JWT decode: `isAdmin` lives in MongoDB and isn't carried in the JWT.
// Decoding the token would only tell us "this token belongs to userId X";
// the truth about admin status comes from the database.
//
// Failure modes:
//   - No session       → redirect to /login (unauthenticated).
//   - /me 401          → JWT is invalid or rotated; treat as unauthenticated.
//   - /me 200, !admin  → redirect to home (authenticated but not authorized).
//   - /me throws       → network/DB blip; redirect to home rather than
//                        crash the layout. Defence-in-depth, since the
//                        backdoor route at /api/admin/* applies the same
//                        check on every request anyway.
//
// `cache: 'no-store'` because admin status can be revoked and the cached
// "yes" must not survive across requests.
async function checkAdmin(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { data?: { isAdmin?: boolean } };
    return Boolean(body?.data?.isAdmin);
  } catch {
    return false;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const token = session?.token;
  if (!token) redirect(ROUTES.login());

  const isAdmin = await checkAdmin(token);
  if (!isAdmin) redirect(ROUTES.home());

  return <>{children}</>;
}
