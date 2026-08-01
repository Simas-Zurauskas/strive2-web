'use client';

import { MotionConfig } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { AuthModal, AuthMode } from './internal/AuthModal/AuthModal';
import { Hero11Route } from './internal/heroVariants/Hero11Route';
import { LandingTopBar } from './internal/LandingTopBar/LandingTopBar';
import { SourcesSection } from './internal/SourcesSection/SourcesSection';
import { C04Wall } from './internal/variants/courseExamples/C04Wall';
import { F08Spread } from './internal/variants/faq/F08Spread';
import { T04Plate } from './internal/variants/finalCta/T04Plate';
import { G01Fingerpost } from './internal/variants/goalTypes/G01Fingerpost';
import { P35Weighted } from './internal/variants/pricing/P35Weighted';
import { P01Vanishing } from './internal/variants/problem/P01Vanishing';
import { R04Strip } from './internal/variants/roadmap/R04Strip';
import * as S from './LandingScreen.styles';

// Code-split the guide chat out of the landing's critical bundle — it pulls
// @ai-sdk/react + the full Chat component, none of which should compete
// with the hero for first paint. ssr:false is safe: the FAB is a floating
// affordance, not content, and it appears as soon as the chunk loads.
const KbChatPanel = dynamic(
  () => import('@/components/KbChatPanel/KbChatPanel').then((m) => m.KbChatPanel),
  { ssr: false },
);

// Landing-specific suggested prompts for the floating Strive guide chat.
// These reflect the questions a *first-time visitor* most commonly asks
// (vs. the help-center default set, which assumes the visitor is already
// orienting inside the product). Order = expected frequency on landing.
const LANDING_CHAT_PROMPTS = [
  'How is Strive different from ChatGPT?',
  'Can I build a course from my own documents?',
  'Can I learn anything with Strive?',
  'How does the spaced-recall queue work?',
  'What does the free tier include?',
];

interface LandingScreenProps {
  redirect: string;
  // When the visitor arrived via `?auth=signin|signup` (e.g. from /pricing's
  // CTA buttons or the PublicTopBar Sign in link), pre-open the auth modal
  // in that mode rather than making them click another button.
  initialAuthMode?: AuthMode | null;
}

type AuthSource =
  | 'hero'
  | 'top_bar'
  | 'course_examples'
  | 'pricing_teaser'
  | 'final_cta'
  | 'deep_link'
  | 'unknown';

/**
 * Zero-height sentinel that fires `landing_section_viewed` once when the
 * visitor scrolls it into view. Placed *before* each tracked section, so the
 * semantic is "reached this section", which is the scroll-depth question we
 * actually ask ("how far down did visitors who never opened the modal get?").
 * A sentinel div instead of observing the section elements themselves keeps
 * this file the only one touched and adds no layout box of its own.
 */
const SectionSentinel = ({ section }: { section: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (firedRef.current) return;
        if (entries.some((e) => e.isIntersecting)) {
          firedRef.current = true;
          analytics.track('landing_section_viewed', { section });
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [section]);

  return <div ref={ref} aria-hidden="true" />;
};

export const LandingScreen = ({ redirect, initialAuthMode }: LandingScreenProps) => {
  const [modalOpen, setModalOpen] = useState(initialAuthMode !== null && initialAuthMode !== undefined);
  const [mode, setMode] = useState<AuthMode>(initialAuthMode ?? 'signup');

  // Track WHICH CTA opened the modal so the funnel split-by-source view
  // doesn't have to guess. `deep_link` covers `?auth=signin|signup`
  // arrivals from /pricing's CTA buttons or the PublicTopBar Sign in link.
  const openModal = useCallback((nextMode: AuthMode, nextSource: AuthSource) => {
    setMode(nextMode);
    setModalOpen(true);
    analytics.track('auth_modal_opened', { mode: nextMode, source: nextSource });
  }, []);

  const openSignUpFromHero = useCallback(() => openModal('signup', 'hero'), [openModal]);
  const openSignUpFromExamples = useCallback(() => openModal('signup', 'course_examples'), [openModal]);
  const openSignUpFromPricing = useCallback(() => openModal('signup', 'pricing_teaser'), [openModal]);
  const openSignUpFromFinal = useCallback(() => openModal('signup', 'final_cta'), [openModal]);
  const openSignInFromTopBar = useCallback(() => openModal('signin', 'top_bar'), [openModal]);

  const onClose = useCallback(() => {
    setModalOpen(false);
    analytics.track('auth_modal_dismissed', { mode });
  }, [mode]);

  // Deep-link arrivals (e.g. `/?auth=signup` from the public top-bar) skip
  // the openModal callback path, so fire `auth_modal_opened` here too.
  // Effect runs exactly once on mount when initialAuthMode was set.
  useEffect(() => {
    if (initialAuthMode) {
      analytics.track('auth_modal_opened', { mode: initialAuthMode, source: 'deep_link' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `landing_viewed` is the Mixpanel-side funnel denominator — before this
  // event the top of the funnel only existed in GA4, and landing→modal rates
  // were cross-tool arithmetic (different blockers, DNT handling, identity).
  // Ref-guarded so React StrictMode's dev double-effect fires it once.
  const landingViewedRef = useRef(false);
  useEffect(() => {
    if (landingViewedRef.current) return;
    landingViewedRef.current = true;
    analytics.track('landing_viewed', {
      ...(initialAuthMode ? { auth_deep_link: initialAuthMode } : {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Every raw CSS animation on this page carries its own
    // `prefers-reduced-motion` guard, but the framer-motion work — the
    // scroll reveals, the marquee-adjacent transforms, the plate lifts —
    // had none, and the app declares no global MotionConfig. `user` makes
    // framer read the OS setting itself: transform and layout animations
    // are dropped, opacity ones are kept, so a visitor who asked for less
    // motion still sees the content arrive rather than a static page with
    // half of it invisible. Scoped to the landing tree on purpose — this is
    // the surface being standardised, not the whole app.
    <MotionConfig reducedMotion="user">
      <S.Page>
        <LandingTopBar onOpenSignIn={openSignInFromTopBar} />
        <Hero11Route onOpenSignUp={openSignUpFromHero} />
        <R04Strip />
        <G01Fingerpost />
        <SectionSentinel section="course_examples" />
        <C04Wall onOpenSignUp={openSignUpFromExamples} />
        {/* The second creation path, and the landing spot for the documents
            announcement email's CTA (`/?source=documents-email`). It precedes
            the problem section deliberately: both creation paths are explained
            before the page argues why any of it matters. */}
        <SectionSentinel section="sources" />
        <SourcesSection />
        <P01Vanishing />
        <SectionSentinel section="pricing_teaser" />
        <P35Weighted onOpenSignUp={openSignUpFromPricing} />
        <SectionSentinel section="faq" />
        <F08Spread />
        <SectionSentinel section="final_cta" />
        <T04Plate onOpenSignUp={openSignUpFromFinal} />

        <AuthModal
          open={modalOpen}
          mode={mode}
          redirect={redirect}
          onClose={onClose}
          onModeChange={setMode}
        />

        <KbChatPanel suggestedPrompts={LANDING_CHAT_PROMPTS} />
      </S.Page>
    </MotionConfig>
  );
};
