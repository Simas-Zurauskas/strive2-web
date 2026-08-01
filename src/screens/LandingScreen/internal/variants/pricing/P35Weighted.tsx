'use client';

import Link from 'next/link';
import { Button } from '@/components';
import { analytics } from '@/lib/analytics';
import { useMotion, VIEWPORT_ONCE } from '@/theme/motionPresets';
import * as S from './P35Weighted.styles';
import { Footnote, SkBlock } from './parts.styles';
import { LESSON_FOOTNOTE, usePlanAnchors } from './usePlanAnchors';
import { COMPARE_CTA, MICRO, P13, P16, START_CTA } from './variants';

interface Props {
  onOpenSignUp: () => void;
}

/**
 * PRICING · VARIANT 35 — Weighted.
 *
 * The same content as 34 — plan name, price, the catalog's own sentence,
 * the monthly estimate, one button — given material presence instead of
 * air: a drawn border, a resting elevation that steps up once on hover,
 * two full-bleed rules parting the card into three zones, and a denser
 * type rhythm throughout.
 *
 * NOT ONE NEW WORD. The heading is 16's own `P16` object, imported rather
 * than duplicated. The rest is the billing catalog's — `name`, `price`,
 * `per`, `description` (the exact string /pricing prints under each plan
 * name) and the full `lessons` estimate with its period and asterisk
 * intact — plus three existing shared exports beneath the row: `P13.claim`,
 * the sanctioned standing claim, stated once for all three cards; the
 * shared `MICRO`; and the lesson footnote with `COMPARE_CTA`. No caption,
 * label or badge is composed here.
 *
 * THE SENTENCE IS CLAMPED, NOT SHORTENED. The string is handed to the DOM
 * whole and CSS shows seven lines of it — at the three-column measure that
 * is the entire longest blurb, so the clamp reads as a decision rather than
 * as a cut, and it makes every card's middle zone exactly one block tall.
 * Below the three-column measure the clamp is dropped and the paragraph's
 * own flex-grow keeps the row aligned instead. Nothing is ever sliced in
 * JavaScript, and there is no "read more" — that would need a word nobody
 * approved.
 *
 * BUTTON WEIGHT IS STILL THE ONLY DIFFERENCE between the tiers. Free is
 * filled because it is the door that costs nothing to walk through; the
 * two paid tiers are outlined. Every card is the same size, the same
 * surface and the same elevation — nothing is flagged or recommended.
 */
export const P35Weighted = ({ onOpenSignUp }: Props) => {
  const { fadeUp } = useMotion();
  const { ready, anchors } = usePlanAnchors();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={VIEWPORT_ONCE}
        transition={fadeUp.transition}
      >
        <S.Head>
          <S.Eyebrow>{P16.eyebrow}</S.Eyebrow>
          <S.Headline>{P16.headline}</S.Headline>
        </S.Head>

        {!ready ? (
          // The real grid at the real card height, padding, border weight
          // and elevation, with the same two rules and the same tall middle
          // zone, so the catalog arriving never moves anything.
          <S.Grid aria-hidden="true">
            {Array.from({ length: 3 }, (_, i) => (
              <S.SkCard key={i}>
                <S.SkName>
                  <SkBlock $w="38%" $h="0.6875rem" />
                </S.SkName>
                <SkBlock $w="58%" $h="2.375rem" />
                <S.RuleTop />
                {/* Five rows to match the 5-line description reservation
                    (was six against the old 7-line zone). */}
                <S.SkDesc>
                  <SkBlock $w="100%" $h="0.6875rem" />
                  <SkBlock $w="100%" $h="0.6875rem" />
                  <SkBlock $w="94%" $h="0.6875rem" />
                  <SkBlock $w="100%" $h="0.6875rem" />
                  <SkBlock $w="66%" $h="0.6875rem" />
                </S.SkDesc>
                <S.RuleBottom />
                <SkBlock $w="82%" $h="0.9375rem" />
                <S.SkCta>
                  <SkBlock $h="2.875rem" $radius="var(--radius-md)" />
                </S.SkCta>
              </S.SkCard>
            ))}
          </S.Grid>
        ) : (
          <S.Grid>
            {anchors.map((plan) => (
              // Frame is the pointer target and the backing sheet; Card is
              // the front plane that slides against it.
              <S.Frame key={plan.key}>
                <S.Card>
                <S.PlanName>{plan.name}</S.PlanName>

                <S.PriceRow>
                  {/* The catalog's free price string is "Free", which stacked
                      the same word twice under the "FREE" plan name — the
                      only card saying its one fact twice. "$0" keeps the
                      price zone a price, shaped like $12.99 / $24.99
                      (011-landing A3, approved Q2). */}
                  <S.Price>{plan.free ? '$0' : plan.price}</S.Price>
                  {/* Empty on the free tier — the catalog decides, not this
                      component. */}
                  {plan.per && <S.Per>{plan.per}</S.Per>}
                </S.PriceRow>

                <S.RuleTop />

                {/* The catalog's own blurb, handed over whole. */}
                <S.Description>{plan.description}</S.Description>

                <S.RuleBottom />

                {/* The catalog's full estimate, period and asterisk intact,
                    so the line needs no caption of its own. */}
                <S.Allowance>{plan.lessons}</S.Allowance>

                <S.CtaSlot>
                  <Button
                    type="button"
                    variant={plan.free ? 'primary' : 'secondary'}
                    aria-haspopup="dialog"
                    onClick={onOpenSignUp}
                    data-analytics-id={`landing.pricing.card.${plan.key}`}
                  >
                    {/* Verb CTAs, the house pattern of the sibling variants
                        (P11–P15's `ctaPaid: 'Get'`): a button reading
                        "Starter" names a thing, not an action, and repeats
                        the plan name two lines up. Reverses the §16·17·18
                        no-button-prose note (011-landing A4, approved Q3). */}
                    {plan.free ? START_CTA : `Get ${plan.name}`}
                  </Button>
                </S.CtaSlot>
                </S.Card>
              </S.Frame>
            ))}
          </S.Grid>
        )}

        {/* Stated once, under all three cards at once — the same line set
            inside a card would read as belonging to that tier. */}
        {ready && <S.Claim>{P13.claim}</S.Claim>}
        {ready && <S.Micro>{MICRO}</S.Micro>}

        <S.Foot>
          {ready && <Footnote>{`* ${LESSON_FOOTNOTE}`}</Footnote>}
          <S.Compare
            as={Link}
            href="/pricing"
            data-analytics-id="landing.pricing.see-plans"
            onClick={() =>
              analytics.track('landing_cta_clicked', { cta: 'pricing_teaser_compare_plans' })
            }
          >
            {`${COMPARE_CTA} →`}
          </S.Compare>
        </S.Foot>
      </S.Inner>
    </S.Wrap>
  );
};
