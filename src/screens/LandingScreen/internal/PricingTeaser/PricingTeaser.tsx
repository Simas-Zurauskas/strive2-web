'use client';

import Link from 'next/link';
import { Button } from '@/components';
import { useBillingPlans } from '@/hooks/useBilling';
import { formatAllowance } from '@/lib/allowance';
import { analytics } from '@/lib/analytics';
import { formatPlanLessonsPerMonth, BASE_LESSON_FOOTNOTE } from '@/lib/pricingFormat';
import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './PricingTeaser.styles';
import { PRICING_TEASER } from '../../constants';
import type { BillingPlan } from '@/api/types';

// The three tiers we anchor on. Free is the lowest-friction entry; Starter
// gives the price ladder a $12.99 first rung (without it, the first paid
// number a visitor ever saw was $24.99); Pro stays the marketing-designated
// "most popular" tier. Studio lives one click away on /pricing.
const ANCHOR_KEYS = ['free', 'starter', 'pro'] as const;
const POPULAR_KEY = 'pro';

const formatPrice = (usd: number): string => {
  if (usd === 0) return 'Free';
  const isWhole = Number.isInteger(usd);
  return `$${isWhole ? usd : usd.toFixed(2)}/mo`;
};

interface PricingTeaserProps {
  onOpenSignUp: () => void;
}

export const PricingTeaser = ({ onOpenSignUp }: PricingTeaserProps) => {
  const { fadeUp } = useMotion();
  const { data, isLoading } = useBillingPlans();
  const plans = data?.plans ?? [];

  // Pick the two anchor cards in deterministic order. If either is missing
  // from the API response we fall back to the loading skeleton — better
  // than rendering a single lonely card.
  const anchors: (BillingPlan | undefined)[] = ANCHOR_KEYS.map((k) =>
    plans.find((p) => p.key === k),
  );
  const ready = !isLoading && anchors.every(Boolean);
  // 1 allowance := Free's monthly grant. Pulled from the catalog so backend
  // changes to ALLOWANCE_UNIT silently rescale generation headroom without
  // shifting the displayed multipliers. `anchors[0]` is the Free plan by
  // ANCHOR_KEYS ordering — guaranteed non-null inside the `ready` branch.
  const allowanceUnit = anchors[0]?.monthlyAllowance ?? 0;

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={VIEWPORT_ONCE}
        transition={{ ...fadeUp.transition, duration: 0.4 }}
      >
        <S.Heading>{PRICING_TEASER.heading}</S.Heading>

        {!ready ? (
          // Loading state: 2 skeleton cards in the same TierGrid + TierCard
          // wrappers as the real cards, so swapping skeleton → real causes
          // zero width or height shift.
          <S.TierGrid aria-hidden="true">
            {Array.from({ length: 3 }, (_, i) => (
              <S.TierCard key={i}>
                <S.SkBlock $w="50%" $h="0.9rem" />
                <S.SkBlock $w="65%" $h="1.65rem" />
                <S.SkBlock $w="80%" $h="1.05rem" />
                <S.SkBlock $w="90%" $h="1.05rem" />
                <S.SkBlock $h="2.5rem" $radius="6px" />
              </S.TierCard>
            ))}
          </S.TierGrid>
        ) : (
          <S.TierGrid>
            {anchors.map((plan) => {
              if (!plan) return null;
              const popular = plan.key === POPULAR_KEY;
              const copy =
                plan.key === 'pro'
                  ? PRICING_TEASER.cards.pro
                  : plan.key === 'starter'
                  ? PRICING_TEASER.cards.starter
                  : PRICING_TEASER.cards.free;

              return (
                <S.TierCard key={plan.key} $popular={popular}>
                  {popular && <S.PopularBadge>Most popular</S.PopularBadge>}
                  <S.TierName>{plan.displayName}</S.TierName>
                  <S.TierPrice>{formatPrice(plan.monthlyUsd)}</S.TierPrice>
                  <S.TierAllowance>
                    {formatAllowance(plan.monthlyAllowance, allowanceUnit)}
                    {plan.key === 'free' ? '' : '×'} baseline usage / month
                  </S.TierAllowance>
                  {/* Lesson estimate is derived from the live catalog — when
                      the backend's referenceCosts or allowance multipliers
                      shift, this teaser re-renders without a code change.
                      `data` is guaranteed defined here because we're inside
                      the `ready` branch (`isLoading=false && anchors ok`). */}
                  <S.TierGuidance>{data ? formatPlanLessonsPerMonth(plan.key, data) : ''}</S.TierGuidance>
                  <S.TierTagline>{copy.tagline}</S.TierTagline>

                  <S.CtaSlot>
                    <Button
                      variant={popular ? 'primary' : 'secondary'}
                      onClick={onOpenSignUp}
                      data-analytics-id={`landing.pricing.card.${plan.key}`}
                    >
                      {copy.cta}
                    </Button>
                  </S.CtaSlot>
                </S.TierCard>
              );
            })}
          </S.TierGrid>
        )}

        <S.Body>{PRICING_TEASER.body}</S.Body>
        {/* Footnote resolves the "*" suffix on every "≈ N lessons*" estimate
            in the cards above. One sentence; same string used on PricingScreen
            and TopupControl so the meaning is consistent app-wide. */}
        {ready && <S.LessonFootnote>* {BASE_LESSON_FOOTNOTE}</S.LessonFootnote>}
        <S.CtaLink
          as={Link}
          href={PRICING_TEASER.comparisonCta.href}
          data-analytics-id="landing.pricing.see-plans"
          onClick={() => analytics.track('landing_cta_clicked', { cta: 'pricing_teaser_compare_plans' })}
        >
          {PRICING_TEASER.comparisonCta.label} →
        </S.CtaLink>
      </S.Inner>
    </S.Wrap>
  );
};
