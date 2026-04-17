'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEV_MODE } from '@/conf/env';
import { useAuth, useReviewsDue } from '@/hooks';
import * as S from './Navbar.styles';

const SCROLL_THRESHOLD = 10;

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

const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const pathname = usePathname();

  // Reset navbar visibility on route change
  useEffect(() => {
    setHidden(false);
    lastScrollY.current = 0;
  }, [pathname]);

  const onScroll = useCallback(() => {
    const y = window.scrollY;

    // Always show when near the top
    if (y < 56) {
      setHidden(false);
      lastScrollY.current = y;
      return;
    }

    const delta = y - lastScrollY.current;

    if (delta > SCROLL_THRESHOLD) {
      setHidden(true);
      lastScrollY.current = y;
    } else if (delta < -SCROLL_THRESHOLD) {
      setHidden(false);
      lastScrollY.current = y;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
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
  const { data: reviewsDue } = useReviewsDue();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <S.Nav $hidden={hidden}>
      <S.Left>
        <Link href="/" passHref legacyBehavior>
          <S.Logo>Strive</S.Logo>
        </Link>
      </S.Left>

      <S.Center>
        <S.NavLink href="/" $active={pathname === '/'}>
          Home
        </S.NavLink>
        <S.NavLink href="/courses/new" $active={pathname === '/courses/new'}>
          Create
        </S.NavLink>
        <S.NavLink href="/quizzes" $active={pathname === '/quizzes'}>
          Quizzes
          {reviewsDue && reviewsDue.length > 0 && <S.Badge>{reviewsDue.length}</S.Badge>}
        </S.NavLink>
        {/* {DEV_MODE && (
          <S.NavLink href="/dev" $active={pathname === '/dev'}>
            _dev
          </S.NavLink>
        )} */}
      </S.Center>

      <S.Right>
        <S.ThemeToggle
          onClick={toggleTheme}
          title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </S.ThemeToggle>
        <S.ThemeToggle onClick={() => router.push('/profile')} title={user?.email ?? 'Profile'}>
          <User />
        </S.ThemeToggle>
      </S.Right>
    </S.Nav>
  );
};
