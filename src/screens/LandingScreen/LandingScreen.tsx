'use client';

import { useCallback, useEffect, useState } from 'react';
import { KbChatPanel } from '@/components';
import { analytics } from '@/lib/analytics';
import { AuthModal, AuthMode } from './internal/AuthModal/AuthModal';
import { ComparisonTable } from './internal/ComparisonTable/ComparisonTable';
import { CourseExamplesSection } from './internal/CourseExamplesSection/CourseExamplesSection';
import { FaqSection } from './internal/FaqSection/FaqSection';
import { FeatureBento } from './internal/FeatureBento/FeatureBento';
import { FinalCtaSection } from './internal/FinalCtaSection/FinalCtaSection';
import { GoalTypesSection } from './internal/GoalTypesSection/GoalTypesSection';
import { HeroSection } from './internal/HeroSection/HeroSection';
import { HowItWorksSection } from './internal/HowItWorksSection/HowItWorksSection';
import { LandingTopBar } from './internal/LandingTopBar/LandingTopBar';
import { PricingTeaser } from './internal/PricingTeaser/PricingTeaser';
import { ProblemSection } from './internal/ProblemSection/ProblemSection';
import { RoadmapSection } from './internal/RoadmapSection/RoadmapSection';
import * as S from './LandingScreen.styles';

// Landing-specific suggested prompts for the floating Strive guide chat.
// These reflect the questions a *first-time visitor* most commonly asks
// (vs. the help-center default set, which assumes the visitor is already
// orienting inside the product). Order = expected frequency on landing.
const LANDING_CHAT_PROMPTS = [
  'How is Strive different from ChatGPT?',
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

  return (
    <S.Page>
      <LandingTopBar onOpenSignIn={openSignInFromTopBar} />
      <HeroSection onOpenSignUp={openSignUpFromHero} />
      <RoadmapSection />
      <GoalTypesSection />
      <CourseExamplesSection onOpenSignUp={openSignUpFromExamples} />
      <ProblemSection />
      <HowItWorksSection />
      <FeatureBento />
      <ComparisonTable />
      <PricingTeaser onOpenSignUp={openSignUpFromPricing} />
      <FaqSection />
      <FinalCtaSection onOpenSignUp={openSignUpFromFinal} />

      <AuthModal
        open={modalOpen}
        mode={mode}
        redirect={redirect}
        onClose={onClose}
        onModeChange={setMode}
      />

      <KbChatPanel suggestedPrompts={LANDING_CHAT_PROMPTS} />
    </S.Page>
  );
};
