'use client';

import { useCallback, useState } from 'react';
import { KbChatPanel } from '@/components';
import { AuthModal, AuthMode } from './internal/AuthModal/AuthModal';
import { ComparisonTable } from './internal/ComparisonTable/ComparisonTable';
import { FaqSection } from './internal/FaqSection/FaqSection';
import { FeatureBento } from './internal/FeatureBento/FeatureBento';
import { FinalCtaSection } from './internal/FinalCtaSection/FinalCtaSection';
import { GoalTypesSection } from './internal/GoalTypesSection/GoalTypesSection';
import { HeroSection } from './internal/HeroSection/HeroSection';
import { HowItWorksSection } from './internal/HowItWorksSection/HowItWorksSection';
import { LandingTopBar } from './internal/LandingTopBar/LandingTopBar';
import { PricingTeaser } from './internal/PricingTeaser/PricingTeaser';
import { ProblemSection } from './internal/ProblemSection/ProblemSection';
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

export const LandingScreen = ({ redirect, initialAuthMode }: LandingScreenProps) => {
  const [modalOpen, setModalOpen] = useState(initialAuthMode !== null && initialAuthMode !== undefined);
  const [mode, setMode] = useState<AuthMode>(initialAuthMode ?? 'signup');

  const openSignUp = useCallback(() => {
    setMode('signup');
    setModalOpen(true);
  }, []);

  const openSignIn = useCallback(() => {
    setMode('signin');
    setModalOpen(true);
  }, []);

  const onClose = useCallback(() => setModalOpen(false), []);

  return (
    <S.Page>
      <LandingTopBar onOpenSignIn={openSignIn} />
      <HeroSection onOpenSignUp={openSignUp} />
      <GoalTypesSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeatureBento />
      <ComparisonTable />
      <PricingTeaser onOpenSignUp={openSignUp} />
      <FaqSection />
      <FinalCtaSection onOpenSignUp={openSignUp} />

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
