'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks';
import * as S from './Navbar.styles';

const SCROLL_THRESHOLD = 10;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

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
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const hidden = useHideOnScroll();

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

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

      <S.Right>
        <S.ThemeToggle onClick={toggleTheme} title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </S.ThemeToggle>
        <S.Avatar onClick={() => router.push('/profile')} title={user?.email ?? 'Profile'}>
          {getInitial()}
        </S.Avatar>
      </S.Right>
    </S.Nav>
  );
};
