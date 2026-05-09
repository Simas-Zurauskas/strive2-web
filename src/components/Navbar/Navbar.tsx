'use client';

import { useAnimation } from 'framer-motion';
import { PANEL_CLOSE_TRANSITION, PANEL_OPEN_TRANSITION } from '@/theme/motionPresets';
import {
  HelpCircle,
  Home,
  LayoutGrid,
  MessageSquare,
  Plus,
  RefreshCcw,
  SquareCheck,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CreditPill } from '@/components/CreditPill';
import { NEXT_PUBLIC_APPZI_BUTTON_ID } from '@/conf/env';
import { useAuth } from '@/hooks';
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

const useHideOnScroll = (navRef: React.RefObject<HTMLElement | null>) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const pathname = usePathname();

  // Reset navbar visibility on route change. The setState-in-effect
  // is intentional — `hidden` is local navbar state, not derivable
  // from pathname alone (it also changes on scroll), and resetting it
  // when pathname changes is the desired behavior.
  useEffect(() => {
    setHidden(false); // eslint-disable-line react-hooks/set-state-in-effect -- reset on route change is the intent
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
        setScrolled(y > 24);
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
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --navbar-offset = current visible bottom edge of the Nav element.
  // The Nav is now a flex-column: a 56px nav row plus an optional
  // route-extension slot (e.g. CourseShell's ~49px lesson bar). On
  // hide-on-scroll only the nav row tucks away (translate Y -56px), so
  // the visible portion is `fullHeight - 56` when hidden, `fullHeight`
  // when visible. ResizeObserver covers the case where the extension's
  // content changes mid-session.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const h = navRef.current?.offsetHeight ?? 56;
      const visible = hidden ? Math.max(0, h - 56) : h;
      root.style.setProperty('--navbar-offset', `${visible}px`);
    };
    apply();
    const node = navRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(apply);
    ro.observe(node);
    return () => ro.disconnect();
  }, [hidden, navRef]);

  return { hidden, scrolled };
};

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navRef = useRef<HTMLElement>(null);
  const { hidden, scrolled } = useHideOnScroll(navRef);

  // App drawer (tablet/below). Closed on every route change so a deep
  // link from the drawer doesn't leave the panel hanging open over the
  // newly-loaded screen.
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => setDrawerOpen(false), [pathname]); // eslint-disable-line react-hooks/set-state-in-effect -- close on route change is the intent

  // Driver-style animation control: drag-to-close needs an explicit
  // snap-back (otherwise framer can leave the drawer wherever the
  // pointer released). We drive open/closed transitions through a
  // single `useAnimation` controller — the same controller commits the
  // close on drag-end-past-threshold or replays the open animation
  // when the gesture is too small to dismiss.
  const drawerControls = useAnimation();
  useEffect(() => {
    drawerControls.start(
      drawerOpen ? 'open' : 'closed',
      drawerOpen ? PANEL_OPEN_TRANSITION : PANEL_CLOSE_TRANSITION,
    );
  }, [drawerOpen, drawerControls]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const navItems: Array<{ href: string; label: string; icon: React.ReactNode }> = [
    { href: '/', label: 'Home', icon: <Home /> },
    { href: '/courses/new', label: 'Create', icon: <Plus /> },
    { href: '/recall', label: 'Recall', icon: <RefreshCcw /> },
    { href: '/quizzes', label: 'Quizzes', icon: <SquareCheck /> },
  ];

  return (
    <>
    <S.Nav ref={navRef} $hidden={hidden} $scrolled={scrolled}>
      <S.NavRow>
      <S.LeftCluster>
        <S.HamburgerButton
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="app-nav-drawer"
        >
          <LayoutGrid />
        </S.HamburgerButton>
        <S.Logo as={Link} href="/">Strive</S.Logo>
        <S.Divider />
        <S.Links>
          <S.NavLink href="/" $active={pathname === '/'}>
            Home
          </S.NavLink>
          <S.NavLink href="/courses/new" $active={pathname === '/courses/new'}>
            Create
          </S.NavLink>
          <S.NavLink href="/recall" $active={pathname === '/recall'}>
            Recall
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
        <S.DesktopOnlyCluster>
        <S.ThemeSwitch role="group" aria-label="Theme">
          <S.ThemeOption
            type="button"
            $active={resolvedTheme === 'light'}
            onClick={() => setTheme('light')}
            title="Light mode"
            aria-label="Light mode"
            aria-pressed={resolvedTheme === 'light'}
          >
            <SunIcon />
          </S.ThemeOption>
          <S.ThemeOption
            type="button"
            $active={resolvedTheme === 'dark'}
            onClick={() => setTheme('dark')}
            title="Dark mode"
            aria-label="Dark mode"
            aria-pressed={resolvedTheme === 'dark'}
          >
            <MoonIcon />
          </S.ThemeOption>
        </S.ThemeSwitch>
        {NEXT_PUBLIC_APPZI_BUTTON_ID && (
          <S.FeedbackButton
            type="button"
            onClick={() => window.appzi?.openWidget?.(NEXT_PUBLIC_APPZI_BUTTON_ID)}
            title="Share feedback"
            aria-label="Share feedback"
          >
            <MessageSquare />
            <span>Feedback</span>
          </S.FeedbackButton>
        )}
        <S.ThemeToggle
          type="button"
          onClick={() => router.push('/help')}
          title="Help"
          aria-label="Help"
        >
          <QuestionIcon />
        </S.ThemeToggle>
        </S.DesktopOnlyCluster>
        <S.ThemeToggle
          type="button"
          onClick={() => router.push('/profile')}
          title={user?.email ?? 'Profile'}
          aria-label={user?.email ? `Account: ${user.email}` : 'Profile'}
        >
          <User />
        </S.ThemeToggle>
      </S.Right>
      </S.NavRow>
      {/* Per-route extension slot. CourseShell portals its lesson bar
          here so the lesson bar shares the navbar's transform + blur
          (no possible drift from the nav row above). */}
      <S.NavExtensionSlot id="navbar-extension-slot" />
    </S.Nav>

      {/* App nav drawer (tablet/below). Rendered as a sibling of <S.Nav>
          rather than inside it because <S.Nav> applies backdrop-filter,
          which establishes a containing block for any fixed-positioned
          descendants — that would clip the drawer to the navbar's
          bounds instead of letting it span the viewport. Sibling
          placement positions the drawer against the viewport. Renders
          unconditionally so the CSS exit animation has somewhere to
          play out. */}
      <S.DrawerBackdrop
        $open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <S.Drawer
        id="app-nav-drawer"
        aria-hidden={!drawerOpen}
        aria-label="App menu"
        initial="closed"
        animate={drawerControls}
        variants={{
          open: { x: '0%' },
          closed: { x: '-100%' },
        }}
        /* Default transition for variant changes is overridden per-call
           by `drawerControls.start(...)` in the useEffect above so open
           and close use the app-wide PANEL_OPEN/CLOSE_TRANSITION
           durations. This prop covers any other animate flips. */
        transition={PANEL_CLOSE_TRANSITION}
        /* Drag-to-close. Drag is constrained between the open position
           (x:0) and ~one drawer width left of it. Releasing past 100px
           leftward OR with a fast leftward velocity commits the close;
           otherwise we explicitly replay the open animation so the
           drawer always lands at one of two positions — never mid-drag.
           dragElastic:0 + dragMomentum:false → weighted feel, no
           bounce, no inertia overshoot. */
        drag="x"
        dragConstraints={{ left: -360, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={(_e, info) => {
          if (info.offset.x < -100 || info.velocity.x < -400) {
            setDrawerOpen(false);
          } else {
            drawerControls.start('open', PANEL_CLOSE_TRANSITION);
          }
        }}
      >
        <S.DrawerHeader>
          <S.Logo as={Link} href="/" onClick={() => setDrawerOpen(false)}>
            Strive
          </S.Logo>
          <S.DrawerCloseButton
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </S.DrawerCloseButton>
        </S.DrawerHeader>

        <S.DrawerSection aria-label="Navigation">
          {navItems.map((item) => (
            <S.DrawerLink
              key={item.href}
              href={item.href}
              $active={pathname === item.href}
              onClick={() => setDrawerOpen(false)}
            >
              {item.icon}
              {item.label}
            </S.DrawerLink>
          ))}
        </S.DrawerSection>

        <S.DrawerSection aria-label="Tools">
          <S.DrawerSectionLabel>Appearance</S.DrawerSectionLabel>
          <S.DrawerThemeRow>
            <S.DrawerThemeLabel>Theme</S.DrawerThemeLabel>
            <S.ThemeSwitch role="group" aria-label="Theme">
              <S.ThemeOption
                type="button"
                $active={resolvedTheme === 'light'}
                onClick={() => setTheme('light')}
                aria-label="Light mode"
                aria-pressed={resolvedTheme === 'light'}
              >
                <SunIcon />
              </S.ThemeOption>
              <S.ThemeOption
                type="button"
                $active={resolvedTheme === 'dark'}
                onClick={() => setTheme('dark')}
                aria-label="Dark mode"
                aria-pressed={resolvedTheme === 'dark'}
              >
                <MoonIcon />
              </S.ThemeOption>
            </S.ThemeSwitch>
          </S.DrawerThemeRow>

          <S.DrawerSectionLabel>Support</S.DrawerSectionLabel>
          <S.DrawerLink
            href="/help"
            $active={pathname === '/help'}
            onClick={() => setDrawerOpen(false)}
          >
            <HelpCircle />
            Help center
          </S.DrawerLink>
          {NEXT_PUBLIC_APPZI_BUTTON_ID && (
            <S.DrawerAction
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                window.appzi?.openWidget?.(NEXT_PUBLIC_APPZI_BUTTON_ID);
              }}
            >
              <MessageSquare />
              Send feedback
            </S.DrawerAction>
          )}
        </S.DrawerSection>
      </S.Drawer>
    </>
  );
};
