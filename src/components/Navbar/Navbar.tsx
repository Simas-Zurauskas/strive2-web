'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks';
import { CreditPill } from '@/components/CreditPill';
import * as S from './Navbar.styles';

const SCROLL_THRESHOLD = 10;

// --navbar-offset drives the sidebar's coordinated top/height transition.
// Writing it in a layout effect keeps it in the same paint as the navbar's
// own transform update; a plain useEffect can land one frame later and
// produce a visible desync between navbar and sidebar motion.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const QuestionIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 8a3.5 3.5 0 0 1 7 0c0 2-3.5 2.5-3.5 5" />
    <path d="M12 18.5h.01" />
  </svg>
);

const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const pathname = usePathname();

  // Reset navbar visibility on route change
  useEffect(() => {
    setHidden(false);
    lastScrollY.current = 0;
  }, [pathname]);

  // rAF-throttle the scroll handler. Without this, fast scrolls (especially
  // momentum/trackpad scrolls hitting the top) can flip --navbar-offset
  // multiple times before the chat panel's 300ms top/height transition has
  // a chance to play out, restarting it mid-flight. That manifests as
  // sub-pixel jitter at the bottom edge of any sticky element that depends
  // on --navbar-offset (most visibly the chat composer).
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 56) {
          setHidden(false);
        } else {
          const delta = y - lastScrollY.current;
          if (delta > SCROLL_THRESHOLD) setHidden(true);
          else if (delta < -SCROLL_THRESHOLD) setHidden(false);
        }
        lastScrollY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.style.setProperty('--navbar-offset', hidden ? '0px' : '56px');
  }, [hidden]);

  return hidden;
};

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const hidden = useHideOnScroll();

  return (
    <S.Nav $hidden={hidden}>
      <S.LeftCluster>
        <Link href="/" passHref legacyBehavior>
          <S.Logo>Strive</S.Logo>
        </Link>
        <S.Divider />
        <S.Links>
          <S.NavLink href="/" $active={pathname === '/'}>
            Home
          </S.NavLink>
          <S.NavLink href="/courses/new" $active={pathname === '/courses/new'}>
            Create
          </S.NavLink>
          <S.NavLink href="/insights" $active={pathname === '/insights'}>
            Insights
          </S.NavLink>
          <S.NavLink href="/quizzes" $active={pathname === '/quizzes'}>
            Quizzes
          </S.NavLink>
          {/* {DEV_MODE && (
            <S.NavLink href="/dev" $active={pathname === '/dev'}>
              _dev
            </S.NavLink>
          )} */}
        </S.Links>
      </S.LeftCluster>

      <S.Right>
        {/* Credit balance pill — hidden until billing summary loads (unauthed
            or loading users see nothing here, consistent with the other
            account-scoped actions below). */}
        {user && <CreditPill />}
        <S.ThemeSwitch role="group" aria-label="Theme">
          <S.ThemeOption
            type="button"
            $active={resolvedTheme === 'light'}
            onClick={() => setTheme('light')}
            title="Light mode"
            aria-pressed={resolvedTheme === 'light'}
          >
            <SunIcon />
          </S.ThemeOption>
          <S.ThemeOption
            type="button"
            $active={resolvedTheme === 'dark'}
            onClick={() => setTheme('dark')}
            title="Dark mode"
            aria-pressed={resolvedTheme === 'dark'}
          >
            <MoonIcon />
          </S.ThemeOption>
        </S.ThemeSwitch>
        <S.ThemeToggle onClick={() => router.push('/faq')} title="FAQ">
          <QuestionIcon />
        </S.ThemeToggle>
        <S.ThemeToggle onClick={() => router.push('/profile')} title={user?.email ?? 'Profile'}>
          <User />
        </S.ThemeToggle>
      </S.Right>
    </S.Nav>
  );
};
